import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <FileText className="h-8 w-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  Terms of Service
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Please read these terms carefully before using our services.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Last updated: December 2024
              </p>
            </div>

            <Card className="shadow-pride">
              <CardContent className="p-8 space-y-8">
                
                <section>
                  <CardTitle className="text-xl mb-4">1. Acceptance of Terms</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>By accessing and using Rongduno's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">2. Description of Service</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>Rongduno provides LGBT+ affirming healthcare services including:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Mental health therapy and counseling</li>
                      <li>HIV testing and sexual health services</li>
                      <li>Support groups and community resources</li>
                      <li>Medical consultations and healthcare</li>
                      <li>Online appointment booking and management</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">3. User Responsibilities</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>As a user of our services, you agree to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Provide accurate and truthful information</li>
                      <li>Keep your account information secure</li>
                      <li>Attend scheduled appointments or cancel with appropriate notice</li>
                      <li>Respect other community members and staff</li>
                      <li>Not misuse or abuse our services</li>
                      <li>Comply with all applicable laws and regulations</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">4. Medical Disclaimer</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>Our services are provided by licensed healthcare professionals, but:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Information provided is not a substitute for professional medical advice</li>
                      <li>Always seek the advice of qualified health providers for medical questions</li>
                      <li>In case of emergency, contact emergency services immediately</li>
                      <li>We do not guarantee specific treatment outcomes</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">5. Privacy and Confidentiality</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>We are committed to protecting your privacy and maintaining confidentiality in accordance with:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>UK Data Protection Act 2018</li>
                      <li>General Data Protection Regulation (GDPR)</li>
                      <li>Medical confidentiality requirements</li>
                      <li>Our Privacy Policy</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">6. Payment Terms</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>Regarding payments for our services:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Payment is required at the time of booking unless otherwise arranged</li>
                      <li>We accept various payment methods including credit cards and PayPal</li>
                      <li>Refunds may be available in certain circumstances</li>
                      <li>Missed appointments may incur charges</li>
                      <li>Some services may be available free of charge based on eligibility</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">7. Cancellation Policy</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>To ensure availability for all community members:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Please provide at least 24 hours notice for cancellations</li>
                      <li>Late cancellations or no-shows may incur fees</li>
                      <li>Emergency cancellations will be handled case-by-case</li>
                      <li>Repeated no-shows may result in service restrictions</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">8. Intellectual Property</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>All content on our platform, including text, graphics, logos, and software, is the property of Rongduno and is protected by copyright and other intellectual property laws.</p>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">9. Limitation of Liability</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>To the fullest extent permitted by law, Rongduno shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.</p>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">10. Account Termination</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>We reserve the right to terminate or suspend accounts that:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Violate these terms of service</li>
                      <li>Engage in abusive or harmful behavior</li>
                      <li>Provide false or misleading information</li>
                      <li>Misuse our services or platform</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">11. Governing Law</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>These terms shall be governed by and construed in accordance with the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">12. Changes to Terms</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>We reserve the right to modify these terms at any time. We will notify users of any significant changes by email or through our platform. Continued use of our services after changes constitutes acceptance of the new terms.</p>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">13. Contact Information</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>If you have any questions about these Terms of Service, please contact us:</p>
                    <ul className="list-none space-y-2">
                      <li><strong>Email:</strong> legal@rongduno.org</li>
                      <li><strong>Phone:</strong> +44 7404 792007</li>
                      <li><strong>Address:</strong> 34 Turner Street, London, E13 8JG</li>
                      <li><strong>Company Number:</strong> 15629001</li>
                    </ul>
                  </div>
                </section>

              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;