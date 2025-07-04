import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Heart, Mail, Lock, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate login (replace with actual authentication)
    console.log("Login attempt:", formData);
    
    toast({
      title: "Welcome back!",
      description: "You have been successfully logged in.",
    });

    // Reset form
    setFormData({
      email: "",
      password: ""
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Heart className="h-8 w-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  Welcome Back
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Sign in to access your Rongduno account
              </p>
            </div>

            <Card className="shadow-pride">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Sign In
                </CardTitle>
                <CardDescription>
                  Enter your credentials to access your account and services
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-10 transition-smooth focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="pl-10 transition-smooth focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="text-right">
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot your password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" variant="pride" className="w-full" size="lg">
                    <LogIn className="h-5 w-5" />
                    Sign In
                  </Button>
                </form>

                {/* Register Link */}
                <div className="mt-6 text-center">
                  <p className="text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary hover:underline font-medium">
                      Create one here
                    </Link>
                  </p>
                </div>

                {/* Quick Access */}
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Need immediate support?
                  </p>
                  <div className="space-y-2">
                    <Button variant="healthcare-green" size="sm" className="w-full" asChild>
                      <Link to="/crisis-support">
                        Crisis Support Available 24/7
                      </Link>
                    </Button>
                    <Button variant="healthcare-teal" size="sm" className="w-full" asChild>
                      <Link to="/services">
                        Browse Services
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;