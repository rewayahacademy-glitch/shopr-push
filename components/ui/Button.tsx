import Link from 'next/link';
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size    = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary:   'bg-salmon text-white hover:bg-salmon-hover shadow-sm hover:shadow-md',
  secondary: 'bg-teal text-white hover:bg-teal-deep shadow-sm hover:shadow-md',
  ghost:     'bg-transparent text-teal hover:bg-teal/8 border border-teal/20',
  outline:   'bg-transparent text-white hover:bg-white/10 border border-white/40',
};

const sizes: Record<Size, string> = {
  sm: 'text-sm px-4 py-2 rounded-xl gap-1.5',
  md: 'text-sm px-6 py-2.5 rounded-xl gap-2',
  lg: 'text-base px-8 py-3.5 rounded-2xl gap-2',
};

const base = 'inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 ease-smooth focus-ring select-none';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps   = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; external?: boolean };

type Props = ButtonProps | LinkProps;

export default function Button(props: Props) {
  const { variant = 'primary', size = 'md', children, className = '' } = props;
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if ('href' in props && props.href) {
    const { href, external, variant: _v, size: _s, className: _c, ...rest } = props as LinkProps;
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={cls}
          {...rest}
        >
          {children}
          <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...(rest as object)}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, ...rest } = props as ButtonProps;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
