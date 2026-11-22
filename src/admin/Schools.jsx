import ApplicationPipeline from "./ApplicationPipeline";

const config = {
  table: "school_partnerships",
  title: "School Partnerships",
  description: "Review school enquiries, keep track of proposal progress and coordinate the Ankvidhya partnership team.",
  searchPlaceholder: "Search school, contact person or city",
  searchFields: ["school_name", "contact_person", "city", "state", "school_type", "partnership_model"],
  columns: [
    { field: "school_name", label: "School" },
    { field: "contact_person", label: "Contact person" },
    { field: "city", label: "City" },
  ],
  detailFields: [
    { field: "school_name", label: "School name" },
    { field: "school_type", label: "School type" },
    { field: "contact_person", label: "Contact person" },
    { field: "school_website", label: "Website" },
    { field: "address", label: "Address" },
    { field: "city", label: "City" },
    { field: "state", label: "State" },
    { field: "pincode", label: "PIN code" },
    { field: "student_strength", label: "Student strength" },
    { field: "partnership_model", label: "Partnership model" },
    { field: "proposed_start_date", label: "Proposed start date" },
  ],
  statuses: [
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "meeting_scheduled", label: "Meeting scheduled" },
    { value: "proposal_sent", label: "Proposal sent" },
    { value: "active", label: "Active" },
    { value: "declined", label: "Declined" },
  ],
};

export default function Schools() {
  return <ApplicationPipeline config={config} />;
}
