type FragmaHorizonLightProps = { className?: string };

export function FragmaHorizonLight({ className = "" }: FragmaHorizonLightProps) {
  return <div aria-hidden="true" className={`fragma-horizon-light ${className}`} />;
}
