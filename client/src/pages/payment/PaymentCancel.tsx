
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function PaymentCancel() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      <XCircle className="h-20 w-20 text-red-500 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        You have cancelled the checkout process. No charges were made.
      </p>
      <div className="flex gap-4">
         <Link 
            to="/payment" 
            className="px-6 py-3 border border-input rounded-lg font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
        >
            Try Again
        </Link>
        <Link 
            to="/dashboard" 
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
            Return to Dashboard
        </Link>
       
      </div>
    </div>
  );
}
