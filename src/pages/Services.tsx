import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Shield, Users, Heart, Calendar, Clock, Star, CheckCircle, Crown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Services = () => {
  const therapyPricingTiers = [
    { duration: 30, price: 15, label: "30 Minutes" },
    { duration: 60, price: 30, label: "60 Minutes" },
    { duration: 90, price: 40, label: "90 Minutes" },
  ];

  const subscriptionPlan = {
    name: "Monthly Wellness Plan",
    price: 100,
    sessions: 4,
    sessionDuration: 60,
    savings: 20,
    features: [
      "4 x 60-minute sessions per month",
      "Priority scheduling",
      "Discounted rate ($25/session vs $30)",
      "Flexible rescheduling",
      "Email support between sessions"
    ]
  };

  const services = [
    {
      id: "mental-health",
      title: "Mental Health Therapy",
      description: "Professional, affirming mental health services with specialized LGBT+ therapists",
      longDescription: "Our mental health services are designed specifically for the LGBT+ community, providing a safe and affirming space to explore your mental wellness. Our licensed therapists understand the unique challenges faced by LGBT+ individuals and provide specialized care.",
      icon: Brain,
      pricingTiers: therapyPricingTiers,
      hasSubscription: true,
      features: [
        "Individual Therapy Sessions",
        "Crisis Intervention Support",
        "Trauma-Informed Care",
        "Coming Out Support",
        "Gender Identity Exploration",
        "Relationship Counseling",
        "Depression & Anxiety Treatment",
        "LGBTQ+-Affirming Approach"
      ],
      variant: "healthcare" as const,
      availability: "Monday-Friday 9AM-7PM"
    },
    {
      id: "hiv-testing",
      title: "HIV Testing & Prevention",
      description: "Confidential HIV testing with comprehensive support and education",
      longDescription: "We provide free, confidential HIV testing in a supportive environment. Our services include pre-test counseling, rapid testing, post-test support, and connections to treatment or prevention resources as needed.",
      icon: Shield,
      pricing: "Free of Charge",
      duration: "30-45 minutes",
      features: [
        "Rapid HIV Testing",
        "Pre-Test Counseling",
        "Post-Test Support",
        "PrEP Consultation",
        "STI Screening",
        "Risk Assessment",
        "Prevention Education",
        "Treatment Referrals"
      ],
      variant: "healthcare-green" as const,
      availability: "Walk-ins Welcome"
    },
    {
      id: "community-support",
      title: "Community Support Groups",
      description: "Peer support groups for various topics and life stages",
      longDescription: "Join our vibrant community support groups where you can connect with others who share similar experiences. We offer various groups focusing on different topics, ages, and identities within the LGBT+ spectrum.",
      icon: Users,
      pricing: "Free for Members",
      duration: "60-90 minutes",
      features: [
        "Youth Support Groups (13-18)",
        "Adult Support Groups (18+)",
        "Senior LGBT+ Groups (55+)",
        "Trans Support Circles",
        "Coming Out Groups",
        "Relationship Support",
        "Grief & Loss Support",
        "Career & Workplace Issues"
      ],
      variant: "healthcare-teal" as const,
      availability: "Multiple Times Weekly"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our <span className="bg-gradient-pride bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Comprehensive, affirming healthcare and support services designed specifically for the LGBT+ community. 
              Every service is provided with respect, confidentiality, and cultural competency.
            </p>
            <div className="flex items-center justify-center gap-2 text-primary">
              <Star className="h-5 w-5 fill-current" />
              <span className="font-semibold">Trusted by 5000+ community members</span>
            </div>
          </div>
        </section>

        {/* Mental Health Therapy - Featured with Pricing Tiers */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4 text-primary border-primary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Mental Health Therapy</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Professional, affirming mental health services with specialized LGBT+ therapists.
                  Choose the session length that works best for you.
                </p>
              </div>

              {/* Pricing Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {therapyPricingTiers.map((tier) => (
                  <Card key={tier.duration} className="shadow-card hover:shadow-pride transition-smooth text-center">
                    <CardHeader>
                      <div className="mx-auto p-3 rounded-full bg-healthcare-blue/10 w-fit mb-2">
                        <Clock className="h-6 w-6 text-healthcare-blue" />
                      </div>
                      <CardTitle className="text-xl">{tier.label}</CardTitle>
                      <CardDescription>Individual Therapy Session</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-primary mb-2">${tier.price}</div>
                      <p className="text-sm text-muted-foreground">per session</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="healthcare" className="w-full" asChild>
                        <Link to={`/book/mental-health?duration=${tier.duration}&price=${tier.price}`}>
                          <Calendar className="h-4 w-4" />
                          Book Session
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Monthly Subscription Plan */}
              <Card className="shadow-pride border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Crown className="h-6 w-6 text-primary" />
                    <Badge className="bg-primary text-primary-foreground">Best Value</Badge>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl">{subscriptionPlan.name}</CardTitle>
                  <CardDescription className="text-base">
                    Save ${subscriptionPlan.savings} per month with our subscription plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                      <div className="text-5xl font-bold text-primary mb-1">${subscriptionPlan.price}</div>
                      <p className="text-muted-foreground">per month</p>
                      <p className="text-sm text-primary font-medium mt-2">
                        That's just ${subscriptionPlan.price / subscriptionPlan.sessions}/session!
                      </p>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-3">What's Included:</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {subscriptionPlan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-center">
                      <Button variant="healthcare" size="lg" asChild>
                        <Link to="/book/mental-health?subscription=true">
                          <Crown className="h-5 w-5" />
                          Subscribe Now
                        </Link>
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">Cancel anytime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Other Services Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Additional Services</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Free community services to support your health and wellbeing journey.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {services.filter(s => s.id !== 'mental-health').map((service) => {
                const IconComponent = service.icon;
                return (
                  <Card key={service.id} className="shadow-card hover:shadow-pride transition-smooth h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-lg ${
                          service.variant === 'healthcare-green' ? 'bg-healthcare-green/10' :
                          'bg-healthcare-teal/10'
                        }`}>
                          <IconComponent className={`h-6 w-6 ${
                            service.variant === 'healthcare-green' ? 'text-healthcare-green' :
                            'text-healthcare-teal'
                          }`} />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{service.title}</CardTitle>
                          <div className="text-sm font-semibold text-primary">{service.pricing}</div>
                        </div>
                      </div>
                      <CardDescription className="text-base">{service.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{service.longDescription}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="flex items-center gap-2 font-medium">
                            <Clock className="h-4 w-4 text-primary" />
                            Duration
                          </div>
                          <div className="text-muted-foreground">{service.duration}</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 font-medium">
                            <Calendar className="h-4 w-4 text-primary" />
                            Availability
                          </div>
                          <div className="text-muted-foreground">{service.availability}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">What's Included:</h4>
                        <ul className="grid grid-cols-1 gap-1 text-sm">
                          {service.features.slice(0, 4).map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        {service.features.length > 4 && (
                          <p className="text-xs text-muted-foreground mt-2">
                            +{service.features.length - 4} more services
                          </p>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button 
                        variant={service.variant} 
                        className="w-full" 
                        asChild
                      >
                        <Link to={`/book/${service.id}`}>
                          <Calendar className="h-4 w-4" />
                          Book Now
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Take the Next Step?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Join our supportive community and take control of your health and wellness journey. 
              We're here to support you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="pride-outline" size="lg" asChild>
                <Link to="/register">
                  <Heart className="h-5 w-5" />
                  Create Account
                </Link>
              </Button>
              <Button variant="pride-outline" size="lg" asChild>
                <Link to="/contact">
                  <Calendar className="h-5 w-5" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
