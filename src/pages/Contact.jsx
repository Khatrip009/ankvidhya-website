
import { useState } from "react";

import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Globe,
  Camera,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Send,
  Sparkles,
  PlayCircle,
} from "lucide-react";

import { supabase } from "../lib/supabaseClient";
import ResponsiveImage from "../components/ResponsiveImage";
import SEO from "../components/SEO";
import { SITE_IMAGES } from "../data/siteImages";

// =====================================================
// ANKVIDHYA CONTACT CONFIGURATION
// Verified from supplied brochures
// =====================================================

const CONTACT = {
  name: "Ankvidhya",

  phone: "+916357785778",
  displayPhone: "+91 63 5778 5778",

  generalEmail: "info@ankvidhya.com",
  founderEmail: "akshaykhatri@ankvidhya.com",

  website: "https://www.ankvidhya.com",

  address:
    "C/326/327, Monarch Gaurav Path, Pal Gam, Surat, Gujarat 395009, India",

  legalEntity:
    "Akshay Khatri Education and Training LLP",
};

// Official social URLs can be added through .env.local.
// Leave blank until the actual profile URLs are confirmed.

const SOCIAL_LINKS = [
 {
  name: "YouTube",
  url: import.meta.env.VITE_YOUTUBE_URL || "",
  icon: PlayCircle,
},
 {
  name: "Instagram",
  url: import.meta.env.VITE_INSTAGRAM_URL || "",
  icon: Camera,
},
];

const WHATSAPP_URL = `https://wa.me/916357785778`;

const MAP_QUERY = encodeURIComponent(CONTACT.address);

const MAP_EMBED_URL =
  `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`;

const MAP_DIRECTIONS_URL =
  `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`;

// =====================================================
// BRAND
// =====================================================

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

// =====================================================
// FORM STYLES
// =====================================================

const inputClass =
  "min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#182131] outline-none transition placeholder:text-slate-400 focus:border-[#DB1D2D] focus:ring-4 focus:ring-red-50";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700";

// =====================================================
// INITIAL FORM
// =====================================================

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  organization: "",
  topic: "general",
  city: "",
  state: "",
  preferredContact: "phone",
  message: "",
  consent: false,
  websiteTrap: "",
};

// =====================================================
// CONTACT INFORMATION CARD
// =====================================================

function ContactCard({ icon: Icon, title, value, href, description }) {
  return (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group flex min-h-[112px] items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg sm:p-6"
    >

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#DB1D2D] transition group-hover:bg-[#DB1D2D] group-hover:text-white">
        <Icon size={22} />
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </p>

        <p className="mt-2 break-words text-sm font-extrabold leading-5 text-[#182131] group-hover:text-[#DB1D2D]">
          {value}
        </p>

        {description && (
          <p className="mt-2 text-xs leading-5 text-slate-500">
            {description}
          </p>
        )}

      </div>

      <ArrowUpRight
        size={16}
        className="shrink-0 text-slate-300 transition group-hover:text-[#DB1D2D]"
      />

    </a>
  );
}

// =====================================================
// CONTACT FORM
// General inquiries go into public.leads.
// =====================================================

function ContactInquiryForm() {
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
      setError("Unable to submit this request.");
      return;
    }

    if (!form.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.trim() && !form.phone.trim()) {
      setError("Please provide at least an email address or mobile number.");
      return;
    }

    if (form.phone.trim()) {
      const phoneDigits = form.phone.replace(/\D/g, "");

      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        setError("Please enter a valid mobile number.");
        return;
      }
    }

    if (!form.consent) {
      setError("Please agree to be contacted by Ankvidhya.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        full_name: form.fullName.trim(),

        email: form.email.trim() || null,
        phone: form.phone.trim() || null,

        inquiry_type: "general",

        organization_name:
          form.organization.trim() || null,

        city: form.city.trim() || null,
        state: form.state.trim() || null,
        country: "India",

        message: form.message.trim() || null,

        consent_to_contact: true,

        custom_fields: {
          form_name: "Ankvidhya General Contact Inquiry",
          contact_topic: form.topic,
          preferred_contact_method: form.preferredContact,
        },
      };

      // Uses public INSERT permission on leads.
      // Do not chain .select() because anonymous visitors
      // are not permitted to read private CRM records.

      const { error: insertError } = await supabase
        .from("leads")
        .insert(payload);

      if (insertError) {
        throw insertError;
      }

      setForm(initialForm);
      setSuccess(true);

    } catch (err) {
      console.error("Contact form submission error:", err);

      setError(
        "We could not send your enquiry. Please try again or contact us directly by phone or email."
      );

    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/40 sm:p-8 lg:p-9">

      {/* Form header */}
      <div className="mb-7">

        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#DB1D2D]">
          GET IN TOUCH
        </p>

        <h3 className="mt-2 text-2xl font-extrabold text-[#182131]">
          Send Us an Enquiry
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Tell us how we can help. Our team will use your
          preferred contact method to follow up.
        </p>

      </div>

      {/* Success */}
      {success && (
        <div
          role="status"
          className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5"
        >

          <div className="flex items-center gap-3">
            <CheckCircle2
              size={25}
              className="shrink-0 text-green-700"
            />

            <h4 className="font-bold text-green-800">
              Thank you for contacting Ankvidhya!
            </h4>
          </div>

          <p className="mt-2 text-sm leading-6 text-green-800">
            Your enquiry has been submitted successfully.
            Our team can review your request and get in touch
            using the details you provided.
          </p>

        </div>
      )}

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

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

        {/* Name */}
        <div>
          <label className={labelClass}>
            Full Name *
          </label>

          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            maxLength={150}
            placeholder="Enter your full name"
            className={inputClass}
          />
        </div>

        {/* Contact details */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div>
            <label className={labelClass}>
              Mobile Number
            </label>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
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

        <p className="-mt-3 text-[10px] text-slate-400">
          Please provide at least one: mobile number or email address.
        </p>

        {/* Organisation */}
        <div>
          <label className={labelClass}>
            School / Organisation / Company
          </label>

          <input
            name="organization"
            value={form.organization}
            onChange={handleChange}
            maxLength={180}
            placeholder="Optional"
            className={inputClass}
          />
        </div>

        {/* Topic */}
        <div>
          <label className={labelClass}>
            How Can We Help You?
          </label>

          <select
            name="topic"
            value={form.topic}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="general">General Enquiry</option>
            <option value="course_information">Course Information</option>
            <option value="school_partnership">School Partnership</option>
            <option value="franchise">Franchise Opportunity</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Location */}
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

        {/* Preferred contact */}
        <div>
          <label className={labelClass}>
            Preferred Contact Method
          </label>

          <div className="grid grid-cols-3 gap-2">

            {[
              ["phone", "Phone"],
              ["email", "Email"],
              ["whatsapp", "WhatsApp"],
            ].map(([value, label]) => (
              <label
                key={value}
                className={`flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-2 py-3 text-xs font-bold transition ${
                  form.preferredContact === value
                    ? "border-[#DB1D2D] bg-red-50 text-[#DB1D2D]"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >

                <input
                  type="radio"
                  name="preferredContact"
                  value={value}
                  checked={form.preferredContact === value}
                  onChange={handleChange}
                  className="sr-only"
                />

                {label}

              </label>
            ))}

          </div>
        </div>

        {/* Message */}
        <div>
          <label className={labelClass}>
            Your Message
          </label>

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={5}
            maxLength={2000}
            placeholder="Tell us about your requirements or questions..."
            className={`${inputClass} min-h-32 resize-y`}
          />
        </div>

        {/* Consent */}
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
            this enquiry using the details provided.
          </span>

        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#DB1D2D] px-6 py-4 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
        >

          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Sending Enquiry...
            </>
          ) : (
            <>
              Send Enquiry
              <Send size={17} />
            </>
          )}

        </button>

        <p className="text-center text-[10px] leading-5 text-slate-400">
          Your information will be used to respond to your
          enquiry and manage the requested follow-up.
        </p>

      </form>
    </div>
  );
}

// =====================================================
// MAIN CONTACT PAGE
// =====================================================

export default function Contact() {
  return (
    <div className="overflow-hidden bg-white">
      <SEO title="Contact Ankvidhya" description="Contact Ankvidhya in Surat, Gujarat for mathematics courses, school partnerships, franchise opportunities and general enquiries." path="/contact" />

      {/* =================================================
          01. HERO
      ================================================= */}

      <section className="relative overflow-hidden bg-[#182131]">

        <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full border border-white/10 sm:h-[650px] sm:w-[650px]" />

        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#DB1D2D]/15 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 sm:py-24">

          <div className="flex justify-center">
            <Eyebrow light>
              WE WOULD LOVE TO HEAR FROM YOU
            </Eyebrow>
          </div>

          <h1 className="mt-7 text-[42px] font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">

            Let's Connect.
            <span className="block text-[#E7C77D]">
              Let's Create Possibilities.
            </span>

          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
            Whether you are a parent, school leader,
            education entrepreneur or learner, the
            Ankvidhya team is ready to connect with you.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

            <a
              href="#contact-form"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#DB1D2D] px-7 py-4 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Send an Enquiry
              <ArrowUpRight size={17} />
            </a>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-7 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-[#182131]"
            >
              <MessageCircle size={17} />
              WhatsApp Us
            </a>

          </div>

        </div>
      </section>

      {/* =================================================
          02. CONTACT INFORMATION
      ================================================= */}

      <section className="bg-[#F5F6F8] px-5 py-16 sm:px-8 sm:py-20">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="REACH ANKVIDHYA"
            title="We Are Just"
            highlight="A Conversation Away."
            description="Choose the contact method that works best for you. We welcome enquiries about learning programs, school partnerships, franchise opportunities and general information."
          />

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <ContactCard
              icon={Phone}
              title="Call Our Team"
              value={CONTACT.displayPhone}
              href={`tel:${CONTACT.phone}`}
              description="Speak directly with Ankvidhya."
            />

            <ContactCard
              icon={Mail}
              title="General Enquiries"
              value={CONTACT.generalEmail}
              href={`mailto:${CONTACT.generalEmail}`}
              description="For information and general communication."
            />

            <ContactCard
              icon={Mail}
              title="Founder & Academic Director"
              value={CONTACT.founderEmail}
              href={`mailto:${CONTACT.founderEmail}`}
              description="Contact Akshay Khatri."
            />

            <ContactCard
              icon={Globe}
              title="Official Website"
              value="www.ankvidhya.com"
              href={CONTACT.website}
              description="Discover the Ankvidhya ecosystem."
            />

            <ContactCard
              icon={MessageCircle}
              title="WhatsApp"
              value="Chat With Our Team"
              href={WHATSAPP_URL}
              description="Connect through WhatsApp."
            />

            <ContactCard
              icon={Building2}
              title="Legal Entity"
              value={CONTACT.legalEntity}
              href={`mailto:${CONTACT.generalEmail}`}
              description="Official business entity."
            />

          </div>

        </div>
      </section>

      {/* =================================================
          03. MAIN BRANCH & MAP
      ================================================= */}

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">

        <div className="mx-auto max-w-7xl">

          <SectionHeading
            eyebrow="VISIT OUR MAIN BRANCH"
            title="Find Us in"
            highlight="Surat, Gujarat."
            description="Visit the Ankvidhya main branch to connect with our team and discuss educational opportunities."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">

            {/* Address panel */}
            <div className="flex flex-col rounded-3xl bg-[#182131] p-6 text-white sm:p-8">

              <Eyebrow light>
                ANKVIDHYA MAIN BRANCH
              </Eyebrow>

              <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DB1D2D] text-white">
                <MapPin size={27} />
              </div>

              <h3 className="mt-6 text-2xl font-extrabold">
                Our Main Branch
              </h3>

              <p className="mt-5 text-sm leading-8 text-slate-300">
                C/326/327, Monarch Gaurav Path,
                Pal Gam, Surat, Gujarat 395009, India.
              </p>

              <div className="mt-8 space-y-5 border-t border-white/10 pt-7">

                <div className="flex items-center gap-3">
                  <Phone size={19} className="shrink-0 text-[#E7C77D]" />
                  <a
                    href={`tel:${CONTACT.phone}`}
                    className="text-sm font-bold text-white hover:text-[#E7C77D]"
                  >
                    {CONTACT.displayPhone}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={19} className="shrink-0 text-[#E7C77D]" />
                  <a
                    href={`mailto:${CONTACT.generalEmail}`}
                    className="break-all text-sm font-semibold text-white hover:text-[#E7C77D]"
                  >
                    {CONTACT.generalEmail}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Globe size={19} className="shrink-0 text-[#E7C77D]" />
                  <a
                    href={CONTACT.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-white hover:text-[#E7C77D]"
                  >
                    www.ankvidhya.com
                  </a>
                </div>

              </div>

              <div className="mt-7 rounded-xl bg-white p-3">
                <ResponsiveImage image={SITE_IMAGES.contact.building} objectFit="contain" className="mx-auto h-28 w-full max-w-[260px]" sizes="260px" />
                <p className="mt-1 text-center text-[9px] font-semibold uppercase tracking-wider text-slate-500">Illustrative Ankvidhya center concept</p>
              </div>

              <div className="mt-auto pt-9">

                <a
                  href={MAP_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#DB1D2D] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  Get Directions
                  <Navigation size={17} />
                </a>

              </div>

            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[#F5F6F8]">

              <iframe
                title="Ankvidhya Main Branch Map - Pal Gam, Surat"
                src={MAP_EMBED_URL}
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="min-h-[320px] w-full border-0 sm:min-h-[420px]"
                allowFullScreen
              />

              <div className="border-t border-slate-200 bg-white p-4">

                <div className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-[#DB1D2D]"
                  />

                  <div>
                    <p className="text-xs font-bold text-[#182131]">
                      Ankvidhya Main Branch
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Pal Gam, Surat, Gujarat 395009
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =================================================
          04. CONTACT FORM
      ================================================= */}

      <section
        id="contact-form"
        className="scroll-mt-16 bg-[#F5F6F8] px-5 py-16 sm:px-8 sm:py-24"
      >

        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">

          {/* Form introduction */}
          <div className="lg:sticky lg:top-28 lg:self-start">

            <Eyebrow>
              SEND US A MESSAGE
            </Eyebrow>

            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-[#182131] sm:text-4xl">

              How Can We
              <span className="block text-[#DB1D2D]">
                Help You?
              </span>

            </h2>

            <p className="mt-6 text-sm leading-8 text-slate-500 sm:text-base">
              Have a question about Ankvidhya's academic
              programs, school partnerships, franchise
              opportunities or anything else? Complete
              this form and our team can follow up with you.
            </p>

            <div className="mt-9 space-y-5">

              <div className="flex items-start gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#DB1D2D]">
                  <MessageCircle size={21} />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#182131]">
                    Prefer WhatsApp?
                  </p>

                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#DB1D2D]"
                  >
                    Start a WhatsApp conversation
                    <ArrowUpRight size={13} />
                  </a>
                </div>

              </div>

              <div className="flex items-start gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#DB1D2D]">
                  <Phone size={21} />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#182131]">
                    Prefer a direct call?
                  </p>

                  <a
                    href={`tel:${CONTACT.phone}`}
                    className="mt-1 block text-xs font-semibold text-[#DB1D2D]"
                  >
                    {CONTACT.displayPhone}
                  </a>
                </div>

              </div>

            </div>

          </div>

          {/* Contact form */}
          <ContactInquiryForm />

        </div>
      </section>

      {/* =================================================
          05. SOCIAL MEDIA
      ================================================= */}

      <section className="bg-white px-5 py-14 sm:px-8 sm:py-16">

        <div className="mx-auto max-w-4xl text-center">

          <Eyebrow>
            STAY CONNECTED
          </Eyebrow>

          <h2 className="mt-5 text-3xl font-extrabold text-[#182131] sm:text-4xl">
            Follow the Ankvidhya Journey.
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-500">
            Connect with us for updates, insights and
            a glimpse of the Ankvidhya experience.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-green-50 px-5 py-3 text-sm font-bold text-green-800 transition hover:bg-green-100"
            >
              <MessageCircle size={19} />
              WhatsApp
            </a>

            {SOCIAL_LINKS.filter((item) => item.url).map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-[#182131] transition hover:border-[#DB1D2D] hover:text-[#DB1D2D]"
                >
                  <Icon size={19} />
                  {item.name}
                </a>
              );
            })}

          </div>

          {SOCIAL_LINKS.every((item) => !item.url) && (
            <p className="mt-5 text-[10px] text-slate-400">
              Official YouTube and Instagram profile links
              can be added when confirmed.
            </p>
          )}

        </div>
      </section>

      {/* =================================================
          06. FINAL CTA
      ================================================= */}

      <section className="bg-[#182131] px-5 py-16 text-center sm:px-8 sm:py-20">

        <div className="mx-auto max-w-4xl">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DB1D2D] text-white">
            <Sparkles size={26} />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#E7C77D]">
            MAKING MATH GENIUS
          </p>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-5xl">

            Empowering Children with Confidence,
            <span className="block text-[#E7C77D]">
              Faster Calculation & Lifelong Learning.
            </span>

          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-300">
            We look forward to connecting with you and
            exploring how Ankvidhya can become part of
            your educational journey.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

            <a
              href={`mailto:${CONTACT.generalEmail}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#DB1D2D] px-7 py-4 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Email Ankvidhya
              <ArrowUpRight size={17} />
            </a>

            <a
              href={`tel:${CONTACT.phone}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-7 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-[#182131]"
            >
              <Phone size={17} />
              Call Our Team
            </a>

          </div>

        </div>
      </section>

      {/* =================================================
          07. LEGAL ENTITY
      ================================================= */}

      <section className="border-t border-slate-200 bg-[#F5F6F8] px-5 py-6 sm:px-8">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">

          <p className="text-xs font-bold text-[#182131]">
            {CONTACT.legalEntity}
          </p>

          <p className="text-[10px] text-slate-400">
            Official Ankvidhya Contact Information
          </p>

        </div>
      </section>

    </div>
  );
}
