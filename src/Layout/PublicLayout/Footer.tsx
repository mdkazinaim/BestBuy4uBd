import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import NavItems from "./NavItems";
import { useTracking } from "@/hooks/useTracking";
import { Button } from "@/common/Components/Button";
import CommonWrapper from "@/common/CommonWrapper";

const Footer: React.FC = () => {
  const { trackContact, trackSubscribe } = useTracking();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    trackSubscribe("footer_newsletter", "footer");
    // Add newsletter subscription logic here
  };

  return (
    <footer className="bg-brand-700 dark:bg-slate-950 text-white py-12 transition-colors duration-500 border-t border-brand-800 dark:border-slate-900">
      <CommonWrapper className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="h6 text-white uppercase tracking-widest">
              About Us
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              We are a team of passionate developers building amazing web
              applications with modern technologies. BestBuy4uBd is your
              one-stop shop for premium products.
            </p>
          </div>
          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="h6 text-white uppercase tracking-widest">
              Quick Links
            </h3>
            <NavItems
              isFooter={true}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start justify-start gap-4 text-white"
              classNameC="px-0!"
              classNameNC="px-0!"
            />
          </div>

          {/* Social Media Section */}
          <div className="space-y-4">
            <h3 className="h6 text-white uppercase tracking-widest">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContact("facebook", "social_link")}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-all"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContact("twitter", "social_link")}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-info transition-all"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContact("instagram", "social_link")}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-danger transition-all"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContact("linkedin", "social_link")}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all"
              >
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="h6 text-white uppercase tracking-widest">
              Newsletter
            </h3>
            <p className="text-sm text-slate-200">
              Subscribe to our newsletter to get the latest updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-3 bg-white/5 dark:bg-slate-900/60 border border-white/10 dark:border-slate-800 rounded-lg text-white placeholder:text-white/40 dark:placeholder:text-slate-500 focus:outline-none focus:border-secondary transition-colors font-medium"
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 text-[10px] font-semibold uppercase tracking-widest bg-secondary hover:bg-secondary/90 border-secondary text-white"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-white/5 mt-12 pt-8 text-center">
          <p className="text-xs text-white/60 dark:text-slate-400 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} BestBuy4uBd. All rights reserved.
          </p>
        </div>
      </CommonWrapper>
    </footer>
  );
};

export default Footer;
