import { SVGAttributes } from "react";

interface IconProps extends SVGAttributes<SVGElement> {
  size?: number;
}

function Icon({ size = 16, className = "", children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      style={{ flexShrink: 0 }}
      {...props}
    >
      {children}
    </svg>
  );
}

export function SearchIcon(p: IconProps) {
  return <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></Icon>;
}
export function PlusIcon(p: IconProps) {
  return <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>;
}
export function ChevronDownIcon(p: IconProps) {
  return <Icon {...p}><path d="m6 9 6 6 6-6" /></Icon>;
}
export function ChevronRightIcon(p: IconProps) {
  return <Icon {...p}><path d="m9 6 6 6-6 6" /></Icon>;
}
export function ChevronLeftIcon(p: IconProps) {
  return <Icon {...p}><path d="m15 6-6 6 6 6" /></Icon>;
}
export function ArrowUpIcon(p: IconProps) {
  return <Icon {...p}><path d="m18 15-6-6-6 6" /></Icon>;
}
export function ArrowDownIcon(p: IconProps) {
  return <Icon {...p}><path d="m6 9 6 6 6-6" /></Icon>;
}
export function ArrowLeftIcon(p: IconProps) {
  return <Icon {...p}><path d="M19 12H5M12 19l-7-7 7-7" /></Icon>;
}
export function PhoneIcon(p: IconProps) {
  return <Icon {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" /></Icon>;
}
export function MailIcon(p: IconProps) {
  return <Icon {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></Icon>;
}
export function CalendarIcon(p: IconProps) {
  return <Icon {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></Icon>;
}
export function BuildingIcon(p: IconProps) {
  return <Icon {...p}><rect x="4" y="2" width="16" height="20" rx="1" /><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" /></Icon>;
}
export function UserIcon(p: IconProps) {
  return <Icon {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a7 7 0 0 1 14 0v1" /></Icon>;
}
export function UsersIcon(p: IconProps) {
  return <Icon {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 21v-1a6 6 0 0 1 12 0v1M16 5.2a3.5 3.5 0 0 1 0 6.6M22 21v-1a6 6 0 0 0-4.5-5.8" /></Icon>;
}
export function CheckIcon(p: IconProps) {
  return <Icon {...p}><path d="m5 12 5 5L20 7" /></Icon>;
}
export function XIcon(p: IconProps) {
  return <Icon {...p}><path d="M18 6 6 18M6 6l12 12" /></Icon>;
}
export function TrashIcon(p: IconProps) {
  return <Icon {...p}><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></Icon>;
}
export function EditIcon(p: IconProps) {
  return <Icon {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></Icon>;
}
export function DocIcon(p: IconProps) {
  return <Icon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /></Icon>;
}
export function BoxIcon(p: IconProps) {
  return <Icon {...p}><path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8M12 13v8" /></Icon>;
}
export function ExternalIcon(p: IconProps) {
  return <Icon {...p}><path d="M15 3h6v6M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" /></Icon>;
}
