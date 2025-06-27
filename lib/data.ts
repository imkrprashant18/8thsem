import {
  Calendar,
  Video,
  CreditCard,
  User,
  FileText,
  ShieldCheck,
} from "lucide-react";

// JSON data for features
export const features = [
  {
    icon: User,
    title: "Personalized Onboarding",
    description:
      "Create your profile to unlock tailored health services and smarter doctor matching.",
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description:
      "Easily view doctor availability and book slots that work with your lifestyle — no calls needed.",
  },
  {
    icon: Video,
    title: "Instant Video Visits",
    description:
      "Get real-time medical advice through secure video calls, anytime and anywhere.",
  },
  {
    icon: CreditCard,
    title: "Smart Credit System",
    description:
      "Buy credits in advance and use them whenever you or your family need a consultation.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Professionals",
    description:
      "Every doctor on our platform is licensed, verified, and reviewed for your peace of mind.",
  },
  {
    icon: FileText,
    title: "Your Health Records",
    description:
      "Keep all your prescriptions, reports, and past consultations organized in one secure place.",
  },
];


// JSON data for testimonials
export const testimonials = [
  {
    initials: "AK",
    name: "Anita K.",
    role: "Patient",
    quote:
      "Booking a consultation was seamless. I received expert guidance right from my home — no traffic, no waiting rooms.",
  },
  {
    initials: "DH",
    name: "Dr. Hari D.",
    role: "Dermatologist",
    quote:
      "The platform has expanded my reach significantly. I'm able to consult patients across the country with ease and flexibility.",
  },
  {
    initials: "MR",
    name: "Manoj R.",
    role: "Caregiver",
    quote:
      "Using credits made managing my parents' health so much easier. It’s cost-effective and incredibly accessible.",
  },
];

// JSON data for credit system benefits
export const creditBenefits = [
  "Every session costs just <strong class='text-amber-400'>2 credits</strong> — no matter how long it lasts",
  "<strong class='text-amber-400'>Your credits stay active forever</strong> — no expiration dates",
  "Get a new batch of <strong class='text-amber-400'>monthly credits</strong> with your subscription",
  "You're free to <strong class='text-amber-400'>upgrade, downgrade, or cancel</strong> anytime",
];
