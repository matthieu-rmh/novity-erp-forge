import { HTMLAttributes } from "react";

interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  firstName?: string;
  lastName?: string;
  size?: number;
}

const AVATAR_BGS = ["#C6C6F0", "#A8E8D4", "#F5C4AD", "#E0E0E0", "#D8D2F2", "#C9E8DE"];

function avatarBg(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h * 31 + seed.charCodeAt(i)) >>> 0);
  return AVATAR_BGS[h % AVATAR_BGS.length];
}

function initials(first?: string, last?: string): string {
  return `${(first ?? " ")[0]}${(last ?? " ")[0]}`.toUpperCase();
}

function Avatar({ firstName, lastName, size = 36, className = "", style, ...props }: AvatarProps) {
  const seed = `${firstName}${lastName}`;
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-bold text-brand-black select-none flex-shrink-0 ${className}`}
      style={{ width: size, height: size, background: avatarBg(seed), fontSize: size * 0.38, ...style }}
      aria-hidden="true"
      {...props}
    >
      {initials(firstName, lastName)}
    </span>
  );
}

export { Avatar, avatarBg, initials };
export type { AvatarProps };
