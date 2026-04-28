import CommonWrapper from "@/common/CommonWrapper";
import { useTracking } from "@/hooks/useTracking";
import { useEffect } from "react";
import { Card, CardBody, Input, Textarea, Button, Divider } from "@heroui/react";
import { Mail, Phone, MapPin, Clock, Send, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

const Contact = () => {
  const { trackContact } = useTracking();

  useEffect(() => {
    trackContact("page_view", "contact_page");
  }, [trackContact]);

  const contactInfo = [
    {
      icon: <Phone className="text-primary" size={24} />,
      title: "Call Us",
      details: "+880 1234-567890",
      subDetails: "Mon-Fri, 9am-6pm",
    },
    {
      icon: <Mail className="text-primary" size={24} />,
      title: "Email Us",
      details: "support@bestbuy4ubd.com",
      subDetails: "Online support 24/7",
    },
    {
      icon: <MapPin className="text-primary" size={24} />,
      title: "Our Location",
      details: "123 Tech Street, Dhaka",
      subDetails: "Bangladesh, 1200",
    },
    {
      icon: <Clock className="text-primary" size={24} />,
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
        <title>Contact Us | BestBuy4uBd - Premium Ecommerce Experience</title>
        <meta name="description" content="Reach out to BestBuy4uBd for any inquiries, support, or feedback. We are here to help you 24/7 with your tech needs." />
      </Helmet>
      <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Get in Touch
          </h1>
          <p className="text-default-500 max-w-2xl mx-auto text-lg">
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
                <Card className="border-none bg-default-100/50 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
                  <CardBody className="flex flex-row items-start gap-4 p-5">
                    <div className="p-3 rounded-2xl bg-white dark:bg-default-200 shadow-sm">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{info.title}</h3>
                      <p className="text-default-700 font-medium">{info.details}</p>
                      <p className="text-xs text-default-400 mt-1">{info.subDetails}</p>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}

            {/* Social Media Links */}
            <motion.div variants={itemVariants} className="pt-4">
              <Card className="border-none bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-md">
                <CardBody className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-center">Follow Our Socials</h3>
                  <div className="flex justify-center gap-4">
                    {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                      <Button
                        key={i}
                        isIconOnly
                        radius="full"
                        variant="flat"
                        className="bg-white dark:bg-default-200 hover:scale-110 transition-transform"
                      >
                        <Icon size={20} />
                      </Button>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </motion.div>

          {/* Form Column */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="p-4 md:p-8 border-none shadow-xl bg-white dark:bg-default-50/50 backdrop-blur-xl">
              <CardBody className="gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>
                  <p className="text-default-500 mb-6">We'll get back to you within 24 hours.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Enter your name"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    className="max-w-full"
                  />
                  <Input
                    label="Email Address"
                    placeholder="Enter your email"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    className="max-w-full"
                  />
                </div>

                <Input
                  label="Subject"
                  placeholder="How can we help?"
                  labelPlacement="outside"
                  variant="bordered"
                  radius="lg"
                  size="lg"
                />

                <Textarea
                  label="Message"
                  placeholder="Write your message here..."
                  labelPlacement="outside"
                  variant="bordered"
                  radius="lg"
                  size="lg"
                  minRows={6}
                />

                <Button
                  color="primary"
                  radius="lg"
                  size="lg"
                  className="mt-4 font-bold h-14"
                  endContent={<Send size={18} />}
                >
                  Send Message
                </Button>

                <div className="flex items-center gap-4 my-2">
                  <Divider className="flex-1" />
                  <span className="text-xs text-default-400 font-medium">BESTBUY4UBD SUPPORT</span>
                  <Divider className="flex-1" />
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </CommonWrapper>
  );
};

export default Contact;