import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../../components/PaymentForm";
import Plans from "../../components/Plans";
import { useState } from "react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const handleSelectPlan = (price: number) => {
    setSelectedPlan(price);
  };

  return (
    <div>
      {!selectedPlan ? (
        <Plans onSelectPlan={handleSelectPlan} />
      ) : (
        <Elements stripe={stripePromise}>
          <PaymentForm amount={selectedPlan * 100} />
        </Elements>
      )}
    </div>
  );
};

export default PaymentPage;
