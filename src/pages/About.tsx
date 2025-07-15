import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ImageGallery from "@/components/ImageGallery";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              About Our Community
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We are dedicated to providing comprehensive mental health services, HIV testing and support, 
              and fostering inclusive community connections for the LGBT+ community.
            </p>
          </div>
          
          <ImageGallery />
          
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
              <p className="text-muted-foreground">
                To create a safe, supportive environment where every individual can access 
                quality mental health care, HIV prevention and treatment services, and find 
                community connections that celebrate diversity and promote wellness.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Our Values</h3>
              <p className="text-muted-foreground">
                We believe in equality, compassion, confidentiality, and the power of 
                community. Our services are designed to be inclusive, accessible, and 
                tailored to meet the unique needs of each individual we serve.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}