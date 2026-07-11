import CommonWrapper from "@/common/CommonWrapper";
import { useTracking } from "@/hooks/useTracking";
import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Button } from "@/common/Components/Button";
import { useGetHost } from "@/utils/useGetHost";

const Contact = () => {
  const host = useGetHost();
  const { trackContact } = useTracking();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    trackContact("page_view", "contact_page");
  }, [trackContact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submit logic
  };

  const contactInfo = [
    {
      icon: <Phone className="text-secondary" size={24} />,
      title: "Call Us",
      details: "+880 1234-567890",
      subDetails: "Mon-Fri, 9am-6pm",
    },
    {
      icon: <Mail className="text-secondary" size={24} />,
      title: "Email Us",
      details: host.email || "support@bestbuy4ubd.com",
      subDetails: "Online support 24/7",
    },
    {
      icon: <MapPin className="text-secondary" size={24} />,
      title: "Our Location",
      details: "123 Tech Street, Dhaka",
      subDetails: "Bangladesh, 1200",
    },
    {
      icon: <Clock className="text-secondary" size={24} />,
      title: "Working Hours",
      details: "Sat - Thu: 10AM - 8PM",
      subDetails: "Friday: Closed",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <CommonWrapper>
      <Helmet>
        <title>Contact Us | {host.title || "BestBuy4uBd"} - Premium Ecommerce Experience</title>
        <meta name="description" content={`Reach out to ${host.title || "BestBuy4uBd"} for any inquiries, support, or feedback. We are here to help you 24/7 with your tech needs.`} />
      </Helmet>
      <div className="py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Get in Touch
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-medium">
            Have questions about our products or need assistance with your order? 
            Our dedicated team is here to help you every step of the way.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Column */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1 space-y-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div key={index} variants={itemVariants}>
                <div className="w-full bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800/80 p-5 flex flex-row items-start gap-4 transition-colors">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/60 flex items-center justify-center">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">{info.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 font-medium mt-1">{info.details}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{info.subDetails}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Social Media Links */}
            <motion.div variants={itemVariants} className="pt-4">
              <div className="w-full bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800/80 p-6">
                <h3 className="font-semibold text-lg mb-4 text-center text-slate-800 dark:text-slate-100">Follow Our Socials</h3>
                <div className="flex justify-center gap-4">
                  {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="icon"
                      roundedFull
                      className="bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-secondary dark:hover:text-secondary"
                    >
                      <Icon size={20} />
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Form Column */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800/80 p-6 md:p-8 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Send us a Message</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">We'll get back to you within 24 hours.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 focus:border-secondary focus:outline-none transition-colors bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 focus:border-secondary focus:outline-none transition-colors bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 focus:border-secondary focus:outline-none transition-colors bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 focus:border-secondary focus:outline-none transition-colors bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="mt-2 w-full h-14 font-semibold text-base flex items-center justify-center gap-2"
              >
                Send Message
                <Send size={18} />
              </Button>

              <div className="flex items-center gap-4 my-2">
                <div className="flex-1 border-t border-slate-200 dark:border-slate-800/80" />
                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider">{(host.title || "BESTBUY4UBD").toUpperCase()} SUPPORT</span>
                <div className="flex-1 border-t border-slate-200 dark:border-slate-800/80" />
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </CommonWrapper>
  );
};

export default Contact;