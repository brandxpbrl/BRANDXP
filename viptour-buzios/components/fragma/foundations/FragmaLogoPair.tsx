import Image from "next/image";

type FragmaLogoPairProps = { className?: string; priority?: boolean };

export function FragmaLogoPair({ className = "", priority = false }: FragmaLogoPairProps) {
  return (
    <div className={`fragma-logo-pair ${className}`}>
      <span className="fragma-logo-wordmark" aria-label="FRAGMA Brand Experience">
        <span className="fragma-logo-wordmark-main">FRAGMA</span>
        <span className="fragma-logo-wordmark-sub">Brand Experience</span>
      </span>
      <span className="fragma-logo-divider" aria-hidden="true" />
      <Image src="/images/brandexperience-logo.png" alt="Brand Experience" width={180} height={64} priority={priority} className="fragma-logo fragma-logo-secondary" />
    </div>
  );
}
