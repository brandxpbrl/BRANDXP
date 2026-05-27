export default function SystemOutput({

  response

}) {

  return (

    <div className="rounded-[36px] border border-white/10 bg-black/30 p-7">

      <h2 className="text-2xl font-bold mb-6">
        Generated Intelligence
      </h2>

      <div className="rounded-2xl border border-white/10 bg-black/30 p-5 whitespace-pre-line text-white/70">

        {response}

      </div>

    </div>

  );

}