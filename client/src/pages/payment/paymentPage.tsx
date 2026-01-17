
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import apiClient from "../../lib/apiClient";
import { API_ROUTES } from "../../config/routes";
import { toast } from "sonner";
import { useAppSelector } from "../../lib/store";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  
  // Assuming user object has plan = 'pro' or isPaid = true
  const isPro = user?.isPaid || user?.plan === "pro"; 

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      // If user is already pro, open customer portal to manage subscription
      if (isPro) {
          const { data } = await apiClient.post(API_ROUTES.PAYMENT.CREATE_PORTAL_SESSION, {
              returnUrl: window.location.origin + "/payment", // Return to payment page after managing
          });
          if (data.url) {
              window.location.href = data.url;
          } else {
              toast.error("Failed to open management portal.");
          }
          return;
      }

      // Otherwise, create checkout session for new subscription
      console.log("Initializing Stripe with key:", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const stripe = await stripePromise;

      if (!stripe) {
        console.error("Stripe failed to initialize.");
        toast.error("Stripe failed to initialize. Please check your configuration.");
        setLoading(false);
        return;
      }

      console.log("Sending request to:", API_ROUTES.PAYMENT.CREATE_SESSION);
      const { data } = await apiClient.post(API_ROUTES.PAYMENT.CREATE_SESSION, {
        successUrl: window.location.origin + "/payment/success",
        cancelUrl: window.location.origin + "/payment/cancel",
      });
      
      console.log("Received data:", data);

      if (data.url) {
         window.location.href = data.url;
      } else {
        console.error("No URL in response");
        toast.error("Failed to create checkout session.");
      }

    } catch (error) {
      console.error("Checkout Error:", error);
      // Toast handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Upgrade Your Productivity</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Unlock the full potential of your team with our Pro plan. Unlimited projects, tasks, and advanced features.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="border border-border/50 rounded-xl p-8 bg-card/50 backdrop-blur shadow-sm relative overflow-hidden flex flex-col">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <div className="text-3xl font-bold">$0<span className="text-base font-normal text-muted-foreground">/month</span></div>
            <p className="text-muted-foreground mt-4">Perfect for getting started.</p>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center gap-2"><Check className="h-5 w-5 text-primary" /> <span>Up to 3 Projects</span></li>
            <li className="flex items-center gap-2"><Check className="h-5 w-5 text-primary" /> <span>Basic Task Management</span></li>
            <li className="flex items-center gap-2"><Check className="h-5 w-5 text-primary" /> <span>Limited Storage</span></li>
          </ul>
          <button 
            className="w-full py-2.5 px-4 rounded-lg bg-secondary/50 text-secondary-foreground font-medium cursor-default"
            disabled
          >
            Active Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="border-2 border-primary rounded-xl p-8 bg-card relative overflow-hidden shadow-lg flex flex-col">
           <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
            POPULAR
          </div>
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <div className="text-3xl font-bold">$10<span className="text-base font-normal text-muted-foreground">/month</span></div>
            <p className="text-muted-foreground mt-4">For power users and teams.</p>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            <li className="flex items-center gap-2"><Check className="h-5 w-5 text-primary" /> <span>Unlimited Projects</span></li>
            <li className="flex items-center gap-2"><Check className="h-5 w-5 text-primary" /> <span>Advanced Statistics</span></li>
            <li className="flex items-center gap-2"><Check className="h-5 w-5 text-primary" /> <span>Priority Support</span></li>
             <li className="flex items-center gap-2"><Check className="h-5 w-5 text-primary" /> <span>Everything in Free</span></li>
          </ul>
          
          {isPro ? (
               <button 
               onClick={handleCheckout}
               disabled={loading}
               className="w-full py-2.5 px-4 rounded-lg bg-green-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
             >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Manage Subscription"}
             </button>
          ) : (
            <button 
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upgrade to Pro"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}