import { useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Brain, Shield, Users, Calendar, Clock, DollarSign, User, CreditCard } from "lucide-react";

const BookService = () => {
  const { serviceId } = useParams();
  const { toast } = useToast();
  
  const [bookingData, setBookingData] = useState({
    preferredDate: "",
    preferredTime: "",
    duration: "1",
    specialRequests: "",
    insuranceProvider: "",
    paymentMethod: ""
  });

  const services = {
    "mental-health": {
      title: "Mental Health Therapy",
      description: "Professional counseling with LGBT+ affirming therapists",
      icon: Brain,
      basePrice: 80,
      duration: ["1", "1.5", "2"],
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
  const totalCost = currentService.basePrice * parseFloat(bookingData.duration || "1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate booking ID
    const bookingId = `BK${Date.now().toString().slice(-6)}`;
    
    console.log("Booking details:", {
      serviceId,
      bookingId,
      ...bookingData,
      totalCost
    });
    
    toast({
      title: "Booking Confirmed!",
      description: `Your ${currentService.title} appointment has been scheduled. Booking ID: ${bookingId}`,
    });
  };

  const handleChange = (field: string, value: string) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

                    {/* Duration */}
                    <div className="space-y-2">
                      <Label htmlFor="duration">Session Duration (hours)</Label>
                      <Select onValueChange={(value) => handleChange("duration", value)} defaultValue="1">
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentService.duration.map((dur) => (
                            <SelectItem key={dur} value={dur}>
                              {dur} hour{parseFloat(dur) > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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

                    {/* Payment Method */}
                    {currentService.basePrice > 0 && (
                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select onValueChange={(value) => handleChange("paymentMethod", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="insurance">Insurance</SelectItem>
                            <SelectItem value="credit-card">Credit Card</SelectItem>
                            <SelectItem value="debit-card">Debit Card</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

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

                    <Button type="submit" variant={currentService.variant} className="w-full" size="lg">
                      <Calendar className="h-5 w-5" />
                      Confirm Booking
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Booking Summary */}
              <div className="space-y-6">
                
                {/* Service Details */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" />
                      Service Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className="font-medium">{currentService.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{bookingData.duration || "1"} hour(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Base Rate:</span>
                      <span className="font-medium">
                        {currentService.basePrice === 0 ? "Free" : `$${currentService.basePrice}/hour`}
                      </span>
                    </div>
                    {currentService.basePrice > 0 && (
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total Cost:</span>
                        <span className="text-primary">${totalCost}</span>
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
                    <p>• We offer sliding scale pricing for those who qualify</p>
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
                    <p>📞 <strong>(555) 123-PRIDE</strong></p>
                    <p>✉️ <strong>hello@pridehealth.org</strong></p>
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