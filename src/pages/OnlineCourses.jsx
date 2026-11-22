
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Search,
  Clock,
  GraduationCap,
  Monitor,
  IndianRupee,
  CheckCircle2,
  Sparkles,
  Brain,
  Calculator,
  Lightbulb,
  Filter,
  X,
  Send,
  Phone,
  Target,
  RefreshCw,
} from "lucide-react";

import { supabase } from "../lib/supabaseClient";
import ResponsiveImage from "../components/ResponsiveImage";
import SEO from "../components/SEO";
import { SITE_IMAGES } from "../data/siteImages";

// =====================================================
// BRAND
// =====================================================

// =====================================================
// HELPERS
// =====================================================

function formatPrice(amount, currency = "INR") {
  if (amount === null || amount === undefined || amount === "") {
    return "Enquire for fee";
  }

  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "Enquire for fee";
  }

  if (value === 0) {
    return "Free";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: String(currency).trim() || "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getCategoryName(course) {
  const category = course.course_categories;

  if (Array.isArray(category)) {
    return category[0]?.name || "Mathematics";
  }

  return category?.name || "Mathematics";
}

function getHighlights(highlights) {
  if (!Array.isArray(highlights)) return [];

  return highlights
    .map((item) => {
      if (typeof item === "string") return item;

      return (
        item?.title ||
        item?.label ||
        item?.name ||
        ""
      );
    })
    .filter(Boolean)
    .slice(0, 4);
}

function getDeliveryLabel(mode) {
  if (mode === "online") return "Online Learning";
  if (mode === "both") return "Online & Offline";

  return "Learning Program";
}

function getAgeLabel(course) {
  // Grade range is the primary eligibility display for Ankvidhya programs.
  // Age fields remain available for future courses that use age-based eligibility.
  if (course.grade_range) {
    return course.grade_range;
  }

  if (course.age_min != null && course.age_max != null) {
    return `Ages ${course.age_min}–${course.age_max} years`;
  }

  if (course.age_min != null) {
    return `From ${course.age_min} years`;
  }

  if (course.age_max != null) {
    return `Up to ${course.age_max} years`;
  }

  return "Eligibility on enquiry";
}

// =====================================================
// REUSABLE COMPONENTS
// =====================================================

function Eyebrow({ children, light = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-[2px] w-7 bg-[#DB1D2D]" />

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
  center = false,
  light = false,
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

const inputClass =
  "w-full min-h-12 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#182131] outline-none transition placeholder:text-slate-400 focus:border-[#DB1D2D] focus:ring-4 focus:ring-red-50";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700";

// =====================================================
// COURSE ICON
// =====================================================

function CourseIcon({ title }) {
  const value = title.toLowerCase();

  let Icon = BookOpen;

  if (value.includes("abacus") || value.includes("aryabhatta")) {
    Icon = Calculator;
  } else if (value.includes("vedic") || value.includes("kautilya")) {
    Icon = Brain;
  } else if (value.includes("calculation") || value.includes("nachiketa")) {
    Icon = Lightbulb;
  }

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-[#DB1D2D]">
      <Icon size={26} />
    </div>
  );
}

// =====================================================
// COURSE CARD
// =====================================================

function getCourseImage(course) {
  const name = `${course.title || ""} ${getCategoryName(course)}`.toLowerCase();

  if (name.includes("abacus") || name.includes("aryabhatta")) {
    return SITE_IMAGES.onlineCourses.abacusStudent;
  }

  if (name.includes("vedic") || name.includes("kautilya")) {
    return SITE_IMAGES.onlineCourses.thinkingStudent;
  }

  return SITE_IMAGES.onlineCourses.brain;
}

function CourseCard({ course, onEnquire }) {
  const highlights = getHighlights(course.highlights);
  const courseImage = getCourseImage(course);

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
        course.is_featured
          ? "border-[#C6A35A]/60"
          : "border-slate-200"
      }`}
    >

      <div className="h-1.5 bg-gradient-to-r from-[#182131] via-[#DB1D2D] to-[#C6A35A]" />

      <ResponsiveImage
        image={courseImage}
        objectFit="cover"
        className="h-44 w-full bg-[#F5F6F8] object-top"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      <div className="flex flex-1 flex-col p-6 sm:p-7">

        <div className="flex items-start justify-between gap-3">

          <CourseIcon title={course.title} />

          {course.is_featured && (
            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold text-amber-700">
              FEATURED
            </span>
          )}

        </div>

        <div className="mt-6">

          <p className="text-[10px] font-bold uppercase tracking-wider text-[#DB1D2D]">
            {getCategoryName(course)}
          </p>

          <h3 className="mt-2 text-xl font-extrabold leading-snug text-[#182131]">
            {course.title}
          </h3>

          <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
            {course.short_description ||
              course.description ||
              "Explore this Ankvidhya learning program."}
          </p>

        </div>

        {/* Course metadata */}
        <div className="mt-6 space-y-3 border-y border-slate-100 py-5">

          <div className="flex items-center gap-3">
            <GraduationCap size={17} className="shrink-0 text-[#C6A35A]" />
            <span className="text-xs font-semibold text-slate-600">
              {getAgeLabel(course)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Clock size={17} className="shrink-0 text-[#C6A35A]" />
            <span className="text-xs font-semibold text-slate-600">
              {course.duration_label || "Duration on enquiry"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Monitor size={17} className="shrink-0 text-[#C6A35A]" />
            <span className="text-xs font-semibold text-slate-600">
              {getDeliveryLabel(course.delivery_mode)}
            </span>
          </div>

        </div>

        {/* Highlights */}
        {highlights.length > 0 && (
          <div className="mt-5 space-y-3">

            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              WHAT YOU WILL EXPLORE
            </p>

            {highlights.map((highlight) => (
              <div key={highlight} className="flex items-start gap-2">
                <CheckCircle2
                  size={15}
                  className="mt-0.5 shrink-0 text-[#DB1D2D]"
                />

                <span className="text-xs leading-5 text-slate-600">
                  {highlight}
                </span>
              </div>
            ))}

          </div>
        )}

        {/* Price and CTA */}
        <div className="mt-auto pt-7">

          <div className="flex items-center justify-between gap-2">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                COURSE FEE
              </p>

              <p className="mt-1 text-lg font-extrabold text-[#182131]">
                {formatPrice(course.fee_amount, course.currency)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onEnquire(course)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#182131] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#DB1D2D]"
            >
              Enquire Now
              <ArrowUpRight size={15} />
            </button>

          </div>

        </div>
      </div>
    </article>
  );
}

// =====================================================
// EMPTY STATE
// =====================================================

function EmptyCourses({ onReset, hasFilter }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#DB1D2D]">
        <BookOpen size={30} />
      </div>

      <h3 className="mt-6 text-xl font-extrabold text-[#182131]">
        {hasFilter ? "No matching courses found" : "Courses Coming Soon"}
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
        {hasFilter
          ? "Try another search term or category."
          : "Our online course listings are being prepared. Please contact us to discuss available learning opportunities."}
      </p>

      {hasFilter && (
        <button
          type="button"
          onClick={onReset}
          className="mt-6 rounded-xl bg-[#DB1D2D] px-5 py-3 text-sm font-bold text-white"
        >
          Clear Filters
        </button>
      )}

      {!hasFilter && (
        <Link
          to="/contact"
          className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#182131] px-5 py-3 text-sm font-bold text-white"
        >
          Contact Ankvidhya
          <ArrowRight size={16} />
        </Link>
      )}

    </div>
  );
}

// =====================================================
// COURSE INQUIRY FORM
// =====================================================

const initialForm = {
  studentName: "",
  parentName: "",
  phone: "",
  email: "",
  age: "",
  grade: "",
  city: "",
  state: "",
  message: "",
  consent: false,
  websiteTrap: "",
};

function CourseInquiryForm({ course, onClose }) {
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
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (form.websiteTrap.trim()) {
      setError("Unable to submit this request.");
      return;
    }

    if (!course?.id) {
      setError("Please select a valid course.");
      return;
    }

    if (!form.studentName.trim() || !form.parentName.trim()) {
      setError("Please enter the student and parent/guardian names.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Please enter your contact number.");
      return;
    }

    const phoneDigits = form.phone.replace(/\D/g, "");

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setError("Please enter a valid contact number.");
      return;
    }

    if (
      form.age &&
      (!Number.isInteger(Number(form.age)) ||
        Number(form.age) < 1 ||
        Number(form.age) > 100)
    ) {
      setError("Please enter a valid student age.");
      return;
    }

    if (!form.consent) {
      setError("Please agree to be contacted by Ankvidhya.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        // CRM contact person is the parent/guardian.
        full_name: form.parentName.trim(),

        email: form.email.trim() || null,
        phone: form.phone.trim(),

        inquiry_type: "online_course",

        // Connect the lead to the selected published course.
        course_id: course.id,

        organization_name: null,
        city: form.city.trim() || null,
        state: form.state.trim() || null,
        country: "India",

        message: form.message.trim() || null,
        consent_to_contact: true,

        custom_fields: {
          form_name: "Online Course Inquiry",
          student_name: form.studentName.trim(),
          parent_guardian_name: form.parentName.trim(),
          student_age: form.age ? Number(form.age) : null,
          student_grade: form.grade.trim() || null,
          course_title: course.title,
          preferred_delivery_mode: "online",
        },
      };

      // Anonymous users can INSERT website leads.
      // Do not add .select(): public visitors cannot read CRM records.

      const { error: insertError } = await supabase
        .from("leads")
        .insert(payload);

      if (insertError) {
        throw insertError;
      }

      setSuccess(true);
      setForm(initialForm);

    } catch (err) {
      console.error("Online course inquiry error:", err);

      setError(
        "Unable to submit your enquiry. Please try again or contact our team."
      );

    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-8">

      <div className="flex items-start justify-between gap-3">

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#DB1D2D]">
            COURSE ENQUIRY
          </p>

          <h3 className="mt-2 text-xl font-extrabold text-[#182131]">
            Enquire About This Course
          </h3>

          <p className="mt-2 text-sm font-semibold text-[#DB1D2D]">
            {course.title}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          aria-label="Close course enquiry"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-[#DB1D2D]"
        >
          <X size={19} />
        </button>

      </div>

      {success && (
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">

          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-700" size={24} />

            <h4 className="font-bold text-green-800">
              Enquiry submitted successfully!
            </h4>
          </div>

          <p className="mt-2 text-sm leading-6 text-green-800">
            Thank you for your interest in {course.title}.
            Your enquiry has been sent to the Ankvidhya team.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-4 rounded-lg bg-green-700 px-4 py-2.5 text-xs font-bold text-white"
          >
            Done
          </button>

        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
        >
          {error}
        </div>
      )}

      {!success && (
        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-5"
        >

          {/* Honeypot */}
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
              value={form.websiteTrap}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Student */}
          <div>
            <label className={labelClass}>
              Student Full Name *
            </label>

            <input
              name="studentName"
              value={form.studentName}
              onChange={handleChange}
              required
              maxLength={150}
              placeholder="Enter student name"
              className={inputClass}
            />
          </div>

          {/* Parent */}
          <div>
            <label className={labelClass}>
              Parent / Guardian Name *
            </label>

            <input
              name="parentName"
              value={form.parentName}
              onChange={handleChange}
              required
              maxLength={150}
              placeholder="Enter parent or guardian name"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>
              <label className={labelClass}>
                Student Age
              </label>

              <input
                type="number"
                name="age"
                min="1"
                max="100"
                value={form.age}
                onChange={handleChange}
                placeholder="Age in years"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Current Grade / Class
              </label>

              <input
                name="grade"
                value={form.grade}
                onChange={handleChange}
                placeholder="e.g. Grade 4"
                className={inputClass}
              />
            </div>

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>
              <label className={labelClass}>
                City
              </label>

              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Your city"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                State
              </label>

              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Your state"
                className={inputClass}
              />
            </div>

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
              placeholder="Tell us about your learning goals or questions..."
              className={`${inputClass} min-h-28 resize-y`}
            />
          </div>

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
              this course enquiry using the details provided.
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
                Submit Course Enquiry
                <Send size={17} />
              </>
            )}

          </button>

          <p className="text-center text-[10px] leading-5 text-slate-400">
            Your enquiry is securely submitted to the
            Ankvidhya team for follow-up.
          </p>

        </form>
      )}

    </div>
  );
}

// =====================================================
// MAIN ONLINE COURSES PAGE
// =====================================================

export default function OnlineCourses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [selectedCourse, setSelectedCourse] = useState(null);

  const inquiryRef = useRef(null);

  // ---------------------------------------------------
  // FETCH PUBLIC COURSES AND CATEGORIES FROM SUPABASE
  // ---------------------------------------------------

  useEffect(() => {
    let active = true;

    async function loadCourses() {
      setLoading(true);
      setError("");

      try {
        const [
          categoriesResult,
          coursesResult,
        ] = await Promise.all([

          supabase
            .from("course_categories")
            .select("id, name, slug, description, display_order")
            .eq("is_active", true)
            .order("display_order", { ascending: true }),

          supabase
            .from("courses")
            .select(`
              id,
              category_id,
              title,
              slug,
              short_description,
              description,
              delivery_mode,
              grade_range,
              age_min,
              age_max,
              duration_label,
              fee_amount,
              currency,
              highlights,
              syllabus,
              is_featured,
              display_order,
              course_categories(name, slug)
            `)
            .eq("is_published", true)
            .in("delivery_mode", ["online", "both"])
            .order("is_featured", { ascending: false })
            .order("display_order", { ascending: true }),

        ]);

        if (categoriesResult.error) {
          throw categoriesResult.error;
        }

        if (coursesResult.error) {
          throw coursesResult.error;
        }

        if (!active) return;

        setCategories(categoriesResult.data || []);
        setCourses(coursesResult.data || []);

      } catch (err) {
        console.error("Online courses loading error:", err);

        if (active) {
          setError(
            "Unable to load courses at the moment. Please refresh the page or contact us."
          );
        }

      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      active = false;
    };
  }, [refreshKey]);

  // ---------------------------------------------------
  // FILTER COURSES
  // ---------------------------------------------------

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {

      const matchesCategory =
        selectedCategory === "all" ||
        course.category_id === selectedCategory;

      const matchesSearch =
        !query ||
        [
          course.title,
          course.short_description,
          course.description,
          getCategoryName(course),
        ]
          .filter(Boolean)
          .some((value) =>
            value.toLowerCase().includes(query)
          );

      return matchesCategory && matchesSearch;
    });
  }, [courses, search, selectedCategory]);

  // ---------------------------------------------------
  // ENQUIRY OPEN
  // ---------------------------------------------------

  function handleEnquire(course) {
    setSelectedCourse(course);

    window.setTimeout(() => {
      inquiryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  function clearFilters() {
    setSearch("");
    setSelectedCategory("all");
  }

  return (
    <div className="overflow-hidden bg-white">
      <SEO title="Online Mathematics Courses" description="Explore Ankvidhya online mathematics learning programs. Discover published courses, age groups, course details and submit a course enquiry." path="/online-courses" />

      {/* =================================================
          01. HERO
      ================================================= */}

      <section className="relative overflow-hidden bg-[#182131]">

        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10 sm:h-[600px] sm:w-[600px]" />

        <div className="pointer-events-none absolute -bottom-36 -left-32 h-96 w-96 rounded-full bg-[#DB1D2D]/15 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2">

          <div>

            <Eyebrow light>
              EXPLORE ANKVIDHYA PROGRAMS
            </Eyebrow>

            <h1 className="mt-7 text-[42px] font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-[66px]">

              Discover the
              <span className="block text-[#E7C77D]">
                Joy of
              </span>
              Mathematics.

            </h1>

            <p className="mt-6 text-xl font-bold text-[#F04452]">
              Learn. Calculate. Understand. Grow.
            </p>

            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              Explore Ankvidhya's learning opportunities.
              Discover programs, understand their learning
              objectives and enquire about the right
              course for your child.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <a
                href="#available-courses"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#DB1D2D] px-6 py-3.5 text-sm font-bold text-white hover:bg-red-700"
              >
                Explore Courses
                <ArrowRight size={17} />
              </a>

              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-[#182131]"
              >
                Talk to Our Team
                <ArrowUpRight size={17} />
              </Link>

            </div>
          </div>

          {/* Visual */}
          <div className="mx-auto w-full max-w-lg">

            <div className="overflow-hidden rounded-3xl border border-white/15 bg-white p-2 shadow-2xl">
              <ResponsiveImage image={SITE_IMAGES.onlineCourses.abacusStudent} priority objectFit="cover" className="h-[280px] w-full rounded-2xl object-top sm:h-[360px]" sizes="(max-width: 1024px) 90vw, 42vw" />
              <div className="px-4 py-3 text-center">
                <p className="text-sm font-extrabold text-[#182131]">Learn. Calculate. Understand. Grow.</p>
                <p className="mt-1 text-[10px] font-semibold text-slate-500">ANKVIDHYA MATHEMATICS LEARNING</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">

              {[
                [Calculator, "Abacus", "Speed & Accuracy"],
                [Brain, "Mathematics", "Conceptual Clarity"],
                [Lightbulb, "Vedic-Inspired", "Logical Techniques"],
                [BookOpen, "Foundation", "Academic Learning"],
              ].map(([Icon, title, description], index) => (
                <div
                  key={title}
                  className={`rounded-2xl border p-5 sm:p-7 ${
                    index === 1 || index === 2
                      ? "border-[#DB1D2D]/30 bg-[#DB1D2D]"
                      : "border-white/10 bg-white/10"
                  }`}
                >

                  <Icon
                    size={29}
                    className="text-[#E7C77D]"
                  />

                  <h3 className="mt-6 text-base font-extrabold text-white sm:text-lg">
                    {title}
                  </h3>

                  <p className="mt-2 text-xs text-white/70">
                    {description}
                  </p>

                </div>
              ))}

            </div>

            <div className="mt-4 rounded-2xl border border-[#E7C77D]/30 bg-[#25334B] p-5 text-center">

              <Sparkles
                size={24}
                className="mx-auto text-[#E7C77D]"
              />

              <p className="mt-3 text-lg font-extrabold text-white">
                Making Math Genius
              </p>

              <p className="mt-1 text-xs text-slate-300">
                The Ankvidhya Learning Approach
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          02. INTRODUCTION
      ================================================= */}

      <section className="bg-[#F5F6F8] px-5 py-16 sm:px-8 sm:py-20">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="LEARNING WITH ANKVIDHYA"
            title="Mathematics Beyond"
            highlight="Numbers."
            description="Ankvidhya integrates Abacus, conceptual Mathematics, Vedic-inspired calculation techniques and Jivan Vidhya. Explore the courses currently published for online learning."
            center
          />

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">

            {[
              [Brain, "Stronger Thinking", "Build mathematical reasoning and conceptual understanding."],
              [Target, "Calculation Skills", "Develop calculation speed, accuracy and confidence."],
              [GraduationCap, "Structured Learning", "Progress through course levels and academic milestones."],
            ].map(([Icon, title, description]) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#DB1D2D]">
                  <Icon size={23} />
                </div>

                <h3 className="mt-5 font-extrabold text-[#182131]">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {description}
                </p>

              </div>
            ))}

          </div>

          <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_180px] sm:items-center sm:p-5">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#DB1D2D]">LEARNING THAT ENGAGES</p>
              <h3 className="mt-2 text-lg font-extrabold text-[#182131]">Build skills through guided practice.</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">Browse the courses currently published by Ankvidhya and enquire about the program that fits your learner.</p>
            </div>
            <ResponsiveImage image={SITE_IMAGES.onlineCourses.thinkingStudent} objectFit="cover" className="h-36 w-full rounded-xl sm:h-40" sizes="(max-width: 640px) 100vw, 180px" />
          </div>
        </div>
      </section>

      {/* =================================================
          03. DATABASE-DRIVEN COURSES
      ================================================= */}

      <section
        id="available-courses"
        className="scroll-mt-20 bg-white px-5 py-16 sm:px-8 sm:py-24"
      >

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>
              <Eyebrow>
                COURSE CATALOGUE
              </Eyebrow>

              <h2 className="mt-5 text-3xl font-extrabold text-[#182131] sm:text-4xl">
                Explore Our Courses
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
                Browse published online learning programs
                and select the course you would like
                to enquire about.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setRefreshKey((value) => value + 1)}
              disabled={loading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh Courses
            </button>

          </div>

          {/* Search */}
          <div className="mt-9 grid gap-3 sm:grid-cols-[1fr_auto]">

            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search courses, subjects or categories..."
                className={`${inputClass} pl-11`}
              />

            </div>

            <div className="flex items-center gap-2 rounded-xl bg-[#F5F6F8] px-4 py-3">
              <Filter size={16} className="text-[#C6A35A]" />

              <span className="text-xs font-bold text-slate-600">
                {loading
                  ? "Loading..."
                  : `${filteredCourses.length} Courses`}
              </span>
            </div>

          </div>

          {/* Categories */}
          {!loading && categories.length > 0 && (
            <div className="mt-5 flex gap-2 overflow-x-auto pb-2">

              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`min-h-10 shrink-0 rounded-full px-5 py-2 text-xs font-bold transition ${
                  selectedCategory === "all"
                    ? "bg-[#182131] text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-[#DB1D2D]"
                }`}
              >
                All Courses
              </button>

              {categories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`min-h-10 shrink-0 rounded-full px-5 py-2 text-xs font-bold transition ${
                    selectedCategory === category.id
                      ? "bg-[#182131] text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-[#DB1D2D]"
                  }`}
                >
                  {category.name}
                </button>
              ))}

            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div className="h-14 w-14 rounded-2xl bg-slate-100" />
                  <div className="mt-7 h-4 w-1/3 rounded bg-slate-100" />
                  <div className="mt-4 h-7 w-3/4 rounded bg-slate-100" />
                  <div className="mt-4 h-4 w-full rounded bg-slate-100" />
                  <div className="mt-3 h-4 w-2/3 rounded bg-slate-100" />
                  <div className="mt-8 h-12 rounded-xl bg-slate-100" />
                </div>
              ))}

            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6">

              <p className="text-sm font-bold text-red-700">
                Course loading failed
              </p>

              <p className="mt-2 text-xs leading-6 text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={() => setRefreshKey((value) => value + 1)}
                className="mt-5 rounded-xl bg-[#DB1D2D] px-5 py-3 text-xs font-bold text-white"
              >
                Try Again
              </button>

            </div>
          )}

          {/* Course cards */}
          {!loading && !error && (
            <>
              {filteredCourses.length > 0 ? (

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onEnquire={handleEnquire}
                    />
                  ))}

                </div>

              ) : (
                <div className="mt-10">
                  <EmptyCourses
                    hasFilter={Boolean(search || selectedCategory !== "all")}
                    onReset={clearFilters}
                  />
                </div>
              )}
            </>
          )}

        </div>
      </section>

      {/* =================================================
          04. SELECTED COURSE INQUIRY
      ================================================= */}

      {selectedCourse && (
        <section
          ref={inquiryRef}
          id="course-inquiry"
          className="scroll-mt-20 bg-[#182131] px-5 py-16 sm:px-8 sm:py-24"
        >

          <div className="mx-auto max-w-7xl">

            <div className="mb-9 flex items-center justify-between gap-3">

              <div>
                <Eyebrow light>
                  CONNECT WITH ANKVIDHYA
                </Eyebrow>

                <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                  Begin Your
                  <span className="block text-[#E7C77D]">
                    Learning Journey.
                  </span>
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 text-white hover:bg-white/10"
                aria-label="Close enquiry form"
              >
                <X size={20} />
              </button>

            </div>

            <div className="grid items-start gap-8 lg:grid-cols-[0.7fr_1.3fr]">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

                <p className="text-[10px] font-bold uppercase tracking-widest text-[#E7C77D]">
                  SELECTED COURSE
                </p>

                <h3 className="mt-4 text-2xl font-extrabold text-white">
                  {selectedCourse.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {selectedCourse.short_description ||
                    selectedCourse.description ||
                    "Ankvidhya learning program."}
                </p>

                <div className="mt-7 space-y-4 border-t border-white/10 pt-6">

                  <div className="flex items-center gap-3">
                    <Clock size={17} className="text-[#E7C77D]" />
                    <p className="text-xs font-semibold text-slate-300">
                      {selectedCourse.duration_label || "Duration on enquiry"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <GraduationCap size={17} className="text-[#E7C77D]" />
                    <p className="text-xs font-semibold text-slate-300">
                      {getAgeLabel(selectedCourse)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <IndianRupee size={17} className="text-[#E7C77D]" />
                    <p className="text-xs font-semibold text-slate-300">
                      {formatPrice(
                        selectedCourse.fee_amount,
                        selectedCourse.currency
                      )}
                    </p>
                  </div>

                </div>

              </div>

              <CourseInquiryForm
                course={selectedCourse}
                onClose={() => setSelectedCourse(null)}
              />

            </div>

          </div>
        </section>
      )}

      {/* =================================================
          05. FINAL CTA
      ================================================= */}

      <section className="bg-[#DB1D2D] px-5 py-16 text-center sm:px-8 sm:py-20">

        <div className="mx-auto max-w-4xl">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">
            MAKING MATH GENIUS
          </p>

          <h2 className="mt-6 text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            The Right Learning Journey
            <span className="block text-[#FFE09A]">
              Begins With One Enquiry.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
            Have questions about courses, learning levels
            or program suitability? Our team is ready to
            help you understand the available options.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-extrabold text-[#182131] transition hover:bg-[#182131] hover:text-white"
            >
              Contact Ankvidhya
              <ArrowUpRight size={17} />
            </Link>

            <a
              href="tel:+916357785778"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/50 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <Phone size={17} />
              Call Our Team
            </a>

          </div>

        </div>
      </section>

    </div>
  );
}
