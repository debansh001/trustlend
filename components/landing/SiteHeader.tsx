import type { NavItem } from "@/types/landing";

interface SiteHeaderProps {
  items: NavItem[];
  isAuthenticated?: boolean;
}

export function SiteHeader({ items, isAuthenticated = false }: SiteHeaderProps) {
  return (
    <header className="site-header sticky top-0 z-30">
      <div className="crypto-container site-header-row">
        <a href="#home" className="site-logo-wrap" aria-label="TrustLend home">
          <span className="site-logo-orb" aria-hidden="true" />
          <span>
            <strong className="font-display site-logo-title">TrustLend</strong>
            <small className="site-logo-subtitle">Behavior-first credit network</small>
          </span>
        </a>

        <nav className="site-nav-desktop" aria-label="Primary">
          {items.map((item) => (
            <a key={item.href} href={item.href} className="site-nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-header-actions">
          <a href="#faq" className="site-nav-utility">
            Need help?
          </a>
          {isAuthenticated ? (
            <a href="/dashboard" className="google-btn google-btn-header" id="header-dashboard-btn">
              Dashboard
            </a>
          ) : (
            <a href="/auth" className="google-btn google-btn-header" id="header-signin-btn">
              Sign in
            </a>
          )}
        </div>
      </div>

      <div className="site-nav-mobile-wrap">
        <nav className="crypto-container site-nav-mobile" aria-label="Primary mobile">
          {items.map((item) => (
            <a key={item.href} href={item.href} className="site-nav-link">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
