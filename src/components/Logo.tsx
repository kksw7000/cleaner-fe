import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  onClick?: () => void;
}

export default function Logo({ className = '', iconOnly = false, onClick }: LogoProps) {
  return (
    <Link
      to="/"
      aria-label={iconOnly ? '정오클린케어 메인 페이지' : undefined}
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      onClick={onClick}
    >
      <img
        src="/images/logo/clear-logo.png"
        alt=""
        className="h-10 w-10 rounded-lg bg-white object-contain"
      />
      {!iconOnly && (
        <span className="font-bold text-lg tracking-wide text-white">
          정오클린케어
        </span>
      )}
    </Link>
  );
}
