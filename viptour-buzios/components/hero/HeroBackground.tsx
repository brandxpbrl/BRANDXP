import Image from "next/image";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0">
      <Image
        src="/images/hero-buggy.png"
        alt="Pareja disfrutando un paseo en buggy amarillo con vista a la costa de Búzios"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/55" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
    </div>
  );
}
