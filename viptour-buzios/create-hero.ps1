$folders = @(
"components/hero",
"sections"
)

foreach ($folder in $folders){
    if(!(Test-Path $folder)){
        New-Item -ItemType Directory -Force -Path $folder | Out-Null
    }
}

@'
export default function HeroBackground() {
  return (
    <div className="absolute inset-0">
      <img
        src="/images/hero.jpg"
        alt="VIPTOUR Búzios"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/55" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
    </div>
  );
}
'@ | Set-Content components/hero/HeroBackground.tsx

@'
export default function HeroButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">

      <a
        href="#"
        className="px-8 py-4 rounded-full bg-yellow-400 text-black font-bold"
      >
        Reservar pelo WhatsApp
      </a>

      <a
        href="#services"
        className="px-8 py-4 rounded-full border border-white text-white"
      >
        Ver Passeios
      </a>

    </div>
  );
}
'@ | Set-Content components/hero/HeroButtons.tsx

@'
export default function HeroBadges() {

return(

<div className="flex flex-col md:flex-row gap-4 mt-10 text-white">

<div>✓ Guia Bilíngue</div>

<div>✓ Atendimento Rápido</div>

<div>✓ Reserva Fácil</div>

</div>

);

}
'@ | Set-Content components/hero/HeroBadges.tsx

@'
export default function ScrollIndicator(){

return(

<div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce">

↓

</div>

);

}
'@ | Set-Content components/hero/ScrollIndicator.tsx

@'
import HeroButtons from "./HeroButtons";
import HeroBadges from "./HeroBadges";

export default function HeroContent(){

return(

<div className="relative z-20 flex items-center min-h-screen">

<div className="max-w-7xl mx-auto px-6">

<p className="text-yellow-400 font-semibold mb-6">

⭐ Mais de 10 anos realizando passeios em Búzios

</p>

<h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">

Conheça Búzios do jeito certo.

</h1>

<p className="text-xl text-gray-200 mt-8 max-w-xl">

Passeios de Buggy, City Tour, Transfers e experiências inesquecíveis para brasileiros, argentinos e turistas do mundo todo.

</p>

<HeroButtons/>

<HeroBadges/>

</div>

</div>

);

}
'@ | Set-Content components/hero/HeroContent.tsx

@'
import HeroBackground from "@/components/hero/HeroBackground";
import HeroContent from "@/components/hero/HeroContent";
import ScrollIndicator from "@/components/hero/ScrollIndicator";

export default function Hero(){

return(

<section id="hero" className="relative min-h-screen overflow-hidden">

<HeroBackground/>

<HeroContent/>

<ScrollIndicator/>

</section>

);

}
'@ | Set-Content sections/Hero.tsx

Write-Host ""
Write-Host "========================================="
Write-Host " HERO SECTION CREATED SUCCESSFULLY "
Write-Host "========================================="
Write-Host ""
Write-Host "Now import:"
Write-Host ""
Write-Host 'import Hero from "@/sections/Hero";'
Write-Host ""
Write-Host "inside app/page.tsx"