
import { useState } from "react";

import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Calculator,
  Brain,
  BookOpen,
  GraduationCap,
  Users,
  CheckCircle2,
  Target,
  Armchair,
  Snowflake,
  Toilet,
  ClipboardList,
  Monitor,
  PackageCheck,
  ChartNoAxesCombined,
  CalendarDays,
  Wallet,
  MapPin,
  IndianRupee,
  ShieldCheck,
  Lightbulb,
  HeartHandshake,
  FileCheck2,
  Phone,
  Mail,
  Send,
  School,
  CircleHelp,
  Layers3, // ADD THIS
} from "lucide-react";

import { supabase } from "../lib/supabaseClient";
import ResponsiveImage from "../components/ResponsiveImage";
import SEO from "../components/SEO";
import { SITE_IMAGES } from "../data/siteImages";

// =====================================================
// BRAND
// =====================================================

const PHONE = "+916357785778";
const DISPLAY_PHONE = "+91 63 5778 5778";

const EMAIL = "akshaykhatri@ankvidhya.com";

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

function Bullet({ children, light = false }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2
        size={17}
        className={`mt-0.5 shrink-0 ${
          light ? "text-[#E7C77D]" : "text-[#DB1D2D]"
        }`}
      />
      <span
        className={`text-sm leading-6 ${
          light ? "text-slate-300" : "text-slate-600"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

// =====================================================
// FOUR ACADEMIC PROGRAMS
// =====================================================

const academicPrograms = [
  {
    name: "Ank Aryabhatta",
    subtitle: "Abacus",
    grades: "LKG – Grade 9",
    icon: Calculator,
    color: "bg-red-50 text-[#DB1D2D]",
    description:
      "A structured Abacus learning program designed to develop mental calculation abilities.",
    features: [
      "Brain Development",
      "Concentration",
      "Speed and Accuracy",
      "Visualisation",
    ],
  },
  {
    name: "Ank Ramanuj",
    subtitle: "Foundation for NCERT",
    grades: "Grades 1–9",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-700",
    description:
      "A mathematical foundation integrating Jivan Vidhya with Mathematics and NCERT.",
    features: [
      "NCERT Foundation",
      "Competitive Examination Foundation",
      "Math Tables",
      "Basic Calculations",
    ],
  },
  {
    name: "Ank Kautilya",
    subtitle: "Inspired by Vedic Mathematics",
    grades: "Grades 4–9",
    icon: Brain,
    color: "bg-amber-50 text-amber-700",
    description:
      "Vedic-inspired calculation techniques designed to strengthen mathematical confidence.",
    features: [
      "Fast Calculations",
      "Competitive Examination Advantage",
      "Confidence Development",
      "Logical Calculation Techniques",
    ],
  },
  {
    name: "Ank Nachiketa",
    subtitle: "Calculation-Based Course",
    grades: "Grades 1–10",
    icon: Lightbulb,
    color: "bg-slate-100 text-[#182131]",
    description:
      "A focused calculation-based learning course integrated with Jivan Vidhya.",
    features: [
      "24 Lectures",
      "Number and Calculation Skills",
      "Jivan Vidhya Integration",
      "Short-Term Learning Program",
    ],
  },
];

// =====================================================
// SIX STEPS OF FRANCHISE MODEL
// =====================================================

const businessSteps = [
  {
    number: "01",
    title: "Franchise Partnership",
    description:
      "Enter into the Ankvidhya franchise partnership and complete the brand fee payment.",
    icon: FileCheck2,
  },
  {
    number: "02",
    title: "Center Setup",
    description:
      "Arrange the required infrastructure and operational setup for your center.",
    icon: Building2,
  },
  {
    number: "03",
    title: "Team Development",
    description:
      "Recruit your faculty and management team. Receive online academic training.",
    icon: Users,
  },
  {
    number: "04",
    title: "Student Admissions",
    description:
      "Build your local presence, generate enquiries and enrol students.",
    icon: GraduationCap,
  },
  {
    number: "05",
    title: "Academic Execution",
    description:
      "Deliver Ankvidhya programs using the prescribed academic methodology.",
    icon: BookOpen,
  },
  {
    number: "06",
    title: "Continuous Improvement",
    description:
      "Receive monthly academic monitoring and guidance from Team Ankvidhya.",
    icon: ChartNoAxesCombined,
  },
];

// =====================================================
// SUPPORT SYSTEM
// =====================================================

const supportItems = [
  {
    number: "01",
    title: "Academic Curriculum & Methodology",
    description:
      "Structured, grade-wise programs and a defined teaching framework.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Online Faculty Training",
    description:
      "Your teachers receive online training in Ankvidhya methodology, Abacus and Vedic-inspired techniques.",
    icon: GraduationCap,
  },
  {
    number: "03",
    title: "Initial Student Kit Inventory",
    description:
      "Initial inventory worth ₹2,50,000 is included within the franchise brand fee.",
    icon: PackageCheck,
  },
  {
    number: "04",
    title: "Additional Learning Resources",
    description:
      "Further student kits are available at applicable standard-wise rates.",
    icon: Layers3,
  },
  {
    number: "05",
    title: "Assessment & Evaluation",
    description:
      "Pre-tests, post-tests, continuous assessment, progress reports and certificates.",
    icon: ClipboardList,
  },
  {
    number: "06",
    title: "Monthly Academic Monitoring",
    description:
      "Regular review of implementation and academic quality.",
    icon: ChartNoAxesCombined,
  },
  {
    number: "07",
    title: "Academic Guidance & Support",
    description:
      "Agreed guidance from Team Ankvidhya as your center grows.",
    icon: HeartHandshake,
  },
];

// =====================================================
// INFRASTRUCTURE
// =====================================================

const infrastructure = [
  {
    icon: School,
    title: "Minimum Two Classrooms",
    description: "At least two classrooms dedicated to Ankvidhya programs.",
  },
  {
    icon: Users,
    title: "Around 25 Students",
    description: "Approximate classroom seating capacity of 25 students.",
  },
  {
    icon: Monitor,
    title: "Teaching Boards",
    description: "Whiteboard or smartboard in every classroom.",
  },
  {
    icon: Armchair,
    title: "Seating Arrangements",
    description: "Benches, desks or individual chairs.",
  },
  {
    icon: Snowflake,
    title: "Air Conditioning",
    description: "Air-conditioned classrooms for a comfortable atmosphere.",
  },
  {
    icon: Toilet,
    title: "Separate Washrooms",
    description: "Separate, hygienic toilet facilities for boys and girls.",
  },
  {
    icon: Users,
    title: "Center Head / Counsellor",
    description: "Dedicated space for enquiries, administration and meetings.",
  },
  {
    icon: Building2,
    title: "Reception & Waiting Area",
    description: "A welcoming area for parents.",
  },
  {
    icon: HeartHandshake,
    title: "Drinking Water",
    description: "Clean and accessible drinking water for students and staff.",
  },
];

// =====================================================
// STUDENT KITS
// =====================================================

const kitPrices = [
  { category: "LKG to UKG", price: "₹2,000" },
  { category: "Grades 1 to 3", price: "₹2,500" },
  { category: "Grades 4 to 9", price: "₹3,000" },
];

const kitComponents = {
  junior: [
    "T-shirt",
    "Bag",
    "Abacus",
    "Practice Book",
    "Pencil",
    "Crayons",
    "Flash Cards",
    "Ank Ramanuj Books",
    "Game Board",
    "Mobile App",
    "Jivan Vidhya & Fun",
    "Habit Trackers",
    "Time Book",
  ],
  senior: [
    "T-shirt",
    "Bag",
    "Abacus",
    "Practice Book",
    "Pencil",
    "Crayons",
    "Flash Cards",
    "Ank Ramanuj Books",
    "Game Board",
    "Mobile App",
    "Jivan Vidhya & Fun",
    "Habit Trackers",
    "Time Book",
    "Ank Kautilya Books",
  ],
};

// =====================================================
// COURSE SCHEDULE
// =====================================================

const schedules = [
  {
    grades: "LKG to Grade 3",
    frequency: "2 days a week · 1.5 hours a day",
    sessions: [
      { name: "Ank Aryabhatta", time: "45 min", percent: 50 },
      { name: "Ank Ramanuj", time: "45 min", percent: 50 },
    ],
  },
  {
    grades: "Grade 4 to Grade 9",
    frequency: "2 days a week · 2 hours a day",
    sessions: [
      { name: "Ank Aryabhatta", time: "45 min", percent: 37.5 },
      { name: "Ank Ramanuj", time: "45 min", percent: 37.5 },
      { name: "Ank Kautilya", time: "30 min", percent: 25 },
    ],
  },
];

// =====================================================
// FORM CONFIGURATION
// =====================================================

const initialForm = {
  applicantName: "",
  email: "",
  phone: "",
  proposedCenterName: "",
  city: "",
  state: "",
  fullAddress: "",
  premisesAvailable: "",
  educationExperience: "",
  investmentCapacity: "",
  expectedStartDate: "",
  message: "",
  consent: false,
  websiteTrap: "",
};

const inputClass =
  "min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#182131] outline-none transition placeholder:text-slate-400 focus:border-[#DB1D2D] focus:ring-4 focus:ring-red-50";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700";

// =====================================================
// FRANCHISE INQUIRY FORM
// Submits a lead only; internal application record
// is created later by authorised staff.
// =====================================================

function FranchiseInquiryForm() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) setError("");
    if (success) setSuccess(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (form.websiteTrap.trim()) {
      // Silently reject honeypot submissions.
      setError("Unable to submit this request.");
      return;
    }

    if (
      !form.applicantName.trim() ||
      !form.phone.trim() ||
      !form.city.trim() ||
      !form.state.trim()
    ) {
      setError(
        "Please complete your name, phone number, city and state."
      );
      return;
    }

    const phoneDigits = form.phone.replace(/\D/g, "");

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setError("Please enter a valid contact number.");
      return;
    }

    if (!form.consent) {
      setError("Please agree to be contacted by Ankvidhya.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        full_name: form.applicantName.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim(),
        inquiry_type: "franchise",
        organization_name:
          form.proposedCenterName.trim() || null,
        city: form.city.trim(),
        state: form.state.trim(),
        country: "India",
        message: form.message.trim() || null,
        consent_to_contact: true,

        custom_fields: {
          form_name: "Ankvidhya Franchise Inquiry",
          proposed_center_name:
            form.proposedCenterName.trim(),
          full_address: form.fullAddress.trim(),
          premises_available: form.premisesAvailable,
          education_experience:
            form.educationExperience.trim(),
          investment_capacity: form.investmentCapacity,
          expected_start_date:
            form.expectedStartDate || null,
        },
      };

      // The anonymous role may INSERT a new lead.
      // Do not chain .select() because public visitors
      // intentionally cannot read CRM lead records.

      const { error: insertError } = await supabase
        .from("leads")
        .insert(payload);

      if (insertError) {
        throw insertError;
      }

      setForm(initialForm);
      setSuccess(true);

    } catch (err) {
      console.error("Franchise inquiry error:", err);

      setError(
        "We could not submit your enquiry. Please try again or contact our team directly."
      );

    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">

      {/* INTRODUCTION */}
      <div className="lg:sticky lg:top-28 lg:self-start">

        <Eyebrow light>
          BECOME AN ANKVIDHYA PARTNER
        </Eyebrow>

        <h2 className="mt-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          Let's Build the Future of Mathematics,
          <span className="block text-[#E7C77D]">
            Together.
          </span>
        </h2>

        <p className="mt-6 text-sm leading-7 text-slate-300">
          Share your entrepreneurial interest and proposed
          center location. Our team can discuss the
          franchise opportunity, territory check and
          agreement details with you.
        </p>

        <div className="mt-9 space-y-5">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#E7C77D]">
              <Phone size={20} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                FRANCHISE ENQUIRIES
              </p>
              <a
                href={`tel:${PHONE}`}
                className="mt-1 block font-bold text-white hover:text-[#E7C77D]"
              >
                {DISPLAY_PHONE}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#E7C77D]">
              <Mail size={20} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                EMAIL
              </p>
              <a
                href={`mailto:${EMAIL}`}
                className="mt-1 break-all text-sm font-semibold text-white hover:text-[#E7C77D]"
              >
                {EMAIL}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#E7C77D]">
              <MapPin size={20} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                ANKVIDHYA MAIN BRANCH
              </p>
              <p className="mt-1 text-sm leading-6 text-white">
                C/326/327, Monarch Gaurav Path,
                Pal Gam, Surat, Gujarat 395009
              </p>
            </div>
          </div>
        </div>

        <div className="mt-9 rounded-2xl border border-[#E7C77D]/20 bg-white/5 p-5">

          <p className="text-xs font-bold uppercase tracking-wider text-[#E7C77D]">
            YOUR NEXT STEP
          </p>

          <p className="mt-3 text-sm font-semibold leading-7 text-white">
            Enquire. Discuss your city. Review the agreement.
            Launch your center.
          </p>

        </div>
      </div>

      {/* FORM */}
      <div className="rounded-3xl bg-white p-5 shadow-2xl shadow-black/10 sm:p-8 lg:p-9">

        <div className="mb-7">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#DB1D2D]">
            FRANCHISE BUSINESS OPPORTUNITY
          </p>

          <h3 className="mt-2 text-2xl font-extrabold text-[#182131]">
            Franchise Enquiry Form
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Please provide your details to begin a discussion
            with Team Ankvidhya.
          </p>
        </div>

        {success && (
          <div
            role="status"
            className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="shrink-0 text-green-700" size={24} />

              <h4 className="font-bold text-green-800">
                Franchise enquiry submitted!
              </h4>
            </div>

            <p className="mt-2 text-sm leading-6 text-green-800">
              Thank you for your interest in becoming an
              Ankvidhya franchise partner. Our team can
              review your enquiry and contact you.
            </p>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Honeypot */}
          <div
            className="absolute -left-[10000px] h-px w-px overflow-hidden"
            aria-hidden="true"
          >
            <label htmlFor="websiteTrap">Leave empty</label>
            <input
              id="websiteTrap"
              name="websiteTrap"
              value={form.websiteTrap}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* APPLICANT */}
          <div>
            <h4 className="text-sm font-extrabold text-[#182131]">
              01. Applicant Details
            </h4>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Applicant Full Name *
                </label>
                <input
                  name="applicantName"
                  value={form.applicantName}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  maxLength={20}
                  placeholder="+91 XXXXX XXXXX"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* CENTER PROPOSAL */}
          <div>
            <h4 className="text-sm font-extrabold text-[#182131]">
              02. Proposed Center
            </h4>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Proposed Center Name
                </label>
                <input
                  name="proposedCenterName"
                  value={form.proposedCenterName}
                  onChange={handleChange}
                  maxLength={180}
                  placeholder="Your proposed Ankvidhya center name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Proposed City *
                </label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  placeholder="Enter city"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  State *
                </label>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  placeholder="Enter state"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Proposed Location / Full Address
                </label>
                <textarea
                  name="fullAddress"
                  value={form.fullAddress}
                  onChange={handleChange}
                  rows={3}
                  maxLength={1000}
                  placeholder="Area, locality, landmark and address"
                  className={`${inputClass} min-h-24 resize-y`}
                />
              </div>

            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* BUSINESS READINESS */}
          <div>
            <h4 className="text-sm font-extrabold text-[#182131]">
              03. Business Readiness
            </h4>

            <div className="mt-4 space-y-4">

              <div>
                <label className={labelClass}>
                  Do You Have Suitable Premises?
                </label>

                <select
                  name="premisesAvailable"
                  value={form.premisesAvailable}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select an option</option>
                  <option value="yes">Yes, premises are available</option>
                  <option value="no">No, premises not yet identified</option>
                  <option value="under_consideration">
                    Currently exploring locations
                  </option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Education / Business Experience
                </label>

                <textarea
                  name="educationExperience"
                  value={form.educationExperience}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell us about your education, business or management experience."
                  className={`${inputClass} min-h-24 resize-y`}
                  maxLength={1500}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Investment Capacity
                </label>

                <select
                  name="investmentCapacity"
                  value={form.investmentCapacity}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select investment capacity</option>
                  <option value="below_6_lakh">Below ₹6 lakh</option>
                  <option value="6_to_10_lakh">₹6 lakh – ₹10 lakh</option>
                  <option value="10_to_15_lakh">₹10 lakh – ₹15 lakh</option>
                  <option value="15_to_25_lakh">₹15 lakh – ₹25 lakh</option>
                  <option value="above_25_lakh">Above ₹25 lakh</option>
                  <option value="prefer_discussion">
                    Prefer to discuss
                  </option>
                </select>

                <p className="mt-2 text-[11px] text-slate-400">
                  For preliminary discussion only. Total setup
                  cost depends on your premises and local expenses.
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  Expected Start Date
                </label>

                <input
                  type="date"
                  name="expectedStartDate"
                  value={form.expectedStartDate}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 10)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Additional Message
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  maxLength={2000}
                  placeholder="Any questions or information you would like to share?"
                  className={`${inputClass} min-h-28 resize-y`}
                />
              </div>

            </div>
          </div>

          {/* CONSENT */}
          <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-[#F5F6F8] p-4">

            <input
              type="checkbox"
              name="consent"
              checked={form.consent}
              onChange={handleChange}
              required
              className="mt-1 h-4 w-4 shrink-0 accent-[#DB1D2D]"
            />

            <span className="text-xs leading-6 text-slate-600">
              I agree that Ankvidhya may contact me using
              the details provided regarding this franchise
              enquiry and related partnership discussions.
            </span>

          </label>

          <button
            type="submit"
            disabled={submitting}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#DB1D2D] px-6 py-4 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Submitting Enquiry...
              </>
            ) : (
              <>
                Submit Franchise Enquiry
                <Send size={17} />
              </>
            )}
          </button>

          <p className="text-center text-[10px] leading-5 text-slate-400">
            This form is an enquiry only. It does not create a
            franchise agreement or guarantee approval.
          </p>

        </form>
      </div>
    </div>
  );
}

// =====================================================
// ACADEMIC PROGRAM CARD
// =====================================================

function ProgramCard({ program }) {
  const Icon = program.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${program.color}`}>
        <Icon size={24} />
      </div>

      <div className="mt-5">
        <h3 className="text-xl font-extrabold text-[#182131]">
          {program.name}
        </h3>

        <p className="mt-1 text-xs font-semibold text-[#DB1D2D]">
          {program.subtitle}
        </p>

        <span className="mt-3 inline-flex rounded-full bg-[#F5F6F8] px-3 py-1.5 text-[10px] font-bold text-slate-600">
          {program.grades}
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-500">
        {program.description}
      </p>

      <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
        {program.features.map((feature) => (
          <Bullet key={feature}>{feature}</Bullet>
        ))}
      </div>

    </div>
  );
}

// =====================================================
// MAIN CENTER / FRANCHISE PAGE
// =====================================================

export default function Center() {
  return (
    <div className="overflow-hidden bg-white">
      <SEO title="Ankvidhya Center Franchise Opportunity" description="Explore the Ankvidhya mathematics learning center franchise opportunity, academic programs, investment terms and partner support." path="/center" />

      {/* =================================================
          01. HERO
      ================================================= */}

      <section className="relative overflow-hidden bg-[#182131]">

        <div className="pointer-events-none absolute -right-28 -top-20 h-96 w-96 rounded-full border border-[#E7C77D]/20 sm:h-[600px] sm:w-[600px]" />

        <div className="pointer-events-none absolute right-0 top-32 h-80 w-80 rounded-full bg-[#DB1D2D]/15 blur-[90px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2">

          <div>

            <Eyebrow light>
              FRANCHISE BUSINESS OPPORTUNITY
            </Eyebrow>

            <h1 className="mt-7 text-[42px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-[68px]">

              Own an
              <span className="block text-[#E7C77D]">
                Ankvidhya
              </span>
              Center.

            </h1>

            <p className="mt-6 text-xl font-bold text-white sm:text-2xl">
              Build Your Education Business.
            </p>

            <p className="mt-2 text-lg font-bold text-[#E7C77D]">
              Create Math Geniuses.
            </p>

            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              An opportunity to build your own mathematics
              learning center with an established academic
              brand and a complete learning ecosystem.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#franchise-inquiry"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#DB1D2D] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Explore Franchise Opportunity
                <ArrowUpRight size={17} />
              </a>

              <a
                href="#investment"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-[#182131]"
              >
                View Investment
                <ArrowRight size={17} />
              </a>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C6A35A] text-[#182131]">
                <IndianRupee size={24} />
              </div>

              <div>
                <p className="text-lg font-extrabold text-white">
                  ZERO ROYALTY
                </p>
                <p className="text-xs text-slate-400">
                  No percentage-based tuition revenue sharing.
                </p>
              </div>
            </div>

          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-lg">

            <div className="grid grid-cols-2 gap-3 sm:gap-4">

              {[
                ["04", "ACADEMIC PROGRAMS"],
                ["LKG–10", "GRADES COVERED"],
                ["₹2.5L", "INITIAL STUDENT KIT INVENTORY"],
                ["3 YEARS", "INITIAL TERM"],
              ].map(([value, label], index) => (
                <div
                  key={label}
                  className={`flex min-h-36 flex-col justify-between rounded-2xl border p-5 sm:min-h-40 sm:p-6 ${
                    index === 1 || index === 2
                      ? "border-[#DB1D2D]/40 bg-[#DB1D2D]"
                      : "border-white/15 bg-white/10"
                  }`}
                >
                  <p className="text-3xl font-extrabold text-white sm:text-4xl">
                    {value}
                  </p>

                  <p className="text-[10px] font-bold leading-5 tracking-wider text-white/75">
                    {label}
                  </p>
                </div>
              ))}

            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-[#E7C77D]/30 bg-white p-3 text-center">
              <ResponsiveImage image={SITE_IMAGES.center.building} objectFit="contain" className="mx-auto h-36 w-full max-w-md" sizes="(max-width: 640px) 85vw, 420px" />
              <p className="mt-2 text-xs font-extrabold text-[#182131]">Your Center. Your Business.</p>
              <p className="mt-1 text-[10px] font-bold text-[#DB1D2D]">ILLUSTRATIVE CENTER CONCEPT</p>
            </div>

          </div>

        </div>
      </section>

      {/* =================================================
          02. BUSINESS OPPORTUNITY
      ================================================= */}

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="THE BUSINESS OPPORTUNITY"
            title="An Opportunity to Build a Business"
            highlight="That Builds Minds."
            description="An Ankvidhya Center lets you meet the demand for structured Mathematics learning as the owner of your own education business, backed by an academic system rather than starting from a blank page."
          />

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">

            {[
              {
                number: "01",
                title: "Own Your Business",
                description:
                  "Become an independent education entrepreneur with your own Ankvidhya Center. Your team, admissions and local presence.",
              },
              {
                number: "02",
                title: "Keep Your Revenue",
                description:
                  "No royalty and no percentage-based revenue sharing on your center's collected tuition revenue.",
              },
              {
                number: "03",
                title: "Grow With Ankvidhya",
                description:
                  "Academic ecosystem, learning kits, online faculty training and monthly academic monitoring.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="border-t-2 border-[#C6A35A] bg-[#F9FAFB] p-6 sm:p-8"
              >
                <p className="text-xs font-extrabold text-[#C6A35A]">
                  {item.number}
                </p>

                <h3 className="mt-5 text-xl font-extrabold text-[#182131]">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}

          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">

            {[
              "Your own education business",
              "An established mathematics brand",
              "Four academic programs",
              "Structured curriculum and methodology",
              "Online faculty training",
              "Monthly academic monitoring",
              "₹2.5 lakh student kits within the fee",
              "100% of tuition revenue retained",
              "Your own local educational presence",
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-slate-100 p-4"
              >
                <span className="text-xs font-extrabold text-[#C6A35A]">
                  {index + 1}.
                </span>

                <p className="text-xs font-semibold leading-5 text-slate-600">
                  {item}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* =================================================
          03. ACADEMIC ECOSYSTEM
      ================================================= */}

      <section className="bg-[#F5F6F8] px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="THE ANKVIDHYA ACADEMIC ECOSYSTEM"
            title="Four Programs."
            highlight="One Integrated System."
            description="A complete Mathematics pathway from LKG to Grade 10, with different programs designed to work together."
          />

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {academicPrograms.map((program) => (
              <ProgramCard
                key={program.name}
                program={program}
              />
            ))}

          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2">
              <ResponsiveImage image={SITE_IMAGES.center.abacusStudent} objectFit="cover" className="h-52 w-full rounded-xl" sizes="(max-width: 640px) 90vw, 45vw" />
              <p className="px-3 pb-2 pt-3 text-xs font-bold text-[#182131]">Abacus-based learning</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2">
              <ResponsiveImage image={SITE_IMAGES.center.readingStudent} objectFit="cover" className="h-52 w-full rounded-xl" sizes="(max-width: 640px) 90vw, 45vw" />
              <p className="px-3 pb-2 pt-3 text-xs font-bold text-[#182131]">Reading and mathematical practice</p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">

            <h3 className="text-lg font-extrabold text-[#182131]">
              Grade Coverage at Your Center
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Program availability as presented in the franchise brochure.
            </p>

            <div className="mt-7 space-y-5">

              {[
                {
                  name: "Ank Aryabhatta",
                  grades: "LKG – Grade 9",
                  width: "90%",
                  color: "bg-[#182131]",
                },
                {
                  name: "Ank Ramanuj",
                  grades: "Grades 1–9",
                  width: "80%",
                  color: "bg-blue-700",
                },
                {
                  name: "Ank Nachiketa",
                  grades: "Grades 1–10",
                  width: "100%",
                  color: "bg-[#DB1D2D]",
                },
                {
                  name: "Ank Kautilya",
                  grades: "Grades 4–9",
                  width: "55%",
                  color: "bg-[#C6A35A]",
                },
              ].map((program) => (
                <div key={program.name}>

                  <div className="mb-2 flex flex-wrap justify-between gap-2">
                    <p className="text-sm font-bold text-[#182131]">
                      {program.name}
                    </p>

                    <p className="text-xs font-semibold text-slate-500">
                      {program.grades}
                    </p>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${program.color}`}
                      style={{ width: program.width }}
                    />
                  </div>

                </div>
              ))}

            </div>
          </div>

        </div>
      </section>

      {/* =================================================
          04. LEARNING METHODOLOGY
      ================================================= */}

      <section className="bg-[#182131] px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="OUR UNIQUE LEARNING METHODOLOGY"
            title="Designed Around"
            highlight="How Children Learn."
            description="Different yet interconnected programs are integrated into the same learning journey, helping students build speed, understanding and wisdom together."
            light
          />

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {[
              [Layers3, "Integrated Learning", "Abacus, conceptual and Vedic Mathematics in one learning ecosystem."],
              [HeartHandshake, "Mathematics with Jivan Vidhya", "Calculation excellence connected to clarity, discipline and balanced thinking."],
              [Brain, "Multi-Dimensional Learning", "Focused segments designed around the attention span of young learners."],
              [ChartNoAxesCombined, "Grade-Wise Progression", "Structured monthly and annual progression aligned with school curriculum."],
              [Users, "Maximum 20 Students per Batch", "Personal attention for every child's progress and conceptual clarity."],
              [Target, "Focused Outcomes", "Concentration, calculation speed, conceptual clarity and logical thinking."],
            ].map(([Icon, title, description], index) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 sm:p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DB1D2D] text-white">
                  <Icon size={23} />
                </div>

                <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-[#E7C77D]">
                  0{index + 1}
                </p>

                <h3 className="mt-2 text-lg font-extrabold text-white">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {description}
                </p>
              </div>
            ))}

          </div>

          {/* Course duration and timetable */}
          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">

            <div className="rounded-2xl bg-white p-6 sm:p-8">

              <Eyebrow>
                COURSE DURATION
              </Eyebrow>

              <div className="mt-6 space-y-4">

                {[
                  ["Ank Ramanuj", "Grades 1–9", "Yearly"],
                  ["Ank Nachiketa", "Grades 1–10", "24 Lectures"],
                  ["Ank Kautilya", "Grades 4–9", "Yearly"],
                  ["Ank Aryabhatta", "LKG – Grade 2 · 10 levels", "3.5 Years"],
                  ["Ank Aryabhatta", "Grades 3–9 · 8 levels", "2.5 Years"],
                ].map(([name, grades, duration], index) => (
                  <div
                    key={`${name}-${index}`}
                    className="grid grid-cols-[1fr_1fr_auto] items-center gap-2 border-b border-slate-100 pb-3"
                  >
                    <p className="text-xs font-bold text-[#182131]">
                      {name}
                    </p>

                    <p className="text-[10px] leading-5 text-slate-500 sm:text-xs">
                      {grades}
                    </p>

                    <p className="text-xs font-bold text-[#DB1D2D]">
                      {duration}
                    </p>
                  </div>
                ))}

              </div>

              <p className="mt-5 text-xs text-slate-400">
                Students receive a Certificate of Completion
                after every level or course.
              </p>

            </div>

            <div className="rounded-2xl bg-white p-6 sm:p-8">

              <Eyebrow>
                WEEKLY CLASS SCHEDULE
              </Eyebrow>

              <div className="mt-6 space-y-8">

                {schedules.map((schedule) => (
                  <div key={schedule.grades}>

                    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                      <p className="text-sm font-extrabold text-[#182131]">
                        {schedule.grades}
                      </p>

                      <p className="text-xs text-slate-500">
                        {schedule.frequency}
                      </p>
                    </div>

                    <div className="mt-4 flex min-h-16 overflow-hidden rounded-xl">

                      {schedule.sessions.map((session, index) => (
                        <div
                          key={session.name}
                          className={`flex min-w-0 flex-col justify-center p-2.5 text-white ${
                            index === 0
                              ? "bg-[#182131]"
                              : index === 1
                              ? "bg-blue-700"
                              : "bg-[#C6A35A] text-[#182131]"
                          }`}
                          style={{
                            width: `${session.percent}%`,
                          }}
                        >
                          <p className="text-[10px] font-bold">
                            {session.time}
                          </p>

                          <p className="mt-1 text-[9px] font-semibold leading-4">
                            {session.name}
                          </p>
                        </div>
                      ))}

                    </div>
                  </div>
                ))}

              </div>

              <p className="mt-5 text-xs text-slate-400">
                Session durations as stated in the franchise brochure.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =================================================
          05. FRANCHISE BUSINESS MODEL
      ================================================= */}

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="THE FRANCHISE BUSINESS MODEL"
            title="Your Center."
            highlight="Your Business. Powered by Ankvidhya."
            description="A defined partnership: you own and operate your center, while Ankvidhya provides the academic ecosystem, methodology and support."
          />

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {businessSteps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="rounded-2xl border border-slate-200 bg-[#F9FAFB] p-6"
                >

                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-[#DB1D2D]/30">
                      {step.number}
                    </span>

                    <Icon size={24} className="text-[#C6A35A]" />
                  </div>

                  <h3 className="mt-6 text-lg font-extrabold text-[#182131]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {step.description}
                  </p>

                </div>
              );
            })}

          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">

            <div className="rounded-2xl bg-[#182131] p-7 text-white sm:p-9">

              <Eyebrow light>
                YOU · FRANCHISE OWNER & OPERATOR
              </Eyebrow>

              <h3 className="mt-5 text-2xl font-extrabold">
                You Run the Business.
              </h3>

              <div className="mt-7 space-y-4">
                {[
                  "Own and operate your Ankvidhya Center",
                  "Arrange the required infrastructure",
                  "Recruit and manage your faculty and staff",
                  "Manage daily center operations",
                  "Conduct local marketing and generate admissions",
                  "Handle parent communication and fee collection",
                  "Execute programs using the prescribed methodology",
                ].map((item) => (
                  <Bullet key={item} light>
                    {item}
                  </Bullet>
                ))}
              </div>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-[#F9FAFB] p-7 sm:p-9">

              <Eyebrow>
                ANKVIDHYA · ACADEMIC BRAND PARTNER
              </Eyebrow>

              <h3 className="mt-5 text-2xl font-extrabold text-[#182131]">
                We Power the Academics.
              </h3>

              <div className="mt-7 space-y-4">
                {[
                  "Right to operate under the Ankvidhya brand, subject to agreement",
                  "Four academic programs and structured curriculum",
                  "Initial student learning kit inventory worth ₹2,50,000",
                  "Online faculty training",
                  "Academic methodology and teaching framework",
                  "Assessment and evaluation framework",
                  "Monthly academic monitoring and agreed guidance",
                ].map((item) => (
                  <Bullet key={item}>
                    {item}
                  </Bullet>
                ))}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =================================================
          06. FRANCHISE INVESTMENT
      ================================================= */}

      <section
        id="investment"
        className="scroll-mt-20 bg-[#F5F6F8] px-5 py-16 sm:px-8 sm:py-24"
      >

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="FRANCHISE INVESTMENT"
            title="One Partnership."
            highlight="Three Years. A Complete Academic Ecosystem."
            description="The brochure outlines a one-time franchise brand fee with an initial student learning kit inventory included."
          />

          {/* Investment highlight */}
          <div className="mt-12 overflow-hidden rounded-3xl bg-[#182131]">

            <div className="grid items-center gap-7 p-6 sm:p-10 lg:grid-cols-[1fr_auto_1fr]">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E7C77D]">
                  ONE-TIME FRANCHISE BRAND FEE
                </p>

                <p className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">
                  ₹5,00,000
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  Initial brand fee
                </p>
              </div>

              <div className="flex items-center justify-center">
                <span className="text-4xl font-light text-white/40">+</span>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E7C77D]">
                  GST @ 18%
                </p>

                <p className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">
                  ₹90,000
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  Applicable GST
                </p>
              </div>

            </div>

            <div className="border-t border-white/10 bg-[#DB1D2D] px-6 py-7 text-center sm:px-10">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                TOTAL INITIAL PAYMENT
              </p>

              <h3 className="mt-2 text-5xl font-extrabold text-white sm:text-6xl">
                ₹5,90,000
              </h3>

              <p className="mt-3 text-xs text-white/85">
                Five lakh ninety thousand rupees including 18% GST.
              </p>

            </div>

          </div>

          {/* Terms */}
          <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">

            {[
              [CalendarDays, "3 Years", "Initial franchise term"],
              [Wallet, "100% Advance", "No instalments"],
              [MapPin, "Non-Exclusive", "Subject to 3 km center spacing policy"],
              [ShieldCheck, "Zero Royalty", "No percentage-based tuition revenue sharing"],
            ].map(([Icon, value, label]) => (
              <div
                key={value}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <Icon size={22} className="text-[#DB1D2D]" />

                <h4 className="mt-5 text-lg font-extrabold text-[#182131]">
                  {value}
                </h4>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {label}
                </p>
              </div>
            ))}

          </div>

          {/* Kit inclusion and renewal */}
          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">

              <Eyebrow>
                INCLUDED WITHIN BRAND FEE
              </Eyebrow>

              <p className="mt-5 text-4xl font-extrabold text-[#182131]">
                ₹2,50,000
              </p>

              <h3 className="mt-2 text-lg font-extrabold text-[#DB1D2D]">
                Initial Student Kit Inventory
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-500">
                Initial learning kit inventory is included in
                the ₹5 lakh brand fee. It is not an additional
                payment. The number of kits depends on the
                grade-wise mix selected.
              </p>

              <p className="mt-5 text-xs font-semibold text-slate-500">
                Additional kits are purchased at applicable
                standard-wise rates, plus applicable taxes.
              </p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">

              <Eyebrow>
                AFTER THREE YEARS · RENEWAL
              </Eyebrow>

              <div className="mt-5 space-y-4">

                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <p className="text-sm text-slate-500">Renewal Fee</p>
                  <p className="font-bold text-[#182131]">₹75,000</p>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <p className="text-sm text-slate-500">GST @ 18%</p>
                  <p className="font-bold text-[#182131]">₹13,500</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-[#182131]">Total Renewal Payment</p>
                  <p className="text-xl font-extrabold text-[#DB1D2D]">₹88,500</p>
                </div>

              </div>

              <p className="mt-5 text-xs leading-6 text-slate-500">
                Renewal applies after completion of the
                initial three-year period, subject to the
                franchise renewal agreement.
              </p>

            </div>

          </div>

          {/* Indicative tuition */}
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">

            <Eyebrow>
              INDICATIVE YEARLY TUITION
            </Eyebrow>

            <h3 className="mt-4 text-2xl font-extrabold text-[#182131]">
              You Decide Your Fees.
            </h3>

            <p className="mt-2 text-sm leading-7 text-slate-500">
              The following are indicative annual tuition
              figures from the brochure's existing fee reference.
              Each center sets its own tuition fees based on
              its city and local market.
            </p>

            <div className="mt-7 overflow-hidden rounded-xl border border-slate-200">

              <div className="grid grid-cols-[1fr_auto] bg-[#182131] px-4 py-4 text-xs font-bold text-white">
                <span>Grade Category</span>
                <span>Indicative Yearly Tuition</span>
              </div>

              {[
                ["LKG – UKG", "₹14,000"],
                ["Grades 1–3", "₹15,500"],
                ["Grades 4–9", "₹17,000"],
              ].map(([grade, price]) => (
                <div
                  key={grade}
                  className="grid grid-cols-[1fr_auto] items-center border-t border-slate-100 px-4 py-4"
                >
                  <span className="text-sm font-semibold text-[#182131]">
                    {grade}
                  </span>

                  <span className="text-sm font-extrabold text-[#DB1D2D]">
                    {price}
                  </span>
                </div>
              ))}

            </div>

            <p className="mt-4 text-xs leading-6 text-slate-400">
              Indicative only. Student learning kits are
              charged separately at applicable standard-wise
              rates. Admissions, earnings and returns are not
              guaranteed. Actual results depend on location,
              execution and local demand.
            </p>

          </div>

          {/* Important commercial clarification */}
          <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-7">

            <div className="flex items-start gap-3">
              <CircleHelp className="mt-0.5 shrink-0 text-amber-700" />

              <div>
                <h3 className="font-extrabold text-amber-900">
                  Important Investment Clarifications
                </h3>

                <div className="mt-4 space-y-3">

                  <p className="text-xs leading-6 text-amber-900">
                    <strong>Territory:</strong> The franchise
                    territory is non-exclusive. There are no
                    automatic exclusive city or district rights.
                    Ankvidhya states that it does not provide
                    another Ankvidhya Center within a 3 km radius
                    of an existing center.
                  </p>

                  <p className="text-xs leading-6 text-amber-900">
                    <strong>Your operating expenses:</strong>
                    Premises, infrastructure, fit-out, furniture,
                    utilities, staff salaries, local marketing
                    and daily operating expenses are borne by
                    the franchise owner and are not included
                    in the brand fee.
                  </p>

                  <p className="text-xs leading-6 text-amber-900">
                    <strong>Revenue is not profit:</strong>
                    Zero royalty means no percentage-based
                    tuition revenue sharing. The retained tuition
                    revenue must still fund operating expenses,
                    taxes and other business costs.
                  </p>

                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =================================================
          07. INFRASTRUCTURE
      ================================================= */}

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="INFRASTRUCTURE REQUIREMENTS"
            title="A Professional Space"
            highlight="Built for Learning."
            description="As the franchise owner, you arrange a comfortable, well-organised center to deliver the Ankvidhya learning experience."
          />

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {infrastructure.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-[#F9FAFB] p-5"
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#182131] text-[#E7C77D]">
                    <Icon size={21} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-[#C6A35A]">
                      0{index + 1}
                    </p>

                    <h3 className="mt-1 text-sm font-extrabold text-[#182131]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </div>

                </div>
              );
            })}

          </div>

          <div className="mt-9 rounded-2xl bg-[#182131] p-6 text-white sm:p-8">

            <Eyebrow light>
              ALSO ARRANGED BY YOU
            </Eyebrow>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

              {[
                "Premises, fit-out and furniture",
                "Electricity, utilities and maintenance",
                "Center Head / Counsellor and faculty",
                "Local branding and marketing",
              ].map((item) => (
                <Bullet key={item} light>
                  {item}
                </Bullet>
              ))}

            </div>

            <p className="mt-7 border-t border-white/10 pt-5 text-xs leading-6 text-slate-400">
              Infrastructure and setup costs vary by city,
              locality and the premises chosen. They are not
              part of the franchise brand fee. The proposed
              location is reviewed against the 3 km radius policy.
            </p>

          </div>

        </div>
      </section>

      {/* =================================================
          08. ANKVIDHYA SUPPORT SYSTEM
      ================================================= */}

      <section className="bg-[#F5F6F8] px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="THE ANKVIDHYA SUPPORT SYSTEM"
            title="You Run the Business."
            highlight="We Support the Academic Excellence."
            description="A defined academic support framework helps your team deliver Ankvidhya programs while you focus on managing your center."
          />

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {supportItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >

                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-[#DB1D2D]/25">
                      {item.number}
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#DB1D2D]">
                      <Icon size={22} />
                    </div>
                  </div>

                  <h3 className="mt-5 text-lg font-extrabold text-[#182131]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {item.description}
                  </p>

                </div>
              );
            })}

          </div>

          <div className="mt-9 rounded-2xl bg-[#182131] p-6 text-white sm:p-8">

            <h3 className="text-xl font-extrabold">
              Monthly Academic Monitoring
            </h3>

            <p className="mt-2 text-sm leading-7 text-slate-300">
              Team Ankvidhya works with your center to review
              program implementation, maintain academic
              standards, guide faculty on methodology and
              support classroom quality.
            </p>

            <p className="mt-5 border-t border-white/10 pt-5 text-xs leading-6 text-[#E7C77D]">
              Faculty training is delivered online. Your
              center recruits and manages its own teachers.
              Academic monitoring does not replace day-to-day
              center management.
            </p>

          </div>

        </div>
      </section>

      {/* =================================================
          09. STUDENT LEARNING KIT
      ================================================= */}

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="THE STUDENT LEARNING KIT"
            title="A Complete Learning Kit"
            highlight="for Every Student."
            description="Every Ankvidhya student receives a branded kit that supports structured learning and practice."
          />

          <div className="mt-10 rounded-2xl bg-[#182131] p-7 text-center sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E7C77D]">
              INITIAL INVENTORY INCLUDED IN BRAND FEE
            </p>

            <p className="mt-4 text-5xl font-extrabold text-white sm:text-6xl">
              ₹2,50,000
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Student learning kit inventory valued at
              ₹2.5 lakh is included within the ₹5 lakh
              franchise brand fee.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-[0.8fr_1.2fr] sm:items-center">
            <ResponsiveImage image={SITE_IMAGES.center.backpack} objectFit="contain" className="mx-auto h-64 w-full max-w-[250px] rounded-2xl bg-[#F5F6F8]" sizes="(max-width: 640px) 70vw, 250px" />
            <div className="rounded-2xl bg-[#F5F6F8] p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#DB1D2D]">STUDENT EXPERIENCE</p>
              <h3 className="mt-3 text-xl font-extrabold text-[#182131]">A branded learning journey</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">The center supports students with structured learning resources, practice materials and a consistent Ankvidhya learning experience.</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">

            {[
              {
                title: "LKG to Grade 3",
                count: "12 Components",
                items: kitComponents.junior,
              },
              {
                title: "Grades 4 to 9",
                count: "13 Components",
                items: kitComponents.senior,
              },
            ].map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-slate-200 bg-[#F9FAFB] p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-extrabold text-[#182131]">
                    {group.title}
                  </h3>

                  <span className="rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-bold text-[#DB1D2D]">
                    {group.count}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {group.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2
                        size={15}
                        className="mt-0.5 shrink-0 text-[#DB1D2D]"
                      />

                      <span className="text-xs font-medium leading-5 text-slate-600">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">

            <h3 className="text-lg font-extrabold text-[#182131]">
              Standard-Wise Kit Prices
            </h3>

            <div className="mt-5 space-y-3">
              {kitPrices.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-sm font-semibold text-slate-600">
                    {item.category}
                  </span>

                  <span className="text-sm font-extrabold text-[#DB1D2D]">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-5 text-xs leading-6 text-slate-400">
              Additional kits beyond the included inventory
              are purchased at these applicable rates plus
              applicable taxes.
            </p>

          </div>

        </div>
      </section>

      {/* =================================================
          10. ZERO ROYALTY ADVANTAGE
      ================================================= */}

      <section className="bg-[#182131] px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

            <div>

              <Eyebrow light>
                THE ZERO-ROYALTY ADVANTAGE
              </Eyebrow>

              <h2 className="mt-7 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
                Your Growth.
                <span className="block text-[#E7C77D]">
                  Your Revenue.
                </span>
                Zero Royalty.
              </h2>

              <p className="mt-6 text-base leading-8 text-slate-300">
                Keep 100% of your center's collected tuition
                revenue. Ankvidhya does not charge a monthly
                royalty, annual royalty or percentage-based
                revenue share on tuition fees.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "No monthly royalty",
                  "No annual royalty",
                  "No percentage-based revenue sharing",
                  "No recurring tuition commission",
                ].map((item) => (
                  <Bullet key={item} light>
                    {item}
                  </Bullet>
                ))}
              </div>

            </div>

            <div className="rounded-3xl border border-[#E7C77D]/30 bg-white p-6 sm:p-9">

              <div className="text-center">

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C6A35A]">
                  TUITION REVENUE FLOW
                </p>

                <p className="mt-7 text-6xl font-extrabold text-[#182131] sm:text-7xl">
                  100%
                </p>

                <p className="mt-2 font-bold text-[#182131]">
                  Tuition Revenue Retained
                </p>

                <div className="mt-8 h-4 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-full rounded-full bg-[#DB1D2D]" />
                </div>

                <div className="mt-7 flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-sm text-slate-500">
                    Your center retains
                  </span>

                  <strong className="text-lg text-[#182131]">
                    100%
                  </strong>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Royalty / revenue share
                  </span>

                  <strong className="text-lg text-[#DB1D2D]">
                    0%
                  </strong>
                </div>

              </div>

              <div className="mt-7 rounded-xl bg-amber-50 p-4">
                <p className="text-xs leading-6 text-amber-900">
                  Retained revenue is not profit. It funds
                  rent, staff salaries, utilities, local
                  marketing, kit purchases, taxes and other
                  operating costs.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =================================================
          11. BECOME A PARTNER
      ================================================= */}

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="BECOME AN ANKVIDHYA FRANCHISE PARTNER"
            title="Let's Build the Future"
            highlight="of Mathematics, Together."
            description="Bring Ankvidhya to your city and become part of an academic ecosystem that aims to develop confident, logical and mathematically empowered learners."
          />

          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">

            {[
              ["01", "Enquire", "Express your interest in the franchise opportunity."],
              ["02", "Discuss Your City", "Share your proposed location for the 3 km radius check."],
              ["03", "Review the Agreement", "Review the franchise agreement and terms in detail."],
              ["04", "Launch Your Center", "Set up, train your team online and open admissions."],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-2xl border border-slate-200 bg-[#F9FAFB] p-5 sm:p-6"
              >
                <p className="text-3xl font-extrabold text-[#DB1D2D]/30">
                  {number}
                </p>

                <h3 className="mt-5 text-base font-extrabold text-[#182131]">
                  {title}
                </h3>

                <p className="mt-3 text-xs leading-6 text-slate-500">
                  {description}
                </p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* =================================================
          12. FINAL CTA
      ================================================= */}

      <section className="bg-[#DB1D2D] px-5 py-16 text-center sm:px-8 sm:py-20">

        <div className="mx-auto max-w-4xl">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">
            YOUR ENTREPRENEURIAL JOURNEY STARTS HERE
          </p>

          <h2 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-6xl">
            Create Math Geniuses.
            <span className="block text-[#FFE09A]">
              Build Your Education Business.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
            Let's discuss your city, your vision and the
            opportunity to establish an Ankvidhya learning center.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

            <a
              href="#franchise-inquiry"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-extrabold text-[#182131] transition hover:bg-[#182131] hover:text-white"
            >
              Apply for Franchise Enquiry
              <ArrowUpRight size={17} />
            </a>

            <a
              href={`tel:${PHONE}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/50 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <Phone size={17} />
              Call Our Team
            </a>

          </div>

        </div>
      </section>

      {/* =================================================
          13. FRANCHISE INQUIRY FORM
      ================================================= */}

      <section
        id="franchise-inquiry"
        className="scroll-mt-16 bg-[#182131] px-5 py-16 sm:px-8 sm:py-24"
      >

        <div className="mx-auto max-w-7xl">
          <FranchiseInquiryForm />
        </div>

      </section>

      {/* =================================================
          14. LEGAL DISCLAIMER
      ================================================= */}

      <section className="bg-[#F5F6F8] px-5 py-8 sm:px-8">

        <div className="mx-auto flex max-w-7xl items-start gap-3">

          <CircleHelp
            size={18}
            className="mt-0.5 shrink-0 text-slate-500"
          />

          <p className="text-[10px] leading-6 text-slate-500">
            This page presents information from the Ankvidhya
            Franchise Business Opportunity brochure. It is for
            information purposes only and does not constitute
            a franchise agreement or an offer. All commercial
            terms are subject to the final franchise agreement.
            GST is shown at 18% on the brand fee and renewal fee.
            Ankvidhya does not guarantee admissions, revenue,
            profitability or return on investment. The franchise
            territory is non-exclusive.
          </p>

        </div>

      </section>

    </div>
  );
}
