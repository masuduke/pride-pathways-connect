
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MemberIDCard } from "@/components/MemberIDCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, User, Plus, MapPin, Video, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Appointment {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  is_online: boolean;
  notes?: string;
  services: {
    name: string;
    service_type: string;
  };
  providers?: {
    profiles: {
      first_name?: string;
      last_name?: string;
    };
  };
}

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    checkUser();
    fetchAppointments();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setUser(user);
    
    // Fetch user profile with membership number
    const { data: profileData } = await supabase
      .from("profiles")
      .select("membership_number, display_name, first_name, last_name, date_of_birth, created_at")
      .eq("user_id", user.id)
      .single();
    
    setProfile(profileData);
  };

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id,
          scheduled_at,
          duration_minutes,
          status,
          is_online,
          notes,
          services(name, service_type),
          providers(
            profiles(first_name, last_name)
          )
        `)
        .order("scheduled_at", { ascending: true });

      if (error) {
        console.error("Error fetching appointments:", error);
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive"
        });
        return;
      }

      setAppointments(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "text-healthcare-blue";
      case "completed":
        return "text-healthcare-green";
      case "cancelled":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const upcomingAppointments = appointments.filter(
    apt => apt.status === "scheduled" && new Date(apt.scheduled_at) > new Date()
  );

  const pastAppointments = appointments.filter(
    apt => apt.status === "completed" || new Date(apt.scheduled_at) < new Date()
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">Loading your dashboard...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome to Your Dashboard
              {profile?.display_name && (
                <span className="text-xl text-muted-foreground block mt-1">
                  {profile.display_name}
                </span>
              )}
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Manage your appointments and access Rongduno services
            </p>
            {profile?.membership_number && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 inline-block">
                <p className="text-sm font-medium text-primary">
                  Membership Number: <span className="font-bold">{profile.membership_number}</span>
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Quick Actions and Member ID Card */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Actions */}
              <Card className="shadow-pride">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Book new appointments and access services
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="pride" className="w-full" asChild>
                    <Link to="/services">
                      <Calendar className="h-4 w-4" />
                      Book New Appointment
                    </Link>
                  </Button>
                  <Button variant="healthcare-green" className="w-full" asChild>
                    <Link to="/services">
                      <User className="h-4 w-4" />
                      Browse All Services
                    </Link>
                  </Button>
                  <Button variant="healthcare-teal" className="w-full" asChild>
                    <Link to="/contact">
                      Emergency Support
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Member ID Card */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Member ID Card
                  </CardTitle>
                  <CardDescription>
                    Your digital membership identification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profile ? (
                    <MemberIDCard profile={profile} userId={user?.id} />
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      Loading profile...
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Appointments Section */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Upcoming Appointments */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-healthcare-blue" />
                    Upcoming Appointments
                  </CardTitle>
                  <CardDescription>
                    Your scheduled appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-smooth">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg mb-2">
                                {appointment.services.name}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {format(new Date(appointment.scheduled_at), "PPP")}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  {format(new Date(appointment.scheduled_at), "p")} 
                                  ({appointment.duration_minutes} min)
                                </div>
                                <div className="flex items-center gap-2">
                                  {appointment.is_online ? (
                                    <>
                                      <Video className="h-4 w-4" />
                                      Online Session
                                    </>
                                  ) : (
                                    <>
                                      <MapPin className="h-4 w-4" />
                                      In-Person
                                    </>
                                  )}
                                </div>
                                <div className={`flex items-center gap-2 ${getStatusColor(appointment.status)}`}>
                                  <div className="w-2 h-2 rounded-full bg-current"></div>
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </div>
                              </div>
                              {appointment.notes && (
                                <p className="mt-2 text-sm text-muted-foreground">
                                  <strong>Notes:</strong> {appointment.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        No upcoming appointments scheduled
                      </p>
                      <Button variant="pride" asChild>
                        <Link to="/services">
                          <Plus className="h-4 w-4" />
                          Book Your First Appointment
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Past Appointments */}
              {pastAppointments.length > 0 && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      Recent Appointments
                    </CardTitle>
                    <CardDescription>
                      Your appointment history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pastAppointments.slice(0, 3).map((appointment) => (
                        <div key={appointment.id} className="border border-border rounded-lg p-3 bg-muted/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium">{appointment.services.name}</h5>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(appointment.scheduled_at), "PPP")}
                              </p>
                            </div>
                            <div className={`text-sm ${getStatusColor(appointment.status)}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
