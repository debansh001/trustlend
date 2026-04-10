import Image from "next/image";
import type { HeroContent } from "@/types/landing";
import heroCrypto from "@/assets/hero-crypto.png";
import { AuthAccessButton } from "@/components/auth/AuthAccessButton";

interface HeroSectionProps {
  content: HeroContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section id="home" className="hero-section section-anchor">
      <div className="crypto-container hero-grid">
        <article className="hero-copy">
          <p className="hero-eyebrow">{content.eyebrow}</p>
          <h1 className="hero-title font-display">
            {content.titleMain}
            <span>{content.titleAccent}</span>
          </h1>
          <p className="hero-description">{content.description}</p>

          <div className="hero-trust-pills" role="list" aria-label="TrustLend highlights">
            <span className="hero-trust-pill" role="listitem">
              Borrower flow
            </span>
            <span className="hero-trust-pill" role="listitem">
              Lender flow
            </span>
            <span className="hero-trust-pill" role="listitem">
              Real behavior scoring
            </span>
          </div>

          <div className="hero-cta-wrap">
            <AuthAccessButton className="google-btn google-btn-hero" buttonLabel="Start now" />
          </div>

          <p className="hero-subnote">Choose your role during sign-in. Dashboard is automatically split by role.</p>
        </article>

        <article className="hero-visual" aria-hidden="true">
          <div className="hero-visual-ring" />
          <div className="hero-art">
            <Image
              src={heroCrypto}
              alt=""
              fill
              priority
              sizes="(max-width: 960px) 100vw, 50vw"
              className="object-contain"
            />
          </div>
        </article>
      </div>
    </section>
  );
}
