
import { useState } from "react";

import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calculator,
  Brain,
  Target,
  Lightbulb,
  Heart,
  GraduationCap,
  PackageCheck,
  ClipboardCheck,
  ChartNoAxesCombined,
  CalendarDays,
  CheckCircle2,
  Phone,
  Mail,
  Send,
  Award,
  FileCheck2,
  Layers3,
} from "lucide-react";

import { supabase } from "../lib/supabaseClient";
import ResponsiveImage from "../components/ResponsiveImage";
import SEO from "../components/SEO";
import { SITE_IMAGES } from "../data/siteImages";

// =====================================================
// BRAND CONFIGURATION
// =====================================================

const PHONE_NUMBER = "+916357785778";
const DISPLAY_PHONE = "+91 63 5778 5778";

// =====================================================
// CURRICULUM: 17 TOPICS
// Based on School Partnership Brochure - Page 3
// =====================================================

const curriculumTopics = [
  { number: "01", title: "Numbers", symbol: "123" },
  { number: "02", title: "Derivatives of Numbers", symbol: "n′" },
  { number: "03", title: "Addition", symbol: "+" },
  { number: "04", title: "Multiplication", symbol: "×" },
  { number: "05", title: "Subtraction", symbol: "−" },
  { number: "06", title: "Division", symbol: "÷" },
  { number: "07", title: "Squares", symbol: "x²" },
  { number: "08", title: "Square Roots", symbol: "√x" },
  { number: "09", title: "Cube", symbol: "x³" },
  { number: "10", title: "Cube Roots", symbol: "∛x" },
  { number: "11", title: "Reverse Multiplication", symbol: "↶×" },
  { number: "12", title: "Percentage", symbol: "%" },
  { number: "13", title: "Magic of Numbers", symbol: "✦" },
  { number: "14", title: "Calendar", symbol: "31" },
  { number: "15", title: "Magic Squares", symbol: "□" },
  { number: "16", title: "Logical Reasoning", symbol: "∴" },
  {
    number: "17",
    title: "Concept Application in Competitive Exams",
    symbol: "★",
    featured: true,
  },
];

// =====================================================
// CURRICULUM STAGES
// Based on School Partnership Brochure - Page 5
// =====================================================

const stages = [
  {
    stage: "STAGE 01",
    grades: "1–3",
    title: "Building the Foundation",
    theme: "bg-blue-600",
    topics: [
      "Sense of Numbers",
      "Addition",
      "Subtraction",
      "Tables",
      "Division",
    ],
  },
  {
    stage: "STAGE 02",
    grades: "4–6",
    title: "Strengthening Techniques",
    theme: "bg-[#254DAE]",
    topics: [
      "Magic of 9",
      "Derivatives",
      "Addition",
      "Multiplication",
      "Division",
    ],
  },
  {
    stage: "STAGE 03",
    grades: "7–9",
    title: "Advancing Mastery",
    theme: "bg-[#182131]",
    topics: [
      "Derivatives",
      "Multiplication",
      "Division",
      "Calendar",
      "Reverse Calculation",
    ],
  },
];

// =====================================================
// FOUR DIMENSIONS OF LEARNING
// =====================================================

const learningDimensions = [
  {
    icon: Calculator,
    title: "Mathematical Abilities",
    description:
      "Number sense, speed and accuracy, built step by step.",
  },
  {
    icon: Lightbulb,
    title: "Conceptual Understanding",
    description:
      'Understand the "why" behind every method, not just the "how".',
  },
  {
    icon: Brain,
    title: "Calculation Techniques",
    description:
      "Simplified methods that save time and build confidence.",
  },
  {
    icon: Heart,
    title: "Life Education",
    description:
      "Perseverance, discipline and critical thinking, learnt through Mathematics.",
  },
];

// =====================================================
// IMPLEMENTATION MODEL
// Based on School Partnership Brochure - Page 6
// =====================================================

const implementationSteps = [
  {
    number: "01",
    icon: PackageCheck,
    title: "Learning Kit for Every Student",
    description:
      "Ankvidhya provides a structured student learning kit containing the educational resources required to implement the Ank Ramanujan program.",
  },
  {
    number: "02",
    icon: GraduationCap,
    title: "Training for School Faculty",
    description:
      "Team Ankvidhya trains your own teachers in the methodology and content needed to deliver Ank Ramanujan lectures effectively.",
  },
  {
    number: "03",
    icon: ChartNoAxesCombined,
    title: "Regular Academic Monitoring",
    description:
      "Team Ankvidhya regularly monitors project execution, guides your faculty and supports consistent implementation.",
  },
];

// =====================================================
// STUDENT KIT CONTENT
// Based on School Partnership Brochure - Page 7
// =====================================================

const learningKit = [
  {
    icon: BookOpen,
    title: "Practice Books",
    description: "Structured mathematical practice.",
  },
  {
    icon: GraduationCap,
    title: "Ank Ramanujan Textbook",
    description: "Core academic learning material.",
  },
  {
    icon: Calculator,
    title: "IMO Olympiad Workbook",
    description: "Additional mathematics practice.",
  },
  {
    icon: Layers3,
    title: "Flash Cards",
    description: "Learning through play.",
  },
  {
    icon: Brain,
    title: "Board Games",
    description: "Jeevan Chaupat, Snakes & Ladders and Ludo.",
  },
  {
    icon: FileCheck2,
    title: "Mobile App Card",
    description: "Mobile application user guide.",
  },
  {
    icon: Target,
    title: "Dream Chart",
    description: "Goals and progress.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Habit Tracker",
    description: "Daily habits and consistency.",
  },
  {
    icon: Heart,
    title: "Welcome Letter",
    description: "A message from the founder.",
  },
];

// =====================================================
// SCHOOL IMPLEMENTATION JOURNEY
// Based on School Partnership Brochure - Page 8
// =====================================================

const executionSteps = [
  {
    number: "01",
    title: "Confirm the Partnership",
    description:
      "School management completes the Order Confirmation Form to formalise the partnership.",
  },
  {
    number: "02",
    title: "Plan the Schedule",
    description:
      "The school identifies its Ank Ramanujan faculty and timetable slots. A minimum of 20 days' notice is required after signing, before execution begins.",
  },
  {
    number: "03",
    title: "Train & Equip",
    description:
      "Team Ankvidhya trains the school's faculty and student learning kits are delivered.",
  },
  {
    number: "04",
    title: "Teach in the Classroom",
    description:
      "School faculty deliver Ank Ramanujan lectures as per the timetable, with regular monitoring and guidance.",
  },
  {
    number: "05",
    title: "Assess Online",
    description:
      "Each student receives a unique user ID and password for Ankvidhya's test software. End-of-semester exams are mandatory.",
  },
  {
    number: "06",
    title: "Graphical Reports",
    description:
      "After every exam, Team Ankvidhya provides a graphical performance report for each student.",
  },
  {
    number: "07",
    title: "Certification",
    description:
      "At the end of the year, every student receives a certificate along with the school report card or mark sheet.",
  },
];

// =====================================================
// SMALL REUSABLE COMPONENTS
// =====================================================

function Eyebrow({ children, light = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-[2px] w-7 shrink-0 bg-[#DB1D2D]" />

      <span
        className={`text-[10px] font-extrabold uppercase tracking-[0.19em] ${
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
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
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

// =====================================================
// FORM INPUT STYLES
// =====================================================

const inputClass =
  "w-full min-h-12 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#182131] outline-none transition placeholder:text-slate-400 focus:border-[#DB1D2D] focus:ring-4 focus:ring-red-50";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700";

// =====================================================
// INITIAL FORM VALUES
// =====================================================

const initialForm = {
  schoolName: "",
  contactName: "",
  designation: "",
  phone: "",
  email: "",
  website: "",
  schoolType: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  studentStrength: "",
  partnershipModel: "Ank Ramanujan School Partnership",
  proposedStartDate: "",
  message: "",
  consent: false,
  websiteTrap: "",
};

// =====================================================
// SCHOOL PARTNERSHIP INQUIRY FORM
// =====================================================

function SchoolInquiryForm() {
  const [form, setForm] = useState(initialForm);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

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

    // Basic client-side validation.
    if (!form.schoolName.trim()) {
      setError("Please enter your school name.");
      return;
    }

    if (!form.contactName.trim()) {
      setError("Please enter the contact person's name.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Please enter your contact number.");
      return;
    }

    if (!form.city.trim() || !form.state.trim()) {
      setError("Please enter your school location.");
      return;
    }

    if (!form.consent) {
      setError("Please agree to be contacted by Ankvidhya.");
      return;
    }

    // Honeypot field to catch simple automated submissions.
    if (form.websiteTrap.trim()) {
      setError("Unable to submit this request.");
      return;
    }

    const phoneDigits = form.phone.replace(/\D/g, "");

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setError("Please enter a valid contact number.");
      return;
    }

    if (
      form.studentStrength &&
      (!Number.isInteger(Number(form.studentStrength)) ||
        Number(form.studentStrength) < 0)
    ) {
      setError("Please enter a valid student strength.");
      return;
    }

    setSubmitting(true);

    try {
      // Public submissions create a central CRM lead.
      // School-specific information is stored in custom_fields.
      // The school_partnerships record is created by staff
      // after the lead is reviewed and qualified.

      const payload = {
        full_name: form.contactName.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim(),
        inquiry_type: "school_partnership",
        organization_name: form.schoolName.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: "India",
        message: form.message.trim() || null,

        consent_to_contact: true,

        custom_fields: {
          form_name: "School Partnership Inquiry",
          designation: form.designation.trim(),
          school_website: form.website.trim(),
          school_type: form.schoolType,
          school_address: form.address.trim(),
          pincode: form.pincode.trim(),
          student_strength: form.studentStrength
            ? Number(form.studentStrength)
            : null,
          partnership_model: form.partnershipModel,
          proposed_start_date: form.proposedStartDate || null,
        },
      };

      // Do not chain .select() here.
      // Anonymous visitors have INSERT permission on leads,
      // but intentionally do not have SELECT permission.

      const { error: insertError } = await supabase
        .from("leads")
        .insert(payload);

      if (insertError) {
        throw insertError;
      }

      setForm(initialForm);
      setSuccess(true);

    } catch (err) {
      console.error("School inquiry submission error:", err);

      setError(
        "We could not submit your enquiry. Please try again or contact our team by phone."
      );

    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">

      {/* FORM INTRODUCTION */}
      <div className="lg:sticky lg:top-28 lg:self-start">

        <Eyebrow light>
          CONNECT WITH TEAM ANKVIDHYA
        </Eyebrow>

        <h2 className="mt-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          Bring the Ankvidhya Advantage
          <span className="block text-[#E7C77D]">
            to Your School.
          </span>
        </h2>

        <p className="mt-6 text-sm leading-7 text-slate-300">
          Tell us a little about your school. Our team can
          connect with you to discuss the Ank Ramanujan
          School Partnership Program.
        </p>

        <div className="mt-9 space-y-5">

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#E7C77D]">
              <Phone size={19} />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400">
                CALL OUR TEAM
              </p>

              <a
                href={`tel:${PHONE_NUMBER}`}
                className="mt-1 inline-block text-base font-bold text-white hover:text-[#E7C77D]"
              >
                {DISPLAY_PHONE}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#E7C77D]">
              <Mail size={19} />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400">
                SCHOOL PARTNERSHIP
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                Share your school details through this form.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-9 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#E7C77D]">
            OUR PARTNERSHIP PROMISE
          </p>

          <p className="mt-3 text-sm font-semibold leading-7 text-white">
            Empowering Schools to Deliver Excellence Through
            Their Own Faculty, Backed by Ankvidhya's
            Academic Expertise.
          </p>
        </div>

      </div>

      {/* FORM */}
      <div className="rounded-3xl bg-white p-5 shadow-2xl shadow-black/10 sm:p-8 lg:p-9">

        <div className="mb-7">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#DB1D2D]">
            SCHOOL PARTNERSHIP PROGRAM
          </p>

          <h3 className="mt-2 text-2xl font-extrabold text-[#182131]">
            School Inquiry Form
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Fields marked with * are required.
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
                Your school enquiry has been submitted!
              </h4>
            </div>

            <p className="mt-2 text-sm leading-6 text-green-800">
              Thank you for your interest in Ankvidhya.
              Our team can review your request and contact
              you using the details provided.
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

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Hidden honeypot */}
          <div
            className="absolute -left-[10000px] h-px w-px overflow-hidden"
            aria-hidden="true"
          >
            <label htmlFor="websiteTrap">
              Leave this field empty
            </label>

            <input
              id="websiteTrap"
              name="websiteTrap"
              tabIndex={-1}
              autoComplete="off"
              value={form.websiteTrap}
              onChange={handleChange}
            />
          </div>

          {/* SCHOOL DETAILS */}
          <div>

            <h4 className="text-sm font-extrabold text-[#182131]">
              01. School Information
            </h4>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div className="sm:col-span-2">
                <label className={labelClass}>
                  School Name *
                </label>

                <input
                  name="schoolName"
                  value={form.schoolName}
                  onChange={handleChange}
                  placeholder="Enter school / institution name"
                  className={inputClass}
                  required
                  maxLength={180}
                />
              </div>

              <div>
                <label className={labelClass}>
                  School Type
                </label>

                <select
                  name="schoolType"
                  value={form.schoolType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select school type</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="State Board">State Board</option>
                  <option value="International">International</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Student Strength
                </label>

                <input
                  type="number"
                  name="studentStrength"
                  value={form.studentStrength}
                  onChange={handleChange}
                  placeholder="Approximate number"
                  min="0"
                  step="1"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>
                  School Website
                </label>

                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://www.example.com"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>
                  School Address
                </label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Full school address"
                  className={`${inputClass} min-h-24 resize-y`}
                />
              </div>

            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* CONTACT DETAILS */}
          <div>

            <h4 className="text-sm font-extrabold text-[#182131]">
              02. Contact Person
            </h4>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div>
                <label className={labelClass}>
                  Contact Person Name *
                </label>

                <input
                  name="contactName"
                  value={form.contactName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={inputClass}
                  required
                  maxLength={150}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Designation
                </label>

                <input
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  placeholder="Principal / Director / Owner"
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
                  placeholder="+91 XXXXX XXXXX"
                  className={inputClass}
                  required
                  maxLength={20}
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
                  placeholder="name@school.com"
                  className={inputClass}
                />
              </div>

            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* LOCATION */}
          <div>

            <h4 className="text-sm font-extrabold text-[#182131]">
              03. School Location
            </h4>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">

              <div>
                <label className={labelClass}>
                  City *
                </label>

                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className={inputClass}
                  required
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
                  placeholder="State"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Pincode
                </label>

                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  className={inputClass}
                  inputMode="numeric"
                  maxLength={10}
                />
              </div>

            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* PARTNERSHIP REQUIREMENTS */}
          <div>

            <h4 className="text-sm font-extrabold text-[#182131]">
              04. Partnership Requirements
            </h4>

            <div className="mt-4 space-y-4">

              <div>
                <label className={labelClass}>
                  Area of Interest
                </label>

                <select
                  name="partnershipModel"
                  value={form.partnershipModel}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Ank Ramanujan School Partnership">
                    Ank Ramanujan School Partnership
                  </option>

                  <option value="Faculty Training and Academic Support">
                    Faculty Training & Academic Support
                  </option>

                  <option value="Student Learning Kits and Curriculum">
                    Student Learning Kits & Curriculum
                  </option>

                  <option value="Complete School Implementation">
                    Complete School Implementation
                  </option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Proposed Start Date
                </label>

                <input
                  type="date"
                  name="proposedStartDate"
                  value={form.proposedStartDate}
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
                  placeholder="Tell us about your school's requirements or questions..."
                  className={`${inputClass} min-h-28 resize-y`}
                  maxLength={2000}
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
              I agree that Ankvidhya may contact me regarding
              this school partnership enquiry using the contact
              details provided above.
            </span>

          </label>

          {/* SUBMIT */}
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
                Submit School Enquiry
                <Send size={17} />
              </>
            )}

          </button>

          <p className="text-center text-[10px] leading-5 text-slate-400">
            Your enquiry will be submitted to the Ankvidhya
            school partnership team.
          </p>

        </form>
      </div>
    </div>
  );
}

// =====================================================
// MAIN SCHOOL PARTNERSHIP PAGE
// =====================================================

export default function SchoolPartnership() {
  return (
    <div className="overflow-hidden bg-[#F5F6F8]">
      <SEO title="School Partnership Program" description="Bring the Ankvidhya Ank Ramanujan Mathematics Learning System to your school with student kits, faculty training and academic monitoring." path="/school-partnership" />

      {/* =================================================
          01. HERO
      ================================================= */}

      <section className="relative overflow-hidden bg-[#182131]">

        <div className="pointer-events-none absolute -right-24 -top-20 h-96 w-96 rounded-full border border-[#E7C77D]/15 sm:h-[650px] sm:w-[650px]" />

        <div className="pointer-events-none absolute -right-12 top-20 h-72 w-72 rounded-full border border-white/10 sm:h-[480px] sm:w-[480px]" />

        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#DB1D2D]/15 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-12">

          <div>

            <Eyebrow light>
              ANK RAMANUJAN · SCHOOL PARTNERSHIP PROGRAM
            </Eyebrow>

            <h1 className="mt-7 text-[42px] font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-[66px]">

              Bring the
              <span className="block text-[#E7C77D]">
                Ankvidhya
              </span>
              Advantage.

            </h1>

            <h2 className="mt-6 text-xl font-bold leading-snug text-white sm:text-2xl">
              Transforming the Way Your Students Learn Mathematics.
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              A complete Mathematics Learning System.
              Empowering Schools. Enriching Teachers.
              Creating Math Geniuses.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <a
                href="#school-inquiry"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#DB1D2D] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Become a Partner
                <ArrowUpRight size={17} />
              </a>

              <a
                href="#curriculum"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-[#182131]"
              >
                Explore Curriculum
                <ArrowRight size={17} />
              </a>

            </div>

            <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3 text-xs font-semibold text-slate-300">

              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#E7C77D]" />
                Grades 1–9
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#E7C77D]" />
                Delivered by Your Faculty
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#E7C77D]" />
                Backed by Ankvidhya
              </span>

            </div>
          </div>

          {/* Illustrative classroom visual */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="overflow-hidden rounded-3xl border border-white/15 bg-white p-2 shadow-2xl">
              <ResponsiveImage
                image={SITE_IMAGES.schoolPartnership.classroomIllustration}
                priority
                objectFit="cover"
                className="h-[280px] w-full rounded-2xl sm:h-[390px]"
                sizes="(max-width: 1024px) 90vw, 48vw"
              />
              <div className="flex items-center justify-between gap-3 px-3 py-4 sm:px-5">
                <div>
                  <p className="text-sm font-extrabold text-[#182131]">Learning through guided practice</p>
                  <p className="mt-1 text-xs text-slate-500">An illustrative classroom visual</p>
                </div>
                <span className="rounded-full bg-red-50 px-3 py-2 text-[10px] font-bold text-[#DB1D2D]">ANK RAMANUJAN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom hero points */}
        <div className="border-t border-white/10 bg-white/[0.04]">

          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">

            {[
              ["Student Learning Kit", "For every student", PackageCheck],
              ["Faculty Training", "For your own teachers", GraduationCap],
              ["Academic Monitoring", "Throughout the year", ChartNoAxesCombined],
            ].map(([title, description, Icon]) => (
              <div
                key={title}
                className="flex items-center gap-4 py-5 sm:px-5"
              >
                <Icon size={25} className="shrink-0 text-[#E7C77D]" />

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
        </div>
      </section>

      {/* =================================================
          02. PARTNERSHIP VISION
      ================================================= */}

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="OUR PARTNERSHIP VISION"
            title="Reimagining Mathematics Education"
            highlight="Through a Powerful School Partnership."
            description="Mathematics is more than a subject to be taught. It is a way of thinking that shapes a child's ability to reason, analyse and solve problems."
          />

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">

            {[
              {
                number: "01",
                title: "A Structured Learning System",
                description:
                  "Ankvidhya brings a structured, activity-oriented and concept-driven Mathematics Learning System to schools, designed for students from Grades 1 to 9.",
              },
              {
                number: "02",
                title: "Your Own Teaching Faculty",
                description:
                  "Through student learning kits, structured faculty training and continuous academic monitoring, schools implement the system with their own teaching faculty.",
              },
              {
                number: "03",
                title: "Academic Expertise",
                description:
                  "The model combines the strength of your existing educators with Ankvidhya's academic expertise, resources and execution framework.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="border-t-2 border-[#C6A35A] bg-[#F9FAFB] p-6 sm:p-7"
              >
                <p className="text-xs font-extrabold text-[#C6A35A]">
                  {item.number}
                </p>

                <h3 className="mt-5 text-lg font-bold text-[#182131]">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}

          </div>

          <div className="mt-10 rounded-2xl bg-[#182131] px-6 py-8 sm:px-10 sm:py-10">

            <Eyebrow light>
              OUR PARTNERSHIP PROMISE
            </Eyebrow>

            <h3 className="mt-5 max-w-4xl text-2xl font-extrabold leading-snug text-white sm:text-3xl">
              Empowering Schools to Deliver Excellence
              <span className="text-[#E7C77D]"> Through Their Own Faculty,</span>
              {" "}Backed by Ankvidhya's Academic Expertise.
            </h3>

          </div>
        </div>
      </section>

      {/* =================================================
          03. INTEGRATED LEARNING SYSTEM
      ================================================= */}

      <section className="bg-[#F5F6F8] px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="ONE INTEGRATED LEARNING SYSTEM"
            title="More Than Calculations."
            highlight="A Complete Learning Experience."
            description="The Ank Ramanujan School Partnership Program brings four complementary dimensions of mathematical learning together."
            center
          />

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {learningDimensions.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#182131] text-[#E7C77D]">
                    <Icon size={23} />
                  </div>

                  <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-[#DB1D2D]">
                    0{index + 1}
                  </p>

                  <h3 className="mt-2 text-lg font-extrabold leading-snug text-[#182131]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {item.description}
                  </p>
                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* =================================================
          04. 17 TOPICS AT A GLANCE
      ================================================= */}

      <section id="curriculum" className="bg-white px-5 py-16 scroll-mt-24 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="THE ANK RAMANUJAN CURRICULUM"
            title="17 Topics."
            highlight="One Complete Journey."
            description="From the first sense of numbers to applying mathematical concepts in competitive examinations, the Ank Ramanujan program covers a carefully sequenced range of topics."
          />

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">

            {curriculumTopics.map((topic, index) => (
              <div
                key={topic.number}
                className={`relative flex min-h-32 flex-col justify-between overflow-hidden rounded-2xl border p-4 transition hover:-translate-y-1 sm:min-h-36 sm:p-5 ${
                  topic.featured
                    ? "col-span-2 border-[#C6A35A] bg-[#182131] text-white sm:col-span-3 lg:col-span-4"
                    : index % 4 === 1
                    ? "border-blue-700 bg-blue-700 text-white"
                    : index % 4 === 3
                    ? "border-[#182131] bg-[#182131] text-white"
                    : "border-slate-200 bg-[#F9FAFB] text-[#182131]"
                }`}
              >

                <div className="flex items-start justify-between gap-2">

                  <span className={`text-[10px] font-extrabold ${
                    topic.featured ? "text-[#E7C77D]" : "opacity-50"
                  }`}>
                    {topic.number}
                  </span>

                  <span className={`text-2xl font-extrabold sm:text-3xl ${
                    topic.featured ? "text-[#E7C77D]" : ""
                  }`}>
                    {topic.symbol}
                  </span>

                </div>

                <h3 className="mt-5 text-sm font-bold leading-5 sm:text-base">
                  {topic.title}
                </h3>

              </div>
            ))}

          </div>

          <div className="mt-7 rounded-xl border-l-4 border-[#C6A35A] bg-amber-50 p-5">

            <p className="text-xs leading-6 text-slate-600">
              <strong>Curriculum note:</strong> These topics are
              organised into a grade-wise curriculum, and their
              sequence may be adjusted according to the availability
              of lectures and the prevailing circumstances.
            </p>

          </div>
        </div>
      </section>

      {/* =================================================
          05. GRADE-WISE CURRICULUM
      ================================================= */}

      <section className="bg-[#F5F6F8] px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="THE CURRICULUM"
            title="Progressive Learning."
            highlight="Grade by Grade."
            description="A structured pathway from Grade 1 to Grade 9. Each stage builds on the last, helping students progress from mathematical foundations to advanced calculation and reasoning."
          />

          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">

            {stages.map((stage) => (
              <div
                key={stage.stage}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >

                <div className={`${stage.theme} p-6 text-white`}>

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                    {stage.stage}
                  </p>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-white/70">
                    GRADES
                  </p>

                  <h3 className="mt-1 text-5xl font-extrabold">
                    {stage.grades}
                  </h3>

                  <p className="mt-3 text-sm font-semibold text-[#E7C77D]">
                    {stage.title}
                  </p>

                </div>

                <div className="p-6">

                  <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#DB1D2D]">
                    CURRICULUM HIGHLIGHTS
                  </p>

                  <div className="space-y-4">

                    {stage.topics.map((topic, index) => (
                      <div
                        key={topic}
                        className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-0"
                      >

                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F5F6F8] text-[10px] font-bold text-[#C6A35A]">
                          0{index + 1}
                        </span>

                        <p className="text-sm font-semibold text-[#182131]">
                          {topic}
                        </p>

                      </div>
                    ))}

                  </div>

                  <p className="mt-4 text-xs italic text-slate-400">
                    And many more topics.
                  </p>

                </div>

              </div>
            ))}

          </div>

          <div className="mt-8 rounded-2xl bg-[#182131] p-6 text-center sm:p-8">

            <p className="text-sm leading-7 text-slate-300 sm:text-base">
              Every topic is taught through Ankvidhya's
              <span className="font-bold text-[#E7C77D]">
                {" "}activity-oriented, concept-driven approach,
              </span>
              {" "}so students build speed, accuracy and genuine
              understanding together.
            </p>

          </div>

        </div>
      </section>

      {/* =================================================
          06. IMPLEMENTATION MODEL
      ================================================= */}

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="THE IMPLEMENTATION MODEL"
            title="Your Teachers."
            highlight="Our System."
            description="A clear three-part model that lets your school deliver Ank Ramanujan through its own faculty, backed by Ankvidhya's academic expertise at every stage."
          />

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">

            {implementationSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative rounded-2xl border border-slate-200 bg-white p-6 pt-9 shadow-sm sm:p-8 sm:pt-10"
                >

                  <span className="absolute -top-4 left-6 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-[#DB1D2D] text-xs font-bold text-white shadow">
                    {step.number}
                  </span>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#182131] text-[#E7C77D]">
                    <Icon size={26} />
                  </div>

                  <h3 className="mt-7 text-xl font-extrabold leading-snug text-[#182131]">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    {step.description}
                  </p>

                  {index !== 2 && (
                    <div className="mt-7 hidden text-[#C6A35A] md:block">
                      <ArrowRight size={21} />
                    </div>
                  )}

                </div>
              );
            })}

          </div>

          {/* RESPONSIBILITY DIVISION */}
          <div className="mt-16">

            <SectionHeading
              eyebrow="A CLEAR DIVISION OF RESPONSIBILITIES"
              title="A Partnership Built"
              highlight="on Shared Strengths."
              center
            />

            <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-2">

              <div className="rounded-2xl bg-[#182131] p-6 text-white sm:p-8">

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E7C77D]">
                  ANKVIDHYA
                </p>

                <h3 className="mt-3 text-2xl font-extrabold">
                  The System, Training & Monitoring
                </h3>

                <div className="mt-7 space-y-4">

                  {[
                    "Provides student learning kits",
                    "Provides faculty training",
                    "Provides regular academic monitoring and guidance",
                  ].map((item) => (
                    <div key={item} className="flex gap-3">

                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-[#E7C77D]"
                      />

                      <p className="text-sm leading-6 text-slate-200">
                        {item}
                      </p>

                    </div>
                  ))}

                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DB1D2D]">
                  YOUR SCHOOL
                </p>

                <h3 className="mt-3 text-2xl font-extrabold text-[#182131]">
                  The Faculty & Classroom Delivery
                </h3>

                <div className="mt-7 space-y-4">

                  {[
                    "Provides its own faculty",
                    "Schedules Ank Ramanujan lectures",
                    "Ensures classroom execution",
                    "Coordinates with Team Ankvidhya",
                  ].map((item) => (
                    <div key={item} className="flex gap-3">

                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-blue-600"
                      />

                      <p className="text-sm leading-6 text-slate-600">
                        {item}
                      </p>

                    </div>
                  ))}

                </div>
              </div>

            </div>

            <p className="mt-8 text-center text-base font-semibold leading-7 text-[#182131] sm:text-lg">
              A Mathematics program owned by your school,
              delivered by your teachers and supported
              by Ankvidhya.
            </p>

          </div>

        </div>
      </section>

      {/* =================================================
          07. STUDENT LEARNING KIT
      ================================================= */}

      <section className="bg-[#182131] px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="THE STUDENT LEARNING KIT"
            title="Everything a Student Needs."
            highlight="Thoughtfully Designed."
            description="Each Ank Ramanujan kit brings together books, games and planners that make Mathematics structured, hands-on and enjoyable, in class and at home."
            light
          />

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              [SITE_IMAGES.schoolPartnership.flashcards, "Flashcard learning kit"],
              [SITE_IMAGES.schoolPartnership.jeevanChaupat, "Jeevan Chaupat educational board"],
              [SITE_IMAGES.schoolPartnership.snakesAndLadders, "Snakes and Ladders learning game"],
              [SITE_IMAGES.schoolPartnership.dreamChart, "Student dream chart"],
              [SITE_IMAGES.schoolPartnership.habitTracker, "Student habit tracker"],
              [SITE_IMAGES.schoolPartnership.welcomeLetter, "Welcome letter"],
              [SITE_IMAGES.schoolPartnership.mobileAppGuide, "Mobile app guide"],
            ].map(([image, title]) => (
              <div key={title} className="overflow-hidden rounded-2xl border border-white/10 bg-white p-2">
                <ResponsiveImage image={image} objectFit="contain" className="h-36 w-full rounded-xl sm:h-44" sizes="(max-width: 640px) 45vw, 22vw" />
                <p className="px-2 pb-2 pt-3 text-xs font-bold text-[#182131]">{title}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

            {learningKit.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 transition hover:bg-white/10 sm:p-6"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7C77D]/15 text-[#E7C77D]">
                    <Icon size={21} />
                  </div>

                  <p className="mt-5 text-[10px] font-bold text-[#E7C77D]">
                    KIT ITEM {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="mt-2 text-sm font-extrabold leading-snug text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {item.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* =================================================
          08. EXECUTION JOURNEY
      ================================================= */}

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="EXECUTION & NEXT STEPS"
            title="From Agreement"
            highlight="to Achievement."
            description="A simple, well-defined journey takes your school from the first conversation to a full academic year of measurable progress."
          />

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {executionSteps.map((step, index) => (
              <div
                key={step.number}
                className={`rounded-2xl border p-6 transition hover:shadow-lg ${
                  index === 6
                    ? "border-[#C6A35A] bg-amber-50 sm:col-span-2 lg:col-span-3"
                    : "border-slate-200 bg-[#F9FAFB]"
                }`}
              >

                <div className="flex items-center justify-between">

                  <span className="text-3xl font-extrabold text-[#DB1D2D]/30">
                    {step.number}
                  </span>

                  {index === 6 ? (
                    <Award size={25} className="text-[#C6A35A]" />
                  ) : index === 4 ? (
                    <ClipboardCheck size={23} className="text-[#DB1D2D]" />
                  ) : index === 1 ? (
                    <CalendarDays size={23} className="text-[#DB1D2D]" />
                  ) : (
                    <CheckCircle2 size={23} className="text-[#DB1D2D]" />
                  )}

                </div>

                <h3 className="mt-5 text-lg font-extrabold text-[#182131]">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {step.description}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* =================================================
          09. SCHOOL PARTNERSHIP PROMISE
      ================================================= */}

      <section className="bg-[#DB1D2D] px-5 py-16 text-center sm:px-8 sm:py-20">

        <div className="mx-auto max-w-4xl">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">
            AN INVITATION TO PARTNER
          </p>

          <h2 className="mt-6 text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            Let's Create Confident Mathematical Thinkers,
            <span className="block text-[#FFE09A]">
              Together.
            </span>
          </h2>

          <p className="mt-6 text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
            Bring the Ankvidhya advantage to your school:
            a complete Mathematics Learning System, delivered
            by your teachers and backed by our academic expertise.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

            <a
              href="#school-inquiry"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-extrabold text-[#182131] transition hover:bg-[#182131] hover:text-white"
            >
              Enquire for School Partnership
              <ArrowUpRight size={17} />
            </a>

            <a
              href={`tel:${PHONE_NUMBER}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/50 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <Phone size={17} />
              {DISPLAY_PHONE}
            </a>

          </div>

        </div>
      </section>

      {/* =================================================
          10. SCHOOL INQUIRY FORM
      ================================================= */}

      <section
        id="school-inquiry"
        className="scroll-mt-16 bg-[#182131] px-5 py-16 sm:px-8 sm:py-24"
      >

        <div className="mx-auto max-w-7xl">

          <SchoolInquiryForm />

        </div>
      </section>

    </div>
  );
}
