import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const sessionId = searchParams.get('session_id');
      
      if (sessionId) {
        // Stripe payment verification can be added here if needed
        setPaymentVerified(true);
        
        toast({
          title: "Payment Successful!",
          description: "Your appointment has been booked and payment processed.",
        });
      } else {
        // PayPal or other payment verification
        setPaymentVerified(true);
        
        toast({
          title: "Payment Successful!",
          description: "Your appointment has been booked and payment processed.",
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      toast({
        title: "Payment Verification Failed",
        description: "Please contact support if payment was processed but appointment not confirmed.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl text-green-800 dark:text-green-200">
                Payment Successful!
              </CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">
                Your appointment has been confirmed and payment processed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white dark:bg-background p-4 rounded-lg border">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  What's Next?
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• You will receive a confirmation email shortly</li>
                  <li>• A calendar invite will be sent to your email</li>
                  <li>• You can view your appointment details in your dashboard</li>
                  <li>• Our team will contact you 24 hours before your appointment</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => navigate("/dashboard")}
                  className="flex-1"
                >
                  View Dashboard
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;