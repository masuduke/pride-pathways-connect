import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  Privacy Policy
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Your privacy is important to us. Learn how we protect your information.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Last updated: December 2024
              </p>
            </div>

            <Card className="shadow-pride">
              <CardContent className="p-8 space-y-8">
                
                <section>
                  <CardTitle className="text-xl mb-4">1. Information We Collect</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>We collect information you provide directly to us, such as when you:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Create an account or profile</li>
                      <li>Book appointments or use our services</li>
                      <li>Contact us for support</li>
                      <li>Subscribe to our communications</li>
                      <li>Participate in surveys or feedback</li>
                    </ul>
                    <p>This may include your name, email address, phone number, date of birth, medical information, and other personal details necessary for providing healthcare services.</p>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">2. How We Use Your Information</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>We use your information to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Provide, maintain, and improve our services</li>
                      <li>Process appointments and payments</li>
                      <li>Communicate with you about your appointments and our services</li>
                      <li>Ensure the safety and security of our platform</li>
                      <li>Comply with legal obligations</li>
                      <li>Provide customer support</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">3. Information Sharing</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>With your explicit consent</li>
                      <li>With healthcare providers involved in your care</li>
                      <li>To comply with legal requirements</li>
                      <li>To protect our rights and safety</li>
                      <li>In connection with a business transfer</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">4. Data Security</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Encryption of data in transit and at rest</li>
                      <li>Regular security assessments</li>
                      <li>Access controls and authentication</li>
                      <li>Staff training on data protection</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">5. Your Rights</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>You have the right to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Access your personal information</li>
                      <li>Correct or update your information</li>
                      <li>Request deletion of your information</li>
                      <li>Restrict processing of your information</li>
                      <li>Data portability</li>
                      <li>Object to processing</li>
                      <li>Withdraw consent at any time</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">6. Cookies and Tracking</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>We use cookies and similar technologies to improve your experience on our website. You can control cookie settings through your browser preferences.</p>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">7. Children's Privacy</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>Our services are not intended for children under 16. We do not knowingly collect personal information from children under 16 without parental consent.</p>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">8. International Transfers</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.</p>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">9. Retention Period</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>We retain your personal information for as long as necessary to provide our services and comply with legal obligations, typically 7 years for medical records as required by UK law.</p>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">10. Changes to This Policy</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "last updated" date.</p>
                  </div>
                </section>

                <section>
                  <CardTitle className="text-xl mb-4">11. Contact Us</CardTitle>
                  <div className="space-y-4 text-muted-foreground">
                    <p>If you have any questions about this privacy policy or our data practices, please contact us:</p>
                    <ul className="list-none space-y-2">
                      <li><strong>Email:</strong> privacy@rongduno.org</li>
                      <li><strong>Phone:</strong> +44 7404 792007</li>
                      <li><strong>Address:</strong> 34 Turner Street, London, E13 8JG</li>
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

export default Privacy;