import { brandStrategy } from "@/brand/brand.strategy";
import HeroButtons from "./HeroButtons";
import HeroBadges from "./HeroBadges";

export default function HeroContent(){

return(

<div className="relative z-20 flex items-center min-h-screen">

<div className="max-w-7xl mx-auto px-6">

<p className="text-yellow-400 font-semibold mb-6">

{brandStrategy.differentiation}

</p>

<h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">

Conheça Búzios do jeito certo.

</h1>

<p className="text-xl text-gray-200 mt-8 max-w-xl">

{brandStrategy.promise}

</p>

<HeroButtons/>

<HeroBadges/>

</div>

</div>

);

}
