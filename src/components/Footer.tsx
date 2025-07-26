import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8" />
              <span className="text-2xl font-bold">Rongduno</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Creating a safe, inclusive space for LGBT+ healthcare and community support. 
              Your wellness is our priority.
            </p>
            <p className="text-primary-foreground/60 text-sm font-medium">
              Company Number: 15629001
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-glow transition-smooth">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary-glow transition-smooth">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary-glow transition-smooth">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/book/mental-health" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  Mental Health Therapy
                </Link>
              </li>
              <li>
                <Link to="/book/hiv-testing" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  HIV Testing
                </Link>
              </li>
              <li>
                <Link to="/book/community-support" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  Support Groups
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  All Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4" />
                <span className="text-primary-foreground/80">+44 7404 792007</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                <span className="text-primary-foreground/80">hello@rongduno.org</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1" />
                <span className="text-primary-foreground/80">
                  34 Turner Street<br />
                  London, E13 8JG
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/80 text-sm">
            © 2024 Rongduno. All rights reserved. Serving our community with pride.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};