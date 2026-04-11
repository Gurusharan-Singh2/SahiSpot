import { motion } from "framer-motion";
import { 
  Building2, HeartHandshake, MapPinned, Radar, ShieldCheck, Users,
  Sparkles, ArrowRight, CheckCircle2, Globe, Trophy, Clock,
  Star, Quote, Award, Target, Eye, Zap, Coffee, Laptop, Code
} from "lucide-react";
import { useState } from "react";

const values = [
  {
    icon: Radar,
    title: "Map-first clarity",
    description: "We reduce parking chaos with live spatial context, not guesswork.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconGradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: ShieldCheck,
    title: "Trust in every booking",
    description: "Drivers and owners should feel safe, informed, and in control.",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconGradient: "from-emerald-500 to-teal-500"
  },
  {
    icon: HeartHandshake,
    title: "Less friction, more flow",
    description: "Every step should remove stress instead of adding another form or dead end.",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconGradient: "from-purple-500 to-pink-500"
  },
];

const metrics = [
  { label: "Drivers served", value: "90k+", icon: Users, trend: "+25% this month" },
  { label: "Parking partners", value: "1,200+", icon: Building2, trend: "+150 new" },
  { label: "Cities activated", value: "18", icon: Globe, trend: "4 more coming" },
];

const milestones = [
  { year: "2021", title: "The Beginning", description: "SahiSpot founded with a vision to transform urban parking", icon: Coffee },
  { year: "2022", title: "First Launch", description: "Launched in 5 cities with 200+ parking partners", icon: Rocket },
  { year: "2023", title: "Rapid Growth", description: "Expanded to 15 cities, served 50K+ happy drivers", icon: TrendingUp },
  { year: "2024", title: "Industry Leader", description: "Recognized as India's fastest-growing parking platform", icon: Trophy },
];

const teamMembers = [
  { name: "Rajesh Kumar", role: "CEO & Founder", bio: "Ex-Google, passionate about urban mobility", image: "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=fb923c&color=fff&bold=true" },
  { name: "Priya Sharma", role: "CTO", bio: "Full-stack architect, ex-Amazon", image: "https://ui-avatars.com/api/?name=Priya+Sharma&background=fb923c&color=fff&bold=true" },
  { name: "Amit Verma", role: "Head of Product", bio: "Product leader with 10+ years in tech", image: "https://ui-avatars.com/api/?name=Amit+Verma&background=fb923c&color=fff&bold=true" },
  { name: "Neha Gupta", role: "Customer Success", bio: "Making every driver's experience delightful", image: "https://ui-avatars.com/api/?name=Neha+Gupta&background=fb923c&color=fff&bold=true" },
];

const achievements = [
  { icon: Trophy, label: "Best Tech Startup", year: "2023", color: "from-yellow-500 to-amber-500" },
  { icon: Star, label: "4.9 Rating", year: "2024", color: "from-emerald-500 to-teal-500" },
  { icon: Zap, label: "Fastest Growth", year: "2024", color: "from-blue-500 to-cyan-500" },
  { icon: Users, label: "50K+ Users", year: "2024", color: "from-purple-500 to-pink-500" },
];

export default function AboutUsPage() {
  const [activeMilestone, setActiveMilestone] = useState(null);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.02%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
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
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Our Story</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent mb-6">
              Parking Reimagined
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              We're building the future of urban parking — where finding a spot feels effortless, 
              transparent, and actually enjoyable.
            </p>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {metrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm p-6 hover:bg-white/[0.04] transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <metric.icon size={24} className="text-orange-400" />
                  <span className="text-xs text-emerald-400">{metric.trend}</span>
                </div>
                <p className="text-4xl font-bold text-white mb-1">{metric.value}</p>
                <p className="text-sm text-white/50">{metric.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] mb-16">
          {/* What We Believe Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm p-6 md:p-8"
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-full blur-3xl" />
            <div className="relative">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 shadow-lg mb-6">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">What we believe</h2>
              <p className="text-lg text-white/60 leading-relaxed mb-4">
                Parking should not feel like a low-quality afterthought. It deserves the same care we
                expect from booking flights, ordering rides, or managing hospitality spaces.
              </p>
              <p className="text-lg text-white/60 leading-relaxed">
                That means better maps, cleaner workflows, owner-grade tooling, and design that lowers
                stress instead of amplifying it.
              </p>
              
              {/* Quote */}
              <div className="mt-6 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <Quote size={20} className="text-orange-400 mb-2" />
                <p className="text-sm text-white/40 italic">
                  "We're not just building a parking app — we're reimagining how cities move."
                </p>
                <p className="text-xs text-white/30 mt-1">— Rajesh Kumar, Founder</p>
              </div>
            </div>
          </motion.div>

          {/* Values Grid */}
          <div className="space-y-5">
            {values.map(({ icon: Icon, title, description, gradient, iconGradient }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm p-5 transition-all duration-300 hover:border-white/20"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${iconGradient} shadow-lg mb-4`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Who We Design For Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm p-6 md:p-8">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-emerald-500/5" />
            <div className="relative">
              <div className="text-center mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-400 mb-2">
                  Who we design for
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Two sides of parking, one experience layer
                </h2>
                <p className="text-white/50 max-w-2xl mx-auto">
                  We're building a platform that serves both drivers and parking owners with equal care and attention.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-500" />
                  <div className="relative">
                    <Users className="h-8 w-8 text-blue-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Drivers</h3>
                    <p className="text-white/60 leading-relaxed">
                      Better discovery, clearer pricing, cleaner booking decisions, and more confidence on arrival.
                      We're making parking stress a thing of the past.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-500" />
                  <div className="relative">
                    <MapPinned className="h-8 w-8 text-emerald-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Owners</h3>
                    <p className="text-white/60 leading-relaxed">
                      More control over visibility, occupancy, slot inventory, and premium customer perception.
                      Transform your parking space into a revenue generator.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Milestones Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Our Journey</h2>
            <p className="text-white/50">From idea to industry leader — our milestones</p>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-orange-500/50 via-white/20 to-transparent hidden md:block" />
            
            <div className="space-y-8">
              {milestones.map((milestone, idx) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-4 ${
                    idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`inline-block p-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-white/10 ${
                      idx % 2 === 0 ? 'md:ml-auto' : ''
                    }`}>
                      <milestone.icon size={20} className="text-orange-400" />
                    </div>
                  </div>
                  <div className="flex-1 relative">
                    <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-300">
                      <span className="text-orange-400 font-bold text-sm">{milestone.year}</span>
                      <h3 className="text-lg font-bold text-white mt-1">{milestone.title}</h3>
                      <p className="text-sm text-white/50 mt-2">{milestone.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Our Achievements</h2>
            <p className="text-white/50">Recognized for excellence in parking technology</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, idx) => (
              <motion.div
                key={achievement.label}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center p-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${achievement.color} mb-3`}>
                  <achievement.icon size={20} className="text-white" />
                </div>
                <p className="text-lg font-bold text-white">{achievement.label}</p>
                <p className="text-xs text-white/40">{achievement.year}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Meet the Team</h2>
            <p className="text-white/50">Passionate people behind SahiSpot</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center group"
              >
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-28 h-28 rounded-full mx-auto border-2 border-white/20 object-cover relative z-10"
                  />
                </div>
                <h3 className="font-bold text-white">{member.name}</h3>
                <p className="text-sm text-orange-400 mb-2">{member.role}</p>
                <p className="text-xs text-white/50">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-white/10 p-8 text-center"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
          <div className="relative">
            <Sparkles size={48} className="mx-auto mb-4 text-orange-400" />
            <h3 className="text-2xl font-bold text-white mb-2">Join Us on This Journey</h3>
            <p className="text-white/60 mb-6 max-w-2xl mx-auto">
              Whether you're a driver looking for hassle-free parking or a parking owner wanting to maximize your space — we're here for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold shadow-lg shadow-orange-500/30"
              >
                Find Parking
                <ArrowRight size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Partner With Us
                <HeartHandshake size={16} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 backdrop-blur-sm">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="text-xs text-white/60">Making parking smarter, one spot at a time</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}