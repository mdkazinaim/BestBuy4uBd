import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import NavItems from "./NavItems";
import { useTracking } from "@/hooks/useTracking";
import { useGetHost } from "@/utils/useGetHost";
import { useVisitorCount } from "@/utils/visitorTrackingService";
import { Button } from "@/common/Components/Button";
import CommonWrapper from "@/common/CommonWrapper";

const Footer: React.FC = () => {
  const host = useGetHost();
  const { trackContact, trackSubscribe } = useTracking();
  const totalVisitors = useVisitorCount();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    trackSubscribe("footer_newsletter", "footer");
  };

  return (
    <footer className="bg-brand-700 dark:bg-slate-950 text-white py-8 sm:py-12 transition-colors duration-500 border-t border-brand-800 dark:border-slate-900">
      <CommonWrapper className="px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="h6 text-white flex items-center gap-2">
              {host.logo && <img src={host.logo} alt="Logo" className="h-8 object-contain" />}
              {host.title && <span className="uppercase tracking-widest">{host.title}</span>}
              {!host.logo && !host.title && <span className="uppercase tracking-widest">About Us</span>}
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              {host.description || `Welcome to ${host.title || "our store"}. Your one-stop shop for premium products.`}
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="h6 text-white uppercase tracking-widest">
              Quick Links
            </h3>
            <NavItems
              isFooter={true}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 items-start justify-start gap-x-4 gap-y-2 sm:gap-4 text-white"
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
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white/5 dark:bg-slate-900/60 border border-white/10 dark:border-slate-800 rounded-lg text-white placeholder:text-white/40 dark:placeholder:text-slate-500 focus:outline-none focus:border-secondary transition-colors font-medium text-xs sm:text-sm"
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest bg-secondary hover:bg-secondary/90 border-secondary text-white"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Copyright & Total Visitors Section */}
        <div className="border-t border-white/5 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-white/60 dark:text-slate-400 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} {host.title ? host.title : "Store"}. All rights reserved.
          </p>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 dark:bg-slate-900 border border-white/10 dark:border-slate-800 text-xs font-medium text-white/90 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-white/70">Total Site Visitors:</span>
            <span className="font-bold font-mono text-emerald-400 text-sm">
              {totalVisitors.toLocaleString()}
            </span>
          </div>
        </div>
      </CommonWrapper>
    </footer>
  );
};

export default Footer;
