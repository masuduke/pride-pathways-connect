import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, UserPlus, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-card">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-smooth">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-pride bg-clip-text text-transparent">
              Rongduno
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-smooth font-medium">
              Home
            </Link>
            <Link to="/services" className="text-foreground hover:text-primary transition-smooth font-medium">
              Services
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-smooth font-medium">
              About Us
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-smooth font-medium">
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="pride-outline" size="sm" asChild>
              <Link to="/login">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </Button>
            <Button variant="pride" size="sm" asChild>
              <Link to="/register">
                <UserPlus className="h-4 w-4" />
                Join Us
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="flex flex-col gap-4 pt-4">
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-smooth font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/services"
                className="text-foreground hover:text-primary transition-smooth font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/about"
                className="text-foreground hover:text-primary transition-smooth font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-foreground hover:text-primary transition-smooth font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="pride-outline" size="sm" asChild>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button variant="pride" size="sm" asChild>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <UserPlus className="h-4 w-4" />
                    Join Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};