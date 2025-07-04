import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Shield, Users, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export const ServicesSection = () => {
  const services = [
    {
      id: "mental-health",
      title: "Mental Health Therapy",
      description: "Professional counseling services with LGBT+ affirming therapists. Individual and group sessions available.",
      icon: Brain,
      pricing: "Starting at $80/hour",
      features: ["Individual Therapy", "Group Sessions", "Crisis Support", "Specialized LGBT+ Care"],
      variant: "healthcare" as const,
      bookingText: "Book Session"
    },
    {
      id: "hiv-testing",
      title: "HIV Testing & Support",
      description: "Confidential HIV testing with pre and post-test counseling. Quick results and ongoing support.",
      icon: Shield,
      pricing: "Free Testing",
      features: ["Rapid Testing", "Confidential Results", "Pre/Post Counseling", "Support Groups"],
      variant: "healthcare-green" as const,
      bookingText: "Schedule Test"
    },
    {
      id: "community-support",
      title: "Community Support Groups",
      description: "Connect with others in safe, supportive group environments. Various topics and age groups.",
      icon: Users,
      pricing: "Free",
      features: ["Peer Support", "Topic-Specific Groups", "Safe Environment", "Regular Meetings"],
      variant: "healthcare-teal" as const,
      bookingText: "Join Group"
    }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Our <span className="bg-gradient-pride bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive healthcare and support services designed specifically for the LGBT+ community. 
            All services are provided in a safe, inclusive, and affirming environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="shadow-card hover:shadow-pride transition-smooth">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg ${
                      service.variant === 'healthcare' ? 'bg-healthcare-blue/10' :
                      service.variant === 'healthcare-green' ? 'bg-healthcare-green/10' :
                      'bg-healthcare-teal/10'
                    }`}>
                      <IconComponent className={`h-6 w-6 ${
                        service.variant === 'healthcare' ? 'text-healthcare-blue' :
                        service.variant === 'healthcare-green' ? 'text-healthcare-green' :
                        'text-healthcare-teal'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <div className="text-sm font-semibold text-primary">{service.pricing}</div>
                    </div>
                  </div>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Heart className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button 
                    variant={service.variant} 
                    className="w-full" 
                    asChild
                  >
                    <Link to={`/book/${service.id}`}>
                      <Calendar className="h-4 w-4" />
                      {service.bookingText}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button variant="pride" size="lg" asChild>
            <Link to="/services">
              <Clock className="h-5 w-5" />
              View All Services
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};