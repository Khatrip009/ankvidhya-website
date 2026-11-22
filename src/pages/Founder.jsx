
import { Link } from "react-router-dom";
import ResponsiveImage from "../components/ResponsiveImage";
import SEO from "../components/SEO";
import { SITE_IMAGES } from "../data/siteImages";

import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Brain,
  Calculator,
  GraduationCap,
  Lightbulb,
  Quote,
  Sparkles,
  Star,
  Trophy,
  Tv,
  Users,
  Target,
} from "lucide-react";

// =====================================================
// ANKVIDHYA BRAND
// =====================================================

// =====================================================
// RECOGNITION TIMELINE
// Based on the supplied Ankvidhya brochures
// =====================================================

const recognitions = [
  {
    year: "2020",
    title: "Education Hero of the Year",
    organization: "Vyapar Jagat",
    description:
      "Recognised as Education Hero of the Year.",
  },
  {
    year: "2021",
    title: "Bharatiya Ganit Rishi",
    organization: "Vishva Dharma Sansad",
    description:
      "Recognition for contribution to Indian Mathematics.",
  },
  {
    year: "2022",
    title: "Young National Ramanujan Mathematician",
    organization: "NCTS, India",
    description:
      "Recognised as Young National Ramanujan Mathematician.",
  },
  {
    year: "2023",
    title: "Outstanding Young Personality of the Year",
    organization: "JCI India",
    description:
      "Recognition as an Outstanding Young Personality.",
  },
  {
    year: "2024",
    title: "Representing India on Russian National Television",
    organization: "The Incredible People",
    description:
      "The brochure describes Akshay Khatri as the first Gujarati to represent India on the Russian national television show.",
  },
  {
    year: "2025",
    title: "Ankvidhya Student World Record",
    organization: "Ankvidhya",
    description:
      "An Ankvidhya student achieved a World Record.",
  },
];

// =====================================================
// MATHEMATICAL ABILITIES
// =====================================================

const abilities = [
  {
    number: "01",
    icon: Calculator,
    title: "Reverse Multiplication",
    description:
      "The brochure describes him as the first in the world to perform reverse calculations — giving the question from the answer in multiplication.",
  },
  {
    number: "02",
    icon: Brain,
    title: "Extraordinary Mental Calculation",
    description:
      "The brochure states that he can speak 1,000,000,000,000 mathematics tables faster than a calculator.",
  },
  {
    number: "03",
    icon: Lightbulb,
    title: "Twelve Types of Calculations",
    description:
      "The brochure states that he can beat a calculator in 12 types of calculations.",
  },
];

// =====================================================
// WORLD RECORD CATEGORIES
// The brochure names six records, with some repeated
// descriptions. We show distinct categories rather
// than inventing additional individual record titles.
// =====================================================

const recordCategories = [
  {
    icon: Calculator,
    title: "Fastest Reverse Multiplication",
  },
  {
    icon: Brain,
    title: "Extra Ordinary Reverse Multiplication",
  },
  {
    icon: Users,
    title: "Highest Student Participation",
  },
  {
    icon: Target,
    title: "Fastest Reverse Percentage",
  },
];

// =====================================================
// ANKVIDHYA AT A GLANCE
// Figures as stated in the supplied brochure.
// =====================================================

const impactStats = [
  { value: "40,000+", label: "Students Empowered", icon: Users },
  { value: "140+", label: "Schools Associated", icon: GraduationCap },
  { value: "6", label: "World Records", icon: Star },
];

// =====================================================
// REUSABLE COMPONENTS
// =====================================================

function Eyebrow({ children, light = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-[2px] w-7 shrink-0 bg-[#DB1D2D]" />

      <span
        className={`text-[10px] font-extrabold uppercase tracking-[0.2em] ${
          light ? "text-[#E7C77D]" : "text-[#DB1D2D]"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  light = false,
  center = false,
}) {
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl`}>

      <div className={center ? "flex justify-center" : ""}>
        <Eyebrow light={light}>{eyebrow}</Eyebrow>
      </div>

      <h2
        className={`mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl ${
          light ? "text-white" : "text-[#182131]"
        }`}
      >
        {title}

        {highlight && (
          <span
            className={`block ${
              light ? "text-[#E7C77D]" : "text-[#DB1D2D]"
            }`}
          >
            {highlight}
          </span>
        )}
      </h2>

      {description && (
        <p
          className={`mt-5 text-sm leading-7 sm:text-base sm:leading-8 ${
            light ? "text-slate-300" : "text-slate-500"
          }`}
        >
          {description}
        </p>
      )}

    </div>
  );
}

function PrimaryButton({ to, children, light = false }) {
  return (
    <Link
      to={to}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition ${
        light
          ? "bg-white text-[#182131] hover:bg-[#E7C77D]"
          : "bg-[#DB1D2D] text-white hover:bg-red-700"
      }`}
    >
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}

// =====================================================
// FOUNDER HERO PHOTO
// =====================================================

function FounderPortrait() {
  return (
    <div className="relative mx-auto w-full max-w-[430px]">

      {/* Background decoration */}
      <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full border border-[#C6A35A]/40 sm:h-44 sm:w-44" />

      <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full border border-[#DB1D2D]/20 sm:h-44 sm:w-44" />

      {/* Portrait container */}
      <div className="relative overflow-hidden rounded-[28px] border border-[#C6A35A]/50 bg-[#182131] p-3 shadow-2xl">

        <div className="relative overflow-hidden rounded-[20px]">

          <ResponsiveImage
            image={SITE_IMAGES.founder.portrait}
            priority
            objectFit="contain"
            className="max-h-[650px] w-full bg-[#182131] object-contain"
            sizes="(max-width: 1024px) 90vw, 35vw"
          />

          {/* Image overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#182131] via-[#182131]/70 to-transparent px-5 pb-6 pt-24 sm:px-7">

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E7C77D]">
              FOUNDER & ACADEMIC DIRECTOR
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
              Akshay Khatri
            </h2>

            <p className="mt-1 text-sm font-semibold text-[#E7C77D]">
              Mr. Calculator
            </p>

          </div>

        </div>

        {/* Record badge */}
        <div className="flex items-center justify-between gap-3 px-3 py-4">

          <div>
            <p className="text-2xl font-extrabold text-[#E7C77D]">
              6×
            </p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-300">
              World Record Holder
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C6A35A]/40 bg-white/10 text-[#E7C77D]">
            <Trophy size={22} />
          </div>

        </div>

      </div>

    </div>
  );
}

// =====================================================
// WORLD RECORD CARD
// =====================================================

// =====================================================
// RECOGNITION TIMELINE
// =====================================================

function RecognitionTimeline() {
  return (
    <div className="relative">

      <div className="absolute bottom-5 left-[13px] top-5 w-px bg-[#C6A35A]/40 sm:left-[17px]" />

      <div className="space-y-7">

        {recognitions.map((item) => (
          <div
            key={item.year}
            className="relative flex gap-5 sm:gap-7"
          >

            {/* Timeline point */}
            <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[#C6A35A] bg-[#182131] sm:h-9 sm:w-9">
              <Star size={13} className="text-[#E7C77D]" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:p-6">

              <div className="flex flex-wrap items-center justify-between gap-2">

                <span className="text-xs font-extrabold tracking-wider text-[#E7C77D]">
                  {item.year}
                </span>

                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold text-slate-400">
                  {item.organization}
                </span>

              </div>

              <h3 className="mt-3 text-base font-extrabold leading-snug text-white sm:text-lg">
                {item.title}
              </h3>

              <p className="mt-2 text-xs leading-6 text-slate-300 sm:text-sm">
                {item.description}
              </p>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

// =====================================================
// MAIN FOUNDER PAGE
// =====================================================

export default function Founder() {
  return (
    <div className="overflow-hidden bg-white">
      <SEO title="Founder and Academic Director" description="Meet Akshay Khatri, Founder and Academic Director of Ankvidhya, and explore the educational vision and mathematical recognition behind the brand." path="/founder" image={SITE_IMAGES.founder.portrait.src} />

      {/* =================================================
          01. HERO
      ================================================= */}

      <section className="relative overflow-hidden bg-[#182131]">

        <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full border border-white/10 sm:h-[700px] sm:w-[700px]" />

        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#DB1D2D]/15 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_0.9fr] lg:gap-16">

          <div className="order-2 lg:order-1">

            <Eyebrow light>
              THE VISION BEHIND THE BRAND
            </Eyebrow>

            <h1 className="mt-7 text-[42px] font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-[66px]">

              Built on Proven
              <span className="block text-[#E7C77D]">
                Mathematical
              </span>
              Excellence.

            </h1>

            <div className="mt-7">

              <p className="text-2xl font-extrabold text-white sm:text-3xl">
                Akshay Khatri
              </p>

              <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-[#E7C77D]">
                Founder & Academic Director, Ankvidhya
              </p>

              <p className="mt-2 text-sm font-semibold italic text-slate-400">
                Popularly known as "Mr. Calculator"
              </p>

            </div>

            <p className="mt-7 max-w-xl text-sm leading-8 text-slate-300 sm:text-base">
              With a decade of experience in education,
              Akshay Khatri has built a reputation for making
              Mathematics fast, intuitive and meaningful.
              His record-setting work in mental calculation
              forms the foundation of the Ankvidhya method.
            </p>

            <div className="mt-8 rounded-2xl border-l-4 border-[#C6A35A] bg-white/[0.06] p-5 sm:p-6">

              <Quote size={25} className="text-[#E7C77D]" />

              <p className="mt-4 text-lg font-semibold italic leading-8 text-white sm:text-xl">
                "We don't just teach children to calculate faster.
                We help them think better, live better and become
                better human beings."
              </p>

              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#E7C77D]">
                — Akshay Khatri
              </p>

            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <PrimaryButton to="/online-courses">
                Explore Ankvidhya Programs
              </PrimaryButton>

              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-[#182131]"
              >
                Connect With Us
                <ArrowRight size={17} />
              </Link>

            </div>
          </div>

          <div className="order-1 lg:order-2">
            <FounderPortrait />
          </div>

        </div>
      </section>

      {/* =================================================
          02. FOUNDER INTRODUCTION
      ================================================= */}

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

          <div>

            <Eyebrow>
              THE MAN BEHIND THE MISSION
            </Eyebrow>

            <h2 className="mt-5 text-3xl font-extrabold leading-tight text-[#182131] sm:text-4xl">
              Making Mathematics
              <span className="block text-[#DB1D2D]">
                Fast, Intuitive & Meaningful.
              </span>
            </h2>

            <p className="mt-6 text-sm leading-8 text-slate-600 sm:text-base">
              Akshay Khatri's work in mental calculation
              focuses on making mathematical processes
              intuitive, engaging and meaningful for learners.
            </p>

            <p className="mt-5 text-sm leading-8 text-slate-600 sm:text-base">
              With a decade of experience in education,
              his mathematical demonstrations and
              record-setting work became the foundation
              for the Ankvidhya academic approach.
            </p>

            <p className="mt-5 text-sm leading-8 text-slate-600 sm:text-base">
              Ankvidhya brings that approach into a
              structured educational ecosystem with
              Abacus, conceptual Mathematics, Vedic-inspired
              techniques and Jivan Vidhya.
            </p>

          </div>

          <div className="rounded-3xl bg-[#F5F6F8] p-6 sm:p-9">

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DB1D2D] text-white">
                <Brain size={23} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#DB1D2D]">
                  THE ANKVIDHYA VISION
                </p>

                <h3 className="mt-1 text-lg font-extrabold text-[#182131]">
                  Beyond Calculation
                </h3>
              </div>
            </div>

            <div className="mt-8 space-y-5">

              {[
                ["Mathematical Ability", "Develop speed, accuracy and calculation confidence."],
                ["Conceptual Clarity", "Understand how and why mathematical methods work."],
                ["Logical Thinking", "Build structured approaches to problem-solving."],
                ["Life Education", "Connect learning with discipline, values and everyday life."],
              ].map(([title, description], index) => (
                <div
                  key={title}
                  className="flex gap-4"
                >

                  <span className="text-sm font-extrabold text-[#C6A35A]">
                    0{index + 1}
                  </span>

                  <div>
                    <h4 className="text-sm font-extrabold text-[#182131]">
                      {title}
                    </h4>

                    <p className="mt-1 text-xs leading-6 text-slate-500">
                      {description}
                    </p>
                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>
      </section>

      {/* =================================================
          03. MATHEMATICAL ABILITIES
      ================================================= */}

      <section className="bg-[#F5F6F8] px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="MATHEMATICAL ABILITIES"
            title="A Unique Approach to"
            highlight="Mental Mathematics."
            description="The supplied Ankvidhya brochures describe three distinctive mathematical abilities associated with Akshay Khatri."
          />

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">

            {abilities.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-8"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-3xl font-extrabold text-[#DB1D2D]/25">
                      {item.number}
                    </span>

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#182131] text-[#E7C77D]">
                      <Icon size={24} />
                    </div>

                  </div>

                  <h3 className="mt-6 text-xl font-extrabold leading-snug text-[#182131]">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    {item.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* =================================================
          04. SIX WORLD RECORDS
      ================================================= */}

      <section className="bg-[#182131] px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

            <div>

              <Eyebrow light>
                RECORD-SETTING MATHEMATICAL WORK
              </Eyebrow>

              <div className="mt-8 flex items-center gap-5">

                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-[#C6A35A] bg-[#C6A35A]/10 sm:h-32 sm:w-32">
                  <div className="text-center">
                    <p className="text-4xl font-extrabold text-[#E7C77D] sm:text-5xl">
                      6×
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white">
                      Records
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                    World Record
                    <span className="block text-[#E7C77D]">
                      Holder.
                    </span>
                  </h2>
                  <p className="mt-2 text-xs text-slate-400">
                    As stated in the Ankvidhya brochures.
                  </p>
                </div>

              </div>

              <p className="mt-7 text-sm leading-8 text-slate-300">
                The brochures identify six world records
                associated with reverse multiplication,
                reverse percentage and student participation.
              </p>

            </div>

            <div>

              <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#E7C77D]">
                RECORD CATEGORIES
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                {recordCategories.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.06] p-5"
                    >

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E7C77D]/15 text-[#E7C77D]">
                        <Icon size={21} />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-[#E7C77D]">
                          RECORD CATEGORY 0{index + 1}
                        </p>

                        <h4 className="mt-1 text-sm font-bold leading-5 text-white">
                          {item.title}
                        </h4>
                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

          </div>

          <div className="mt-10 rounded-xl border border-[#E7C77D]/20 bg-[#E7C77D]/10 p-5">

            <p className="text-xs leading-6 text-slate-300">
              The source brochure lists six records but repeats
              two record descriptions. The individual categories
              above are the distinct descriptions shown in the
              supplied material; confirm the official record
              titles and awarding organisations before publishing
              a complete six-item record register.
            </p>

          </div>

        </div>
      </section>

      {/* =================================================
          05. INTERNATIONAL REPRESENTATION
      ================================================= */}

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">

          <div className="relative overflow-hidden rounded-3xl bg-[#182131] p-7 text-white sm:p-10">

            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-[#C6A35A]/20" />

            <div className="relative">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#DB1D2D] text-white">
                <Tv size={27} />
              </div>

              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#E7C77D]">
                INTERNATIONAL RECOGNITION
              </p>

              <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                Representing Indian Mathematics
                <span className="block text-[#E7C77D]">
                  on a Global Stage.
                </span>
              </h2>

              <p className="mt-6 text-sm leading-7 text-slate-300">
                In 2024, Akshay Khatri represented India
                on Russian national television through
                the programme "The Incredible People".
              </p>

              <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">

                <div className="text-4xl font-extrabold text-[#E7C77D]">
                  2024
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    The Incredible People
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Russian National Television
                  </p>
                </div>

              </div>

            </div>
          </div>

          <div>

            <Eyebrow>
              A MILESTONE IN THE JOURNEY
            </Eyebrow>

            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-[#182131] sm:text-4xl">
              First Gujarati to Represent India
              <span className="block text-[#DB1D2D]">
                on the Show.
              </span>
            </h2>

            <p className="mt-6 text-sm leading-8 text-slate-500 sm:text-base">
              The supplied franchise brochure describes
              Akshay Khatri as the first Gujarati to
              represent India on the Russian national
              television show "The Incredible People".
            </p>

            <p className="mt-5 text-sm leading-8 text-slate-500 sm:text-base">
              This appearance forms part of the
              international recognition journey highlighted
              in the Ankvidhya founder profile.
            </p>

            <div className="mt-8 flex items-center gap-3 rounded-xl border border-slate-200 bg-[#F5F6F8] p-5">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#DB1D2D]">
                <GlobeIcon />
              </div>

              <div>
                <p className="text-sm font-bold text-[#182131]">
                  Indian Mathematical Ability
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Shared with an international audience in 2024.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =================================================
          06. AWARDS & RECOGNITION TIMELINE
      ================================================= */}

      <section className="bg-[#F5F6F8] px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">

            <div className="lg:sticky lg:top-28 lg:self-start">

              <Eyebrow>
                A JOURNEY OF IMPACT
              </Eyebrow>

              <h2 className="mt-5 text-3xl font-extrabold leading-tight text-[#182131] sm:text-4xl">
                Recognition.
                <span className="block text-[#DB1D2D]">
                  Milestones.
                </span>
                Inspiration.
              </h2>

              <p className="mt-6 text-sm leading-8 text-slate-500">
                From education recognition to mathematical
                achievements and international
                representation, the Ankvidhya brochure
                documents a journey spanning 2020–2025.
              </p>

              <div className="mt-9 flex items-center gap-4 rounded-2xl bg-[#182131] p-5 text-white">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C6A35A] text-[#182131]">
                  <Award size={25} />
                </div>

                <div>
                  <p className="text-2xl font-extrabold text-[#E7C77D]">
                    2020–2025
                  </p>

                  <p className="mt-1 text-xs text-slate-300">
                    Documented recognition timeline
                  </p>
                </div>

              </div>

            </div>

            <RecognitionTimeline />

          </div>

        </div>
      </section>

      {/* =================================================
          07. ANKVIDHYA AT A GLANCE
      ================================================= */}

      <section className="bg-[#182131] px-5 py-16 sm:px-8 sm:py-20">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="THE EDUCATIONAL ECOSYSTEM"
            title="The Impact Behind"
            highlight="the Vision."
            light
            center
          />

          <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">

            {impactStats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-center sm:p-7"
                >

                  <Icon
                    size={25}
                    className="mx-auto text-[#E7C77D]"
                  />

                  <p className="mt-5 text-2xl font-extrabold text-white sm:text-3xl">
                    {item.value}
                  </p>

                  <p className="mt-2 text-[10px] font-bold uppercase leading-5 tracking-wider text-slate-400 sm:text-xs">
                    {item.label}
                  </p>

                </div>
              );
            })}

          </div>

          <p className="mt-7 text-center text-[10px] leading-5 text-slate-400">
            Figures reproduced from the supplied Ankvidhya
            brochures; confirm the latest approved figures
            before publication.
          </p>

        </div>
      </section>

      {/* =================================================
          08. EDUCATIONAL VISION
      ================================================= */}

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-5xl text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-[#DB1D2D]">
            <Sparkles size={27} />
          </div>

          <Eyebrow>
            THE ANKVIDHYA PHILOSOPHY
          </Eyebrow>

          <h2 className="mt-7 text-3xl font-extrabold leading-tight text-[#182131] sm:text-5xl">
            Mathematics is Not Just About
            <span className="block text-[#DB1D2D]">
              Calculating Faster.
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-slate-500 sm:text-lg">
            It is about thinking better, understanding
            deeply, developing discipline and becoming
            a better human being.
          </p>

          <div className="mt-9 rounded-2xl bg-[#F5F6F8] p-6 sm:p-9">
            <Quote size={27} className="mx-auto text-[#C6A35A]" />

            <p className="mt-5 text-xl font-bold italic leading-9 text-[#182131] sm:text-2xl">
              "We help them think better, live better and
              become better human beings."
            </p>

            <p className="mt-5 text-xs font-extrabold uppercase tracking-wider text-[#DB1D2D]">
              — Akshay Khatri
            </p>
          </div>

        </div>
      </section>

      {/* =================================================
          09. PROGRAMS CTA
      ================================================= */}

      <section className="bg-[#DB1D2D] px-5 py-16 text-center sm:px-8 sm:py-20">

        <div className="mx-auto max-w-4xl">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">
            THE VISION CONTINUES THROUGH ANKVIDHYA
          </p>

          <h2 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Creating Math Geniuses.
            <span className="block text-[#FFE09A]">
              Building Better Futures.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
            Discover the Ankvidhya academic ecosystem,
            explore our learning programs or become
            part of our mission through a school partnership
            or franchise center.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

            <PrimaryButton to="/online-courses" light>
              Explore Our Programs
            </PrimaryButton>

            <Link
              to="/school-partnership"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/50 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Partner With Ankvidhya
              <ArrowUpRight size={17} />
            </Link>

          </div>

        </div>
      </section>

    </div>
  );
}

// =====================================================
// SMALL ICON COMPONENT
// =====================================================

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
