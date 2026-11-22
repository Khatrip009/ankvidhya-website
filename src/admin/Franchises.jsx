import ApplicationPipeline from "./ApplicationPipeline";

const config = {
  table: "franchise_applications",
  title: "Franchise Applications",
  description: "Manage center enquiries from first review through meetings, approval and onboarding.",
  searchPlaceholder: "Search applicant, center name or city",
  searchFields: ["applicant_name", "proposed_center_name", "city", "state", "investment_capacity"],
  columns: [
    { field: "applicant_name", label: "Applicant" },
    { field: "proposed_center_name", label: "Proposed center" },
    { field: "city", label: "City" },
  ],
  detailFields: [
    { field: "applicant_name", label: "Applicant name" },
    { field: "proposed_center_name", label: "Proposed center" },
    { field: "city", label: "City" },
    { field: "state", label: "State" },
    { field: "full_address", label: "Address" },
    { field: "premises_available", label: "Premises available" },
    { field: "education_experience", label: "Education experience" },
    { field: "investment_capacity", label: "Investment capacity" },
    { field: "expected_start_date", label: "Expected start date" },
  ],
  statuses: [
    { value: "new", label: "New" },
    { value: "under_review", label: "Under review" },
    { value: "meeting_scheduled", label: "Meeting scheduled" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ],
};

export default function Franchises() {
  return <ApplicationPipeline config={config} />;
}
