
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccess() {
  
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      <CheckCircle2 className="h-20 w-20 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Thank you for your purchase. Your account has been upgraded to Pro. You can now access all premium features.
      </p>
      <Link 
        to="/dashboard" 
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
