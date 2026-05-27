export default function HeroCore() {

  return (

    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-black/30 h-[520px]">

      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,255,255,0.15),transparent_35%)]" />

      <div className="absolute top-1/2 left-1/2 w-[220px] h-[220px] rounded-full bg-gradient-to-br from-cyan-400 to-pink-500 -translate-x-1/2 -translate-y-1/2 blur-[20px]" />

      <div className="absolute bottom-10 left-10">

        <h2 className="text-5xl font-black leading-none">

          Transmit
          <br />
          Beyond Words

        </h2>

      </div>

    </div>

  );

}