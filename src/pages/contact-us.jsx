import { motion } from "framer-motion";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { 
  Mail, MapPinned, Phone, Send, ShieldCheck, 
  Sparkles, ArrowRight, CheckCircle2, MessageCircle,
  Clock, Users, Building2, Globe, Star, Twitter, Linkedin, Instagram,
  Zap, Heart, Award, ThumbsUp, Headphones, BookOpen, Video,
  Calendar, Download, ExternalLink, ChevronRight
} from "lucide-react";

const contactCards = [
  {
    icon: Mail,
    title: "Email us",
    value: "hello@sahispot.com",
    note: "Best for partnerships, support, and product questions.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconGradient: "from-blue-500 to-cyan-500",
    hoverColor: "group-hover:border-blue-500/50",
    action: "mailto:hello@sahispot.com"
  },
  {
    icon: Phone,
    title: "Call support",
    value: "+91 98765 43210",
    note: "Available on business days for onboarding and urgent help.",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconGradient: "from-purple-500 to-pink-500",
    hoverColor: "group-hover:border-purple-500/50",
    action: "tel:+919876543210"
  },
  {
    icon: MapPinned,
    title: "Visit HQ",
    value: "Connaught Place, New Delhi",
    note: "Our product and operations teams are based here.",
    gradient: "from-orange-500/20 to-amber-500/20",
    iconGradient: "from-orange-500 to-amber-500",
    hoverColor: "group-hover:border-orange-500/50",
    action: "https://maps.google.com"
  },
];

const faqs = [
  {
    q: "How do I book a parking spot?",
    a: "Simply search for your desired location, select your preferred time slot, and complete the payment. You'll receive a confirmation email with all details.",
  },
  {
    q: "Can I cancel my booking?",
    a: "Yes, cancellations are allowed up to 2 hours before your booking start time for a full refund. Check our cancellation policy for details.",
  },
  {
    q: "What happens if I overstay?",
    a: "Overstay charges are calculated automatically based on the hourly rate. You'll receive a notification and can pay the difference at checkout.",
  },
  {
    q: "Is my vehicle safe?",
    a: "All our partner parking locations are verified, secured with CCTV cameras, and have 24/7 security personnel.",
  },
];

const features = [
  { icon: Zap, title: "Instant Booking", desc: "Book your spot in under 30 seconds" },
  { icon: Heart, title: "Secure Payments", desc: "100% encrypted transactions" },
  { icon: Award, title: "Best Price Guarantee", desc: "We match any lower price" },
  { icon: ThumbsUp, title: "24/7 Support", desc: "Round-the-clock assistance" },
];

const team = [
  { name: "Rajesh Kumar", role: "CEO & Founder", image: "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=fb923c&color=fff&bold=true", social: { twitter: "#", linkedin: "#" } },
  { name: "Priya Sharma", role: "Head of Operations", image: "https://ui-avatars.com/api/?name=Priya+Sharma&background=fb923c&color=fff&bold=true", social: { twitter: "#", linkedin: "#" } },
  { name: "Amit Verma", role: "Tech Lead", image: "https://ui-avatars.com/api/?name=Amit+Verma&background=fb923c&color=fff&bold=true", social: { twitter: "#", linkedin: "#" } },
  { name: "Neha Gupta", role: "Customer Success", image: "https://ui-avatars.com/api/?name=Neha+Gupta&background=fb923c&color=fff&bold=true", social: { twitter: "#", linkedin: "#" } },
];

const stats = [
  { value: "50K+", label: "Active Users", icon: Users, trend: "+25%" },
  { value: "200+", label: "Parking Locations", icon: Building2, trend: "+12%" },
  { value: "24/7", label: "Support Available", icon: Clock, trend: "Always" },
  { value: "4.9", label: "User Rating", icon: Star, trend: "⭐ 5k+ reviews" },
];

// FAQ Accordion Component
function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <motion.div
      initial={false}
      className="border-b border-white/10 last:border-0"
    >
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="text-white font-medium group-hover:text-orange-400 transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight size={18} className="text-white/40 group-hover:text-orange-400 transition-colors" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-white/60 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ContactUsPage() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitStatus("success");
    setIsSubmitting(false);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitStatus(null), 3000);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-16"
        >
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-r from-orange-500/30 to-amber-500/30 rounded-full blur-3xl" />
          <div className="relative text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 mb-6 backdrop-blur-sm"
            >
              <Sparkles size={14} className="text-orange-400" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Get in Touch</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent mb-6">
              Let's Connect
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Experience parking reimagined. Whether you need support, want to partner, 
              or just have a question — we're here to help.
            </p>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative text-center p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-all duration-300">
                <stat.icon size={24} className="mx-auto mb-3 text-orange-400" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/50 mt-1">{stat.label}</p>
                <p className="text-[10px] text-emerald-400 mt-1">{stat.trend}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Why Choose Us?</h2>
            <p className="text-white/50">Experience the future of parking with our premium features</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300"
              >
                <feature.icon size={28} className="mx-auto mb-3 text-orange-400" />
                <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-xs text-white/40">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] mb-16">
          {/* Contact Cards */}
          <div className="space-y-5">
            {contactCards.map(({ icon: Icon, title, value, note, gradient, iconGradient, action }, index) => (
              <motion.a
                key={title}
                href={action}
                target={action?.startsWith("http") ? "_blank" : undefined}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm p-6 transition-all duration-300 hover:border-white/20 block"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${iconGradient} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="mt-5 text-xl font-bold text-white">{title}</h2>
                  <p className="mt-2 text-lg font-semibold text-transparent bg-gradient-to-r from-white to-white/70 bg-clip-text">
                    {value}
                  </p>
                  <p className="mt-3 text-sm text-white/50 leading-relaxed">{note}</p>
                  
                  {/* Action Button */}
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-white/60 group-hover:text-white transition-colors duration-300">
                    Get in touch
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm p-6 md:p-8">
              {/* Decorative Elements */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Send us a message</h2>
                    <p className="text-sm text-white/50">We reply within 24 hours</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="group">
                      <label className="block text-sm font-medium text-white/60 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="John Doe"
                        className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-orange-500/50 focus:bg-white/[0.05] hover:border-white/20"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-white/60 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="john@example.com"
                        className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-orange-500/50 focus:bg-white/[0.05] hover:border-white/20"
                      />
                    </div>
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-medium text-white/60 mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="How can we help you?"
                      className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-orange-500/50 focus:bg-white/[0.05] hover:border-white/20"
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-medium text-white/60 mb-2">Message</label>
                    <textarea
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Tell us what you need help with..."
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-orange-500/50 focus:bg-white/[0.05] hover:border-white/20 resize-none"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="relative w-full overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 rounded-xl animate-gradient-x" />
                    <div className="relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-500/30 disabled:opacity-50">
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </motion.button>
                </form>

                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center justify-center gap-2 text-sm text-emerald-400"
                  >
                    <CheckCircle2 size={16} />
                    Message sent successfully! We'll get back to you soon.
                  </motion.div>
                )}

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  Your information is secure and private
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-4">
              <BookOpen size={12} className="text-orange-400" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">FAQ</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Frequently Asked Questions</h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Find quick answers to common questions about our parking services
            </p>
          </div>
          <div className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            {faqs.map((faq, idx) => (
              <FAQItem
                key={idx}
                question={faq.q}
                answer={faq.a}
                isOpen={openFAQ === idx}
                onToggle={() => setOpenFAQ(openFAQ === idx ? null : idx)}
              />
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Meet Our Team</h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Passionate professionals dedicated to revolutionizing parking in India
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className="relative inline-block mb-3">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto border-2 border-white/20 object-cover"
                  />
                </div>
                <h3 className="font-semibold text-white">{member.name}</h3>
                <p className="text-xs text-white/50">{member.role}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <a href={member.social.twitter} className="text-white/30 hover:text-orange-400 transition-colors">
                    <Twitter size={14} />
                  </a>
                  <a href={member.social.linkedin} className="text-white/30 hover:text-orange-400 transition-colors">
                    <Linkedin size={14} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-white/10 p-8 text-center"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
          <div className="relative">
            <Headphones size={48} className="mx-auto mb-4 text-orange-400" />
            <h3 className="text-2xl font-bold text-white mb-2">Need Immediate Assistance?</h3>
            <p className="text-white/60 mb-6">Our support team is available 24/7 to help you</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold shadow-lg shadow-orange-500/30"
            >
              <Phone size={16} />
              Call Now: +91 98765 43210
            </motion.button>
          </div>
        </motion.div>

        {/* Social Links Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="pt-8 border-t border-white/10"
        >
          <div className="text-center">
            <p className="text-sm text-white/50 mb-4">Connect with us on social media</p>
            <div className="flex items-center justify-center gap-4">
              {[
                { icon: Twitter, label: "Twitter", color: "hover:bg-sky-500/20", link: "#" },
                { icon: Linkedin, label: "LinkedIn", color: "hover:bg-blue-500/20", link: "#" },
                { icon: Instagram, label: "Instagram", color: "hover:bg-pink-500/20", link: "#" },
                { icon: Globe, label: "Website", color: "hover:bg-emerald-500/20", link: "#" },
              ].map((social, idx) => (
                <motion.a
                  key={social.label}
                  href={social.link}
                  target="_blank"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                  whileHover={{ y: -3 }}
                  className={`p-3 rounded-xl border border-white/10 bg-white/[0.03] text-white/60 ${social.color} transition-all duration-300 hover:text-white hover:border-white/20`}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 backdrop-blur-sm">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="text-xs text-white/60">Trusted by 50,000+ drivers across India</span>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
}