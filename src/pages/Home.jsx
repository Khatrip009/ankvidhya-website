
import { Link } from "react-router-dom";
import ResponsiveImage from "../components/ResponsiveImage";
import SEO from "../components/SEO";
import { SITE_IMAGES } from "../data/siteImages";
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  Target,
  Rocket,
  Trophy,
  Lightbulb,
  Heart,
  ShieldCheck,
  Eye,
  GraduationCap,
  HandHeart,
  Star,
} from "lucide-react";

// =====================================================
// ANKVIDHYA BRAND
// =====================================================



// =====================================================
// REUSABLE COMPONENTS
// =====================================================

function Eyebrow({ children, light = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-[2px] w-7 shrink-0 bg-[#DB1D2D]" />
      <span className={`text-[10px] font-extrabold uppercase tracking-[0.2em] ${
        light ? "text-[#E7C77D]" : "text-[#DB1D2D]"
      }`}>
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

      <h2 className={`mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl ${
        light ? "text-white" : "text-[#182131]"
      }`}>
        {title}
        {highlight && (
          <span className={`block ${light ? "text-[#E7C77D]" : "text-[#DB1D2D]"}`}>
            {highlight}
          </span>
        )}
      </h2>

      {description && (
        <p className={`mt-5 text-sm leading-7 sm:text-base sm:leading-8 ${
          light ? "text-slate-300" : "text-slate-500"
        }`}>
          {description}
        </p>
      )}
    </div>
  );
}

function CTAButton({ to, children, secondary = false }) {
  return (
    <Link
      to={to}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition ${
        secondary
          ? "border border-slate-200 bg-white text-[#182131] hover:border-[#DB1D2D] hover:text-[#DB1D2D]"
          : "bg-[#DB1D2D] text-white hover:bg-red-700"
      }`}
    >
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}

// =====================================================
// HERO BENEFITS
// =====================================================

const heroBenefits = [
  { icon: Brain, title: "Stronger Brain" },
  { icon: Target, title: "Better Focus" },
  { icon: Rocket, title: "Faster Learning" },
  { icon: Trophy, title: "Brighter Future" },
];

// =====================================================
// TRANSFORMATION
// =====================================================

const transformations = [
  {
    icon: Heart,
    from: "Fear",
    to: "Confidence",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    icon: Lightbulb,
    from: "Confusion",
    to: "Clarity",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Brain,
    from: "Memorization",
    to: "Understanding",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Rocket,
    from: "Potential",
    to: "Performance",
    color: "text-green-600",
    bg: "bg-green-50",
  },
];

// =====================================================
// MENTAL MATH BENEFITS
// =====================================================

const mentalMathBenefits = [
  {
    icon: Eye,
    title: "Visualise",
    description: "Develop the ability to picture numbers and mathematical ideas.",
  },
  {
    icon: Brain,
    title: "Remember",
    description: "Practise recalling and working with mathematical information.",
  },
  {
    icon: Lightbulb,
    title: "Process",
    description: "Build calculation fluency and structured thinking.",
  },
  {
    icon: Target,
    title: "Focus",
    description: "Practise concentration and sustained attention.",
  },
];

// =====================================================
// LIFE VALUES
// =====================================================

const values = [
  {
    icon: Target,
    title: "Discipline",
    description: "Learn to be focused and consistent.",
    color: "text-blue-600",
  },
  {
    icon: HandHeart,
    title: "Respect",
    description: "Value others and build strong relationships.",
    color: "text-orange-600",
  },
  {
    icon: ShieldCheck,
    title: "Responsibility",
    description: "Be responsible towards family and society.",
    color: "text-green-600",
  },
  {
    icon: Heart,
    title: "Compassion",
    description: "Care for people, nature and the world.",
    color: "text-purple-600",
  },
  {
    icon: Star,
    title: "Purpose",
    description: "Grow with a sense of purpose and direction.",
    color: "text-red-600",
  },
];

// =====================================================
// LEARNING JOURNEY
// =====================================================

const learningStages = [
  {
    number: "01",
    grades: "LKG – UKG",
    title: "Building a Strong Foundation",
    program: "ANK ARYABHATTA",
    subtitle: "Abacus",
    color: "border-green-500",
    badge: "bg-green-100 text-green-800",
    description:
      "Introduce children to the world of numbers through engaging Abacus-based learning.",
    features: [
      "Number Sense",
      "Better Concentration",
      "Memory Power",
      "Confidence in Mathematics",
    ],
  },
  {
    number: "02",
    grades: "GRADE 1 – 3",
    title: "Build Concepts. Improve Thinking.",
    program: "ANK ARYABHATTA + ANK RAMANUJ",
    subtitle: "Abacus + NCERT Foundation + IMO",
    color: "border-orange-500",
    badge: "bg-orange-100 text-orange-800",
    description:
      "Connect calculation techniques with conceptual understanding and school-level mathematics.",
    features: [
      "Abacus and Finger Math",
      "Speed and Accuracy",
      "Conceptual Understanding",
      "Jivan Vidhya Connection",
    ],
  },
  {
    number: "03",
    grades: "GRADE 4 – 9",
    title: "Think Faster. Solve Smarter.",
    program: "ANK ARYABHATTA + RAMANUJ + KAUTILYA",
    subtitle: "Abacus + NCERT Foundation + Vedic Mathematics",
    color: "border-blue-600",
    badge: "bg-blue-100 text-blue-800",
    description:
      "Develop advanced mathematical thinking, problem-solving and competitive examination readiness.",
    features: [
      "Abacus and Finger Math",
      "Speed and Accuracy",
      "Deep Conceptual Learning",
      "Advanced Problem Solving",
      "Competitive Exam Readiness",
    ],
  },
];

// =====================================================
// FOUNDER MILESTONES
// =====================================================

const milestones = [
  { year: "2020", title: "Education Hero of the Year" },
  { year: "2021", title: "Bharatiya Ganit Rishi" },
  { year: "2022", title: "Young National Ramanujan Mathematician" },
  { year: "2023", title: "Outstanding Young Personality of the Year" },
  { year: "2024", title: "Represented India on Russian National Television" },
  { year: "2025", title: "Ankvidhya student achieved a World Record" },
];

// =====================================================
// MAIN HOME PAGE
// =====================================================

export default function Home() {
  return (
    <div className="overflow-hidden">
      <SEO title="Mathematics Beyond Numbers" description="Discover Ankvidhya's Abacus, Mathematics and Jivan Vidhya learning approach for children, schools and education partners." path="/" />

      {/* =================================================
          01. HERO
      ================================================= */}

      <section className="relative overflow-hidden bg-[#182131]">

        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full border border-white/[0.06] sm:h-[600px] sm:w-[600px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#DB1D2D]/10 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-2 lg:gap-12 lg:py-24">

          <div className="relative z-10">

            <Eyebrow light>
              SHAPING TODAY'S LEARNERS
            </Eyebrow>

            <h1 className="mt-7 text-[42px] font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-[68px]">
              What If Mathematics
              <span className="block text-[#F04452]">
                Becomes Your Child's
              </span>
              Superpower?
            </h1>

            <p className="mt-6 text-xl font-bold leading-snug text-white sm:text-2xl">
              Building <span className="text-[#E7C77D]">Faster Minds,</span>
              <br />
              Stronger Confidence &amp; Brighter Futures.
            </p>

            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              Every child is born brilliant. Ankvidhya brings
              together Abacus, Mental Math, Conceptual Learning,
              Vedic Mathematics and Life Skills to help children
              discover their mathematical potential.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTAButton to="/online-courses">
                Find the Right Program
              </CTAButton>

              <CTAButton to="/school-partnership" secondary>
                School Partnership
              </CTAButton>
            </div>

            <div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4">
              {heroBenefits.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="flex items-center gap-2">
                    <Icon size={18} className="shrink-0 text-[#E7C77D]" />
                    <span className="text-[10px] font-semibold leading-4 text-slate-300 sm:text-xs">
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg pt-2 lg:pt-0">
            <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-2 shadow-2xl">
              <ResponsiveImage
                image={SITE_IMAGES.home.hero}
                priority
                objectFit="cover"
                className="h-[390px] w-full rounded-[22px] object-top sm:h-[500px]"
                sizes="(max-width: 1024px) 90vw, 42vw"
              />
              <div className="absolute inset-x-2 bottom-2 rounded-b-[22px] bg-gradient-to-t from-[#182131] via-[#182131]/75 to-transparent px-5 pb-5 pt-20 sm:px-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E7C77D]">LEARN · PRACTISE · GROW</p>
                <p className="mt-2 text-xl font-extrabold text-white sm:text-2xl">Every child has potential.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Impact statistics */}
        <div className="border-t border-white/10 bg-white/[0.04]">
          <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-white/15 px-4 py-6 sm:px-8 sm:py-8">

            {[
              ["40,000+", "Students Empowered"],
              ["140+", "Schools Associated"],
              ["6", "World Records"],
            ].map(([value, label]) => (
              <div key={label} className="px-2 text-center sm:px-5">
                <p className="text-2xl font-extrabold text-[#E7C77D] sm:text-4xl">
                  {value}
                </p>
                <p className="mt-2 text-[9px] font-semibold uppercase leading-4 tracking-wider text-slate-300 sm:text-xs">
                  {label}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* =================================================
          02. EVERY CHILD IS BRILLIANT
      ================================================= */}

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="THE ANKVIDHYA APPROACH"
            title="Every Child Is Born Brilliant."
            highlight="Mathematics Simply Reveals It."
            description="Many children don't fear Mathematics itself. They fear being slow, making mistakes and comparing themselves with others. We want to change the way children experience learning."
          />

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {transformations.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.from}
                  className="relative rounded-2xl border border-slate-200 bg-[#F9FAFB] p-5 text-center sm:p-6"
                >
                  <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${item.bg} ${item.color}`}>
                    <Icon size={26} />
                  </div>

                  <p className="mt-5 text-sm font-semibold text-slate-400">
                    {item.from}
                  </p>

                  <div className="my-2 flex justify-center">
                    <ArrowRight size={19} className="text-[#DB1D2D]" />
                  </div>

                  <h3 className="text-xl font-extrabold text-[#182131]">
                    {item.to}
                  </h3>

                  <span className="absolute right-4 top-4 text-xs font-bold text-slate-300">
                    0{index + 1}
                  </span>
                </div>
              );
            })}

          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-[190px_1fr] sm:items-center rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <ResponsiveImage image={SITE_IMAGES.home.practice} objectFit="cover" className="h-36 w-full rounded-xl sm:h-40" sizes="(max-width: 640px) 100vw, 190px" />
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#DB1D2D]">LEARNING BY PRACTICE</p>
              <p className="mt-2 text-lg font-extrabold text-[#182131]">Progress grows through consistent practice.</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">Ankvidhya's learning approach brings practice, understanding and confidence together.</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-[#182131] px-6 py-7 text-center sm:px-10">
            <p className="text-lg font-bold leading-7 text-white sm:text-xl">
              When a child enjoys learning, excellence becomes a
              <span className="text-[#E7C77D]"> habit, not a dream.</span>
            </p>
          </div>

        </div>
      </section>

      {/* =================================================
          03. BRAIN WORKOUT
      ================================================= */}

      <section className="bg-[#F5F6F8] px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="MENTAL MATHEMATICS"
            title="The First 10 Years Shape"
            highlight="The Next 50."
            description="Mental calculation brings several kinds of thinking together. Ankvidhya encourages children to visualise, remember, process and focus as part of an active mathematical learning experience."
          />

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {mentalMathBenefits.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#DB1D2D]">
                      <Icon size={22} />
                    </div>

                    <h3 className="mt-4 font-bold text-[#182131]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-3xl bg-[#182131] p-7 text-white sm:p-10">

              <ResponsiveImage
                image={SITE_IMAGES.home.brain}
                objectFit="contain"
                className="mx-auto mb-6 h-32 w-full max-w-[170px]"
                sizes="170px"
              />

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DB1D2D]">
                  <Brain size={25} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#E7C77D]">
                    A MATHEMATICAL WORKOUT
                  </p>
                  <h3 className="mt-1 text-lg font-bold">
                    An Active Mind at Work
                  </h3>
                </div>
              </div>

              <div className="mt-8 space-y-5">
                {[
                  ["Prefrontal Cortex", "Focus and attention"],
                  ["Parietal Lobe", "Numerical processing"],
                  ["Working Memory", "Holding and using information"],
                  ["Neural Connections", "Learning through practice"],
                ].map(([title, description], index) => (
                  <div key={title} className="flex items-center gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E7C77D]/40 text-sm font-bold text-[#E7C77D]">
                      0{index + 1}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white">
                        {title}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-[#E7C77D]/30 bg-white/5 p-5">
                <p className="text-sm font-bold leading-6 text-white">
                  We don't teach children to calculate faster.
                </p>
                <p className="mt-2 text-lg font-extrabold leading-7 text-[#E7C77D]">
                  We teach their brain to think faster.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          04. MATHEMATICS AND LIFE
      ================================================= */}

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="A COMPLETE HUMAN BEING"
            title="Not Just Better at Math."
            highlight="Better in Life."
            description="We don't just build calculation skills. We aim to build character, values and a beautiful future."
            center
          />

          <div className="mt-10 rounded-3xl bg-[#182131] p-6 text-center sm:p-10">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E7C77D]">
              THE PERFECT BALANCE
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-6">

              <div>
                <p className="text-4xl font-extrabold text-blue-300 sm:text-6xl">
                  IQ
                </p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white">
                  Think Smart
                </p>
              </div>

              <span className="text-2xl font-bold text-white/50">+</span>

              <div>
                <p className="text-4xl font-extrabold text-red-400 sm:text-6xl">
                  EQ
                </p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white">
                  Feel Right
                </p>
              </div>

              <span className="text-2xl font-bold text-white/50">+</span>

              <div>
                <p className="text-4xl font-extrabold text-green-400 sm:text-6xl">
                  SQ
                </p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white">
                  Live Right
                </p>
              </div>

            </div>

            <div className="mx-auto mt-7 max-w-sm rounded-full border border-[#E7C77D]/40 px-5 py-3 text-sm font-bold text-[#E7C77D]">
              FOR A COMPLETE HUMAN BEING
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-center text-xl font-extrabold text-[#182131] sm:text-2xl">
              Children Learn. Values Stay. Life Becomes Beautiful.
            </h3>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {values.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-[#F9FAFB] p-5 text-center"
                  >
                    <Icon
                      size={28}
                      className={`mx-auto ${item.color}`}
                    />

                    <h4 className="mt-4 text-sm font-bold text-[#182131]">
                      {item.title}
                    </h4>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* =================================================
          05. LEARNING JOURNEY
      ================================================= */}

      <section className="bg-[#F5F6F8] px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="THE LEARNING JOURNEY"
            title="A Learning Journey"
            highlight="That Grows With Your Child."
            description="From strong basics to advanced thinking. From a confident learner to a future leader. The right age, the right program and continuous growth."
          />

          <div className="mt-12 space-y-5">

            {learningStages.map((stage) => (
              <div
                key={stage.number}
                className={`overflow-hidden rounded-2xl border-l-4 ${stage.color} border border-slate-200 bg-white shadow-sm`}
              >
                <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[170px_1fr] lg:items-center">

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      STAGE {stage.number}
                    </p>

                    <p className="mt-2 text-3xl font-extrabold text-[#182131] sm:text-4xl">
                      {stage.grades}
                    </p>
                  </div>

                  <div>
                    <span className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wider ${stage.badge}`}>
                      {stage.program}
                    </span>

                    <h3 className="mt-4 text-xl font-extrabold text-[#182131] sm:text-2xl">
                      {stage.title}
                    </h3>

                    <p className="mt-1 text-xs font-semibold text-[#DB1D2D]">
                      {stage.subtitle}
                    </p>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                      {stage.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {stage.features.map((feature) => (
                        <span
                          key={feature}
                          className="rounded-lg bg-[#F5F6F8] px-3 py-2 text-[11px] font-semibold text-slate-600"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>

          <div className="mt-9 rounded-2xl bg-[#182131] p-6 text-center sm:p-8">
            <p className="text-lg font-extrabold text-white sm:text-xl">
              Every Step Today,
              <span className="block text-[#E7C77D]">
                A Better Tomorrow!
              </span>
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Sharper thinking · Faster calculations · Stronger values · Confident future
            </p>
          </div>

          <div className="mt-7 flex justify-center">
            <CTAButton to="/online-courses">
              Explore Learning Opportunities
            </CTAButton>
          </div>

        </div>
      </section>

      {/* =================================================
          06. FOUNDER
      ================================================= */}

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

            {/* Founder identity card */}
            <div className="relative overflow-hidden rounded-3xl bg-[#182131] p-7 text-white sm:p-10">

              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10" />
              <div className="absolute -right-5 -top-5 h-40 w-40 rounded-full border border-[#E7C77D]/20" />

              <div className="relative">

                <Eyebrow light>
                  THE MIND BEHIND ANKVIDHYA
                </Eyebrow>

                <div className="mt-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#E7C77D]/40 bg-white/10">
                  <GraduationCap size={40} className="text-[#E7C77D]" />
                </div>

                <h3 className="mt-8 text-3xl font-extrabold sm:text-4xl">
                  Akshay Khatri
                </h3>

                <p className="mt-2 text-sm font-bold text-[#E7C77D]">
                  Founder, Ankvidhya
                </p>

                <p className="mt-6 text-sm leading-7 text-slate-300">
                  With a decade of experience in education,
                  Akshay Khatri has built a reputation for
                  making Mathematics fast, intuitive and
                  meaningful. His work in mental calculation
                  forms the foundation of the Ankvidhya approach.
                </p>

                <blockquote className="mt-8 border-l-2 border-[#DB1D2D] pl-5 text-lg font-semibold italic leading-8 text-white">
                  "We don't just teach children to calculate faster.
                  We help them think better, live better and become
                  better human beings."
                </blockquote>

                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[#E7C77D]">
                  — Akshay Khatri
                </p>

              </div>
            </div>

            {/* Recognition */}
            <div>

              <Eyebrow>
                A JOURNEY OF IMPACT
              </Eyebrow>

              <h2 className="mt-5 text-3xl font-extrabold leading-tight text-[#182131] sm:text-4xl">
                Building a Legacy of
                <span className="block text-[#DB1D2D]">
                  Mathematical Excellence.
                </span>
              </h2>

              <div className="mt-8 grid grid-cols-3 gap-3">

                {[
                  ["6", "World Records"],
                  ["140+", "Schools"],
                  ["40,000+", "Students"],
                ].map(([number, label]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-200 bg-[#F9FAFB] p-4"
                  >
                    <p className="text-xl font-extrabold text-[#DB1D2D] sm:text-3xl">
                      {number}
                    </p>
                    <p className="mt-2 text-[10px] font-bold leading-4 text-slate-500 sm:text-xs">
                      {label}
                    </p>
                  </div>
                ))}

              </div>

              <h3 className="mt-9 text-sm font-extrabold uppercase tracking-wider text-[#182131]">
                Honours &amp; Recognition
              </h3>

              <div className="mt-5 space-y-4 border-l-2 border-[#DB1D2D]/30 pl-5">

                {milestones.map((item) => (
                  <div key={item.year} className="relative">
                    <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-[#DB1D2D] ring-2 ring-red-100" />

                    <p className="text-xs font-extrabold text-[#DB1D2D]">
                      {item.year}
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-6 text-[#182131]">
                      {item.title}
                    </p>
                  </div>
                ))}

              </div>

              <Link
                to="/founder"
                className="mt-8 inline-flex min-h-12 items-center gap-2 text-sm font-bold text-[#DB1D2D]"
              >
                Explore Founder Profile
                <ArrowRight size={17} />
              </Link>

            </div>

          </div>
        </div>
      </section>

      {/* =================================================
          07. FINAL CALL TO ACTION
      ================================================= */}

      <section className="relative overflow-hidden bg-[#DB1D2D] px-5 py-16 text-center sm:px-8 sm:py-24">

        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/15" />
        <div className="pointer-events-none absolute -left-32 -bottom-32 h-96 w-96 rounded-full border border-white/15" />

        <div className="relative mx-auto max-w-4xl">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
            LET'S BUILD A BRIGHTER TOMORROW
          </p>

          <h2 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
            The Best Investment
            <span className="block text-[#FFE09A]">
              Is in Your Child's Future.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
            It is not only about marks. It is about thinking,
            character, confidence and the values children
            carry throughout life.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/online-courses"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-bold text-[#182131] transition hover:bg-[#182131] hover:text-white"
            >
              Start Your Child's Journey
              <ArrowUpRight size={17} />
            </Link>

            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/50 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Contact Ankvidhya
              <ArrowUpRight size={17} />
            </Link>

          </div>

        </div>
      </section>

    </div>
  );
}
