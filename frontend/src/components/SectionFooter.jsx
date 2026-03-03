import React, { useState } from "react";
import { Mail, Twitter, Linkedin, Github, ArrowUp } from "lucide-react";

export default function SectionFooter() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Add your newsletter logic here
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-brand-bg border-t border-brand-border">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

          {/* Column 1: Brand & Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-brand-text mb-3">
              LetterLab Pro
            </h3>
            <p className="text-brand-muted mb-6 max-w-sm">
              Email replies that feel effortless. Join thousands of professionals who save hours every week.
            </p>

            {/* Newsletter Signup */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <p className="text-sm font-medium text-brand-text">
                Get product updates
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-xs uppercase font-semibold text-brand-muted mb-4 tracking-wider">
              Product
            </h4>
            <ul className="space-y-3">
              {["Features", "Pricing", "Use Cases", "Updates", "Roadmap"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-brand-text hover:text-brand-accent transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-xs uppercase font-semibold text-brand-muted mb-4 tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3">
              {["Documentation", "API Reference", "Blog", "Help Center", "Community"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-brand-text hover:text-brand-accent transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="text-xs uppercase font-semibold text-brand-muted mb-4 tracking-wider">
              Company
            </h4>
            <ul className="space-y-3">
              {["About Us", "Careers", "Contact", "Privacy Policy", "Terms of Service"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-brand-text hover:text-brand-accent transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-brand-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            {/* Left: Copyright */}
            <div className="text-brand-muted text-sm">
              © 2025-26 LetterLab Pro. All rights reserved.
            </div>

            {/* Center: Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-brand-card border border-brand-border flex items-center justify-center text-brand-muted hover:text-brand-accent hover:border-brand-accent transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-brand-card border border-brand-border flex items-center justify-center text-brand-muted hover:text-brand-accent hover:border-brand-accent transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-brand-card border border-brand-border flex items-center justify-center text-brand-muted hover:text-brand-accent hover:border-brand-accent transition-all duration-200"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-brand-card border border-brand-border flex items-center justify-center text-brand-muted hover:text-brand-accent hover:border-brand-accent transition-all duration-200"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>

            {/* Right: Status */}
            <div className="flex items-center gap-2 text-sm text-brand-muted">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              All systems operational
            </div>
          </div>
        </div>
      </div>

      {/* Write Email with AI Button (Fixed) */}

    </footer>
  );
}