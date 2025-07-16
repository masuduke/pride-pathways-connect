import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Shield, Award, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import prideImage1 from "@/assets/pride-parade-1.jpg";
import prideImage2 from "@/assets/pride-parade-2.jpg";
import prideImage3 from "@/assets/pride-parade-3.jpg";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection />
        
        {/* Pride Images Gallery */}
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="overflow-hidden rounded-lg shadow-card hover:shadow-pride transition-smooth">
                <img 
                  src={prideImage1} 
                  alt="London LGBT+ Pride Parade celebration with rainbow flags and diverse community"
                  className="w-full h-48 object-cover hover:scale-105 transition-smooth"
                />
              </div>
              <div className="overflow-hidden rounded-lg shadow-card hover:shadow-pride transition-smooth">
                <img 
                  src={prideImage2} 
                  alt="Joyful LGBT+ pride celebration with dancing people and pride banners"
                  className="w-full h-48 object-cover hover:scale-105 transition-smooth"
                />
              </div>
              <div className="overflow-hidden rounded-lg shadow-card hover:shadow-pride transition-smooth">
                <img 
                  src={prideImage3} 
                  alt="London LGBT+ pride march with colorful costumes and supportive crowd"
                  className="w-full h-48 object-cover hover:scale-105 transition-smooth"
                />
              </div>
            </div>
          </div>
        </section>
        
        <ServicesSection />
        
        {/* Why Choose Us Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose <span className="bg-gradient-pride bg-clip-text text-transparent">Rongduno</span>?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We're more than just a healthcare provider - we're your community, 
                your advocates, and your support system.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center shadow-card hover:shadow-pride transition-smooth">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-healthcare-blue/10 rounded-full flex items-center justify-center mb-4">
                    <Heart className="h-8 w-8 text-healthcare-blue" />
                  </div>
                  <CardTitle>LGBT+ Affirming</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    All our staff are trained in LGBT+ cultural competency and affirming care practices
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center shadow-card hover:shadow-pride transition-smooth">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-healthcare-green/10 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-healthcare-green" />
                  </div>
                  <CardTitle>Safe & Confidential</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Your privacy and safety are our top priorities. All services are completely confidential
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center shadow-card hover:shadow-pride transition-smooth">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-healthcare-teal/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-healthcare-teal" />
                  </div>
                  <CardTitle>Community Focused</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Built by and for the LGBT+ community, with peer support and community connections
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center shadow-card hover:shadow-pride transition-smooth">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Expert Care</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Licensed professionals with specialized training in LGBT+ health and wellness
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Community Testimonials */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Community <span className="bg-gradient-pride bg-clip-text text-transparent">Stories</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Hear from our community members about their experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-pride rounded-full flex items-center justify-center text-white font-bold">
                      A
                    </div>
                    <div>
                      <h4 className="font-semibold">Alex</h4>
                      <p className="text-sm text-muted-foreground">Community Member</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">
                    "Rongduno gave me the courage to be myself. The therapy sessions 
                    helped me navigate coming out to my family, and the support groups 
                    connected me with amazing people."
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-pride rounded-full flex items-center justify-center text-white font-bold">
                      S
                    </div>
                    <div>
                      <h4 className="font-semibold">Sam</h4>
                      <p className="text-sm text-muted-foreground">Community Member</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">
                    "The HIV testing here is so comfortable and non-judgmental. 
                    The staff made me feel safe and supported throughout the entire process."
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-pride rounded-full flex items-center justify-center text-white font-bold">
                      J
                    </div>
                    <div>
                      <h4 className="font-semibold">Jordan</h4>
                      <p className="text-sm text-muted-foreground">Community Member</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">
                    "Finally found a place where I don't have to explain myself. 
                    The community here understands, and that makes all the difference 
                    in my healing journey."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact/Chat CTA */}
        <section className="py-20 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Connect?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Whether you need immediate support, want to learn more about our services, 
              or just want to chat - we're here for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="pride-outline" size="lg">
                <MessageCircle className="h-5 w-5" />
                Start Chat
              </Button>
              <Button variant="pride-outline" size="lg" asChild>
                <Link to="/contact">
                  <Phone className="h-5 w-5" />
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

export default Homepage;