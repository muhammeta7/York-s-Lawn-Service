// Small hand-rolled stroke icons (no external icon library needed).
// All 24x24, currentColor stroke, so they inherit text color/size from their parent.

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function MowerIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="6" cy="17" r="2.5" />
      <circle cx="16" cy="17" r="2.5" />
      <path d="M6 17h6l2-9h3a2 2 0 0 1 2 2v2" />
      <path d="M12 17V9" />
      <path d="M8 9h6" />
    </svg>
  );
}

export function LeafIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 20c8 0 16-6 16-16C10 4 4 12 4 20Z" />
      <path d="M6 18c3-4 6-7 12-13" />
    </svg>
  );
}

export function ShovelIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M14 4 20 10" />
      <path d="M17 7 6 18a2.5 2.5 0 1 0 3.5 3.5L20 10" />
      <path d="M6 18l-2 4" />
    </svg>
  );
}

export function TrimIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <path d="M8.5 7.5 20 19" />
      <path d="M8.5 16.5 20 5" />
    </svg>
  );
}

export function BuildingIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="4" y="3" width="10" height="18" />
      <rect x="14" y="9" width="6" height="12" />
      <path d="M7 7h1M11 7h1M7 11h1M11 11h1M7 15h1M11 15h1" />
    </svg>
  );
}

export function HelpIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.9.4-1.5 1-1.5 2.2" />
      <path d="M12 17.5h.01" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v10h12V10" />
      <path d="M10 20v-6h4v6" />
    </svg>
  );
}

export function CheckBadgeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3l2.2 1.6 2.7-.3 1 2.6 2.5 1.2-.5 2.7 1.3 2.4-2 1.9.2 2.7-2.6.7-1.4 2.4-2.5-.6-2.5.6-1.4-2.4-2.6-.7.2-2.7-2-1.9 1.3-2.4-.5-2.7 2.5-1.2 1-2.6 2.7.3Z" />
      <path d="M9 12.5l2 2 4-4.5" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export const SERVICE_ICONS: Record<string, (props: IconProps) => JSX.Element> = {
  mowing: MowerIcon,
  "leaf-cleanup": LeafIcon,
  mulch: ShovelIcon,
  trimming: TrimIcon,
  commercial: BuildingIcon,
  other: HelpIcon,
};
