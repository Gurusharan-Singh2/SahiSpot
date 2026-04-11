import {
  Radar,
  ShieldCheck,
  HeartHandshake,
  Users,
  Building2,
  Globe,
  Coffee,
  Rocket,
  TrendingUp,
  Trophy,
  Star,
  Zap
} from "lucide-react";

export const values = [
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

export const metrics = [
  { label: "Drivers served", value: "90k+", icon: Users, trend: "+25% this month" },
  { label: "Parking partners", value: "1,200+", icon: Building2, trend: "+150 new" },
  { label: "Cities activated", value: "18", icon: Globe, trend: "4 more coming" },
];

export const milestones = [
  { year: "2021", title: "The Beginning", description: "SahiSpot founded with a vision to transform urban parking", icon: Coffee },
  { year: "2022", title: "First Launch", description: "Launched in 5 cities with 200+ parking partners", icon: Rocket },
  { year: "2023", title: "Rapid Growth", description: "Expanded to 15 cities, served 50K+ happy drivers", icon: TrendingUp },
  { year: "2024", title: "Industry Leader", description: "Recognized as India's fastest-growing parking platform", icon: Trophy },
];

export const teamMembers = [
  { name: "Rajesh Kumar", role: "CEO & Founder", bio: "Ex-Google, passionate about urban mobility", image: "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=fb923c&color=fff&bold=true" },
  { name: "Priya Sharma", role: "CTO", bio: "Full-stack architect, ex-Amazon", image: "https://ui-avatars.com/api/?name=Priya+Sharma&background=fb923c&color=fff&bold=true" },
  { name: "Amit Verma", role: "Head of Product", bio: "Product leader with 10+ years in tech", image: "https://ui-avatars.com/api/?name=Amit+Verma&background=fb923c&color=fff&bold=true" },
  { name: "Neha Gupta", role: "Customer Success", bio: "Making every driver's experience delightful", image: "https://ui-avatars.com/api/?name=Neha+Gupta&background=fb923c&color=fff&bold=true" },
];

export const achievements = [
  { icon: Trophy, label: "Best Tech Startup", year: "2023", color: "from-yellow-500 to-amber-500" },
  { icon: Star, label: "4.9 Rating", year: "2024", color: "from-emerald-500 to-teal-500" },
  { icon: Zap, label: "Fastest Growth", year: "2024", color: "from-blue-500 to-cyan-500" },
  { icon: Users, label: "50K+ Users", year: "2024", color: "from-purple-500 to-pink-500" },
];

export const statusTone = {
  approved: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/20',
  pending: 'bg-amber-500/15 text-amber-100 border-amber-400/20',
  rejected: 'bg-rose-500/15 text-rose-100 border-rose-400/20',
  suspended: 'bg-rose-500/15 text-rose-100 border-rose-400/20',
  active: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/20',
  completed: 'bg-blue-500/15 text-blue-200 border-blue-400/20',
  cancelled: 'bg-rose-500/15 text-rose-100 border-rose-400/20',
};