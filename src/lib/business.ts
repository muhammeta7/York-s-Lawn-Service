// Central place for all the "who is this business" facts, so updating
// hours, pricing, or the Cash App tag doesn't require hunting through JSX.

export const BUSINESS = {
  name: "York's Lawn Service",
  phone: "(856) 469-7202",
  phoneHref: "tel:+18564697202",
  serviceArea: "Salem and Gloucester County",
  hoursLabel: "Mon–Sat, 9 AM–6 PM",
  // 0 = Sunday ... 6 = Saturday. Used to block Sundays on the calendar.
  openDays: [1, 2, 3, 4, 5, 6],
  cashtag: "$YorkMGross",
  cashAppUrl: "https://cash.app/$YorkMGross",
  // Max jobs accepted per calendar day before that date is greyed out.
  // Change here (and in supabase/schema.sql's get_unavailable_dates
  // function) if the owner wants to take on more or fewer jobs per day.
  maxJobsPerDay: 3,
};

export const SERVICES = [
  {
    id: "mowing",
    label: "Lawn Mowing",
    description: "Regular or one-time mowing, edging, and cleanup.",
    pricing: [
      { tier: "Small yard", price: "$50" },
      { tier: "Medium yard", price: "$60" },
      { tier: "Large yard", price: "$70+" },
    ],
  },
  {
    id: "leaf-cleanup",
    label: "Leaf Cleanup",
    description: "Fall cleanup, leaf removal and hauling.",
    pricing: [{ tier: "Priced by yard size & time", price: "Quote" }],
  },
  {
    id: "mulch",
    label: "Mulch Installation",
    description: "Fresh mulch beds, edging, and touch-ups.",
    pricing: [{ tier: "Priced by yard size & time", price: "Quote" }],
  },
  {
    id: "trimming",
    label: "Trimming",
    description: "Hedge, shrub, and bush trimming.",
    pricing: [{ tier: "Priced by yard size & time", price: "Quote" }],
  },
  {
    id: "commercial",
    label: "Commercial Properties",
    description: "Recurring or one-off service for commercial lots.",
    pricing: [{ tier: "Custom quote", price: "Contact us" }],
  },
  {
    id: "other",
    label: "Other / Not Sure",
    description: "Tell us what you need — we'll follow up with a quote.",
    pricing: [{ tier: "Depends on job size & time", price: "Quote" }],
  },
] as const;

export const SERVICE_LABELS: Record<string, string> = Object.fromEntries(
  SERVICES.map((s) => [s.id, s.label])
);
