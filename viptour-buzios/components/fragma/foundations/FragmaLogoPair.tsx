import Image from "next/image";

type FragmaLogoPairProps = { className?: string; priority?: boolean };

export function FragmaLogoPair({ className = "", priority = false }: FragmaLogoPairProps) {
  return (
    <div className={`fragma-logo-pair ${className}`} aria-label="Fragma Brand Experience">
      <Image src="/images/fragma-logo.png" alt="FRAGMA" width={180} height={64} priority={priority} className="fragma-logo fragma-logo-primary" />
      <span className="fragma-logo-divider" aria-hidden="true" />
      <Image src="/images/brandexperience-logo.png" alt="Brand Experience" width={180} height={64} priority={priority} className="fragma-logo fragma-logo-secondary" />
    </div>
  );
}
