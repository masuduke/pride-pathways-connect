import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Brain, Shield, Users, Calendar, Clock, Crown, CheckCircle, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const BookService = () => {
  const { serviceId } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const isSubscription = searchParams.get('subscription') === 'true';
  const preselectedDuration = searchParams.get('duration');
  const preselectedPrice = searchParams.get('price');

  const [bookingData, setBookingData] = useState({
    preferredDate: "",
    preferredTime: "",
    selectedTier: preselectedDuration ? `${preselectedDuration}` : "60",
    specialRequests: "",
    insuranceProvider: "",
    paymentMethod: "stripe",
    bookingType: isSubscription ? "subscription" : "single"
  });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [existingSubscription, setExistingSubscription] = useState<any>(null);

  const pricingTiers = [
    { duration: 30, price: 15, label: "30 Minutes", description: "Quick check-in session" },
    { duration: 60, price: 30, label: "60 Minutes", description: "Standard therapy session" },
    { duration: 90, price: 40, label: "90 Minutes", description: "Extended deep-dive session" },
  ];

  const subscriptionPlan = {
    name: "Monthly Wellness Plan",
    price: 100,
    sessions: 4,
    sessionDuration: 60,
    pricePerSession: 25
  };

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setUser(user);
    
    // Check for existing subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();
    
    if (subscription) {
      setExistingSubscription(subscription);
    }
  };

  const services = {
    "mental-health": {
      title: "Mental Health Therapy",
      description: "Professional counseling with LGBT+ affirming therapists",
      icon: Brain,
      hasPricingTiers: true,
      variant: "healthcare" as const
    },
    "hiv-testing": {
      title: "HIV Testing & Support",
      description: "Confidential HIV testing with counseling support",
      icon: Shield,
      basePrice: 0,
      duration: ["0.5", "1"],
      variant: "healthcare-green" as const
    },
    "community-support": {
      title: "Community Support Groups",
      description: "Peer support in safe group environments",
      icon: Users,
      basePrice: 0,
      duration: ["1", "1.5", "2"],
      variant: "healthcare-teal" as const
    }
  };

  const currentService = services[serviceId as keyof typeof services];

  if (!currentService) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
            <p className="text-muted-foreground">The requested service could not be found.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const IconComponent = currentService.icon;
  
  const selectedTier = pricingTiers.find(t => t.duration === parseInt(bookingData.selectedTier));
  const currentPrice = bookingData.bookingType === 'subscription' 
    ? subscriptionPlan.price 
    : (selectedTier?.price || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book an appointment.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const serviceMapping = {
        "mental-health": "Mental Health Therapy",
        "hiv-testing": "HIV Testing & Support", 
        "community-support": "Community Support Groups"
      };

      const serviceName = serviceMapping[serviceId as keyof typeof serviceMapping];
      
      const { data: service, error: serviceError } = await supabase
        .from("services")
        .select("id")
        .eq("name", serviceName)
        .single();

      if (serviceError || !service) {
        throw new Error("Service not found");
      }

      const scheduledDateTime = new Date(`${bookingData.preferredDate}T${bookingData.preferredTime}:00`);
      
      if (bookingData.bookingType === 'subscription') {
        // Process subscription payment
        await processStripeSubscription(service.id, scheduledDateTime);
      } else if (existingSubscription && existingSubscription.sessions_remaining > 0) {
        // Use subscription session
        await useSubscriptionSession(service.id, scheduledDateTime);
      } else if (currentPrice > 0) {
        // Process single session payment
        await processStripePayment(service.id, scheduledDateTime);
      } else {
        // Free service
        const { error } = await supabase
          .from("appointments")
          .insert({
            user_id: user.id,
            service_id: service.id,
            scheduled_at: scheduledDateTime.toISOString(),
            duration_minutes: parseInt(bookingData.selectedTier),
            notes: bookingData.specialRequests || null,
            is_online: false
          });

        if (error) throw error;

        toast({
          title: "Booking Confirmed!",
          description: "Your appointment has been successfully booked.",
        });

        navigate("/dashboard");
      }

    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "Unable to book appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const useSubscriptionSession = async (serviceId: string, scheduledDateTime: Date) => {
    // Create appointment using subscription
    const { error: appointmentError } = await supabase
      .from("appointments")
      .insert({
        user_id: user.id,
        service_id: serviceId,
        scheduled_at: scheduledDateTime.toISOString(),
        duration_minutes: existingSubscription.session_duration_minutes,
        notes: `${bookingData.specialRequests || ''}\n[Subscription Session - Priority Booking]`,
        is_online: false
      });

    if (appointmentError) throw appointmentError;

    // Decrement sessions remaining
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({ sessions_remaining: existingSubscription.sessions_remaining - 1 })
      .eq("id", existingSubscription.id);

    if (updateError) throw updateError;

    toast({
      title: "Session Booked!",
      description: `You have ${existingSubscription.sessions_remaining - 1} sessions remaining this month.`,
    });

    navigate("/dashboard");
  };

  const processStripePayment = async (serviceId: string, scheduledDateTime: Date) => {
    const appointmentData = {
      serviceName: currentService.title,
      date: bookingData.preferredDate,
      time: bookingData.preferredTime,
      duration: bookingData.selectedTier,
      specialRequests: bookingData.specialRequests,
      insuranceProvider: bookingData.insuranceProvider
    };

    const { data, error } = await supabase.functions.invoke('stripe-payment', {
      body: { 
        amount: currentPrice, 
        serviceId: serviceId,
        appointmentData,
        durationMinutes: parseInt(bookingData.selectedTier)
      }
    });

    if (error) throw error;
    
    window.open(data.url, '_blank');
  };

  const processStripeSubscription = async (serviceId: string, scheduledDateTime: Date) => {
    const { data, error } = await supabase.functions.invoke('stripe-subscription', {
      body: { 
        planName: subscriptionPlan.name,
        amount: subscriptionPlan.price,
        sessionsPerMonth: subscriptionPlan.sessions,
        sessionDuration: subscriptionPlan.sessionDuration,
        firstAppointment: {
          date: bookingData.preferredDate,
          time: bookingData.preferredTime,
          serviceId: serviceId,
          notes: bookingData.specialRequests
        }
      }
    });

    if (error) throw error;
    
    window.open(data.url, '_blank');
  };

  const handleChange = (field: string, value: string) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isMentalHealth = serviceId === 'mental-health';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Service Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <IconComponent className="h-8 w-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  Book <span className="bg-gradient-pride bg-clip-text text-transparent">{currentService.title}</span>
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                {currentService.description}
              </p>
            </div>

            {/* Existing Subscription Banner */}
            {existingSubscription && existingSubscription.sessions_remaining > 0 && (
              <Card className="mb-8 border-2 border-primary/20 bg-primary/5">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <Crown className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-semibold">Active Subscription</p>
                        <p className="text-sm text-muted-foreground">
                          You have {existingSubscription.sessions_remaining} sessions remaining this month
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-primary">Priority Scheduling</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Booking Form */}
              <Card className="shadow-pride">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Schedule Your Appointment
                  </CardTitle>
                  <CardDescription>
                    Please fill out the details below to book your service
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Session Type Selection - Mental Health Only */}
                    {isMentalHealth && !existingSubscription && (
                      <div className="space-y-3">
                        <Label>Session Type</Label>
                        <RadioGroup 
                          value={bookingData.bookingType} 
                          onValueChange={(value) => handleChange("bookingType", value)}
                          className="grid grid-cols-1 gap-3"
                        >
                          <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="single" id="single" />
                            <Label htmlFor="single" className="flex-1 cursor-pointer">
                              <div className="font-medium">Single Session</div>
                              <div className="text-sm text-muted-foreground">Pay per session</div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 border-2 border-primary/20 rounded-lg p-4 cursor-pointer bg-primary/5 hover:bg-primary/10 transition-colors">
                            <RadioGroupItem value="subscription" id="subscription" />
                            <Label htmlFor="subscription" className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Monthly Subscription</span>
                                <Badge variant="secondary" className="text-xs">Best Value</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                ${subscriptionPlan.price}/month - 4 sessions included
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}

                    {/* Session Duration - for single sessions */}
                    {isMentalHealth && bookingData.bookingType === 'single' && (
                      <div className="space-y-3">
                        <Label>Session Duration</Label>
                        <RadioGroup 
                          value={bookingData.selectedTier} 
                          onValueChange={(value) => handleChange("selectedTier", value)}
                          className="grid grid-cols-1 gap-2"
                        >
                          {pricingTiers.map((tier) => (
                            <div 
                              key={tier.duration}
                              className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-colors ${
                                bookingData.selectedTier === `${tier.duration}` 
                                  ? 'border-primary bg-primary/5' 
                                  : 'hover:bg-muted/50'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value={`${tier.duration}`} id={`tier-${tier.duration}`} />
                                <Label htmlFor={`tier-${tier.duration}`} className="cursor-pointer">
                                  <div className="font-medium">{tier.label}</div>
                                  <div className="text-sm text-muted-foreground">{tier.description}</div>
                                </Label>
                              </div>
                              <div className="text-xl font-bold text-primary">${tier.price}</div>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="preferredDate">Preferred Date</Label>
                        <Input
                          id="preferredDate"
                          type="date"
                          value={bookingData.preferredDate}
                          onChange={(e) => handleChange("preferredDate", e.target.value)}
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferredTime">Preferred Time</Label>
                        <Select onValueChange={(value) => handleChange("preferredTime", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="09:00">9:00 AM</SelectItem>
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                            <SelectItem value="14:00">2:00 PM</SelectItem>
                            <SelectItem value="15:00">3:00 PM</SelectItem>
                            <SelectItem value="16:00">4:00 PM</SelectItem>
                            <SelectItem value="17:00">5:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Insurance Provider */}
                    <div className="space-y-2">
                      <Label htmlFor="insuranceProvider">Insurance Provider (Optional)</Label>
                      <Input
                        id="insuranceProvider"
                        placeholder="e.g., Blue Cross, Aetna, Self-pay"
                        value={bookingData.insuranceProvider}
                        onChange={(e) => handleChange("insuranceProvider", e.target.value)}
                      />
                    </div>

                    {/* Special Requests */}
                    <div className="space-y-2">
                      <Label htmlFor="specialRequests">Special Requests or Notes</Label>
                      <Textarea
                        id="specialRequests"
                        placeholder="Any specific needs or preferences we should know about?"
                        value={bookingData.specialRequests}
                        onChange={(e) => handleChange("specialRequests", e.target.value)}
                        rows={3}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      variant={currentService.variant} 
                      className="w-full" 
                      size="lg"
                      disabled={loading}
                    >
                      {existingSubscription && existingSubscription.sessions_remaining > 0 ? (
                        <>
                          <Crown className="h-5 w-5" />
                          {loading ? "Booking..." : "Use Subscription Session"}
                        </>
                      ) : bookingData.bookingType === 'subscription' ? (
                        <>
                          <CreditCard className="h-5 w-5" />
                          {loading ? "Processing..." : `Subscribe - $${subscriptionPlan.price}/month`}
                        </>
                      ) : (
                        <>
                          <Calendar className="h-5 w-5" />
                          {loading ? "Booking..." : currentPrice > 0 ? `Pay $${currentPrice} & Book` : "Confirm Booking"}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Booking Summary */}
              <div className="space-y-6">
                
                {/* Pricing Summary */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" />
                      Booking Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className="font-medium">{currentService.title}</span>
                    </div>
                    
                    {isMentalHealth && (
                      <>
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="font-medium">
                            {existingSubscription ? 'Subscription Session' : 
                             bookingData.bookingType === 'subscription' ? 'Monthly Subscription' : 'Single Session'}
                          </span>
                        </div>
                        
                        {bookingData.bookingType === 'single' && !existingSubscription && (
                          <div className="flex justify-between">
                            <span>Duration:</span>
                            <span className="font-medium">{selectedTier?.label || '60 Minutes'}</span>
                          </div>
                        )}
                        
                        {bookingData.bookingType === 'subscription' && (
                          <div className="text-sm space-y-1 pt-2 border-t">
                            <div className="flex items-center gap-2 text-primary">
                              <CheckCircle className="h-4 w-4" />
                              4 x 60-minute sessions
                            </div>
                            <div className="flex items-center gap-2 text-primary">
                              <CheckCircle className="h-4 w-4" />
                              Priority scheduling
                            </div>
                            <div className="flex items-center gap-2 text-primary">
                              <CheckCircle className="h-4 w-4" />
                              Save $20/month
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    {existingSubscription ? (
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Sessions Left:</span>
                        <span className="text-primary">{existingSubscription.sessions_remaining}</span>
                      </div>
                    ) : currentPrice > 0 && (
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total:</span>
                        <span className="text-primary">
                          ${currentPrice}{bookingData.bookingType === 'subscription' ? '/month' : ''}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Important Notes */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Important Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p>• Please arrive 10 minutes early for your appointment</p>
                    <p>• Bring a valid ID and insurance card if applicable</p>
                    <p>• Cancellations must be made 24 hours in advance</p>
                    <p>• All services are provided in a safe, confidential environment</p>
                    <p>• Subscription sessions reset monthly</p>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="mb-2">
                      If you have questions about booking or need assistance:
                    </p>
                    <p>📞 <strong>+44 7404 792007</strong></p>
                    <p>✉️ <strong>hello@rongduno.org</strong></p>
                    <p className="mt-3 text-muted-foreground">
                      Our support team is available Monday-Friday, 9 AM - 7 PM
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookService;
