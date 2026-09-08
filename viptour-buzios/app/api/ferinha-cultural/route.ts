import { participationTypes, interests } from "@/config/ferinha";

// Fail closed: no persistence service for FERINHA exists in this repository.
// Connect an approved durable adapter here; see docs/ferinha-cultural.md.
export async function POST(request: Request) {
  const reply = (error: string, status: number) => Response.json({ accepted: false, error }, { status, headers: { "Cache-Control": "no-store" } });
  // Next may normalize request.url to localhost behind the deployment proxy.
  // Compare the browser origin with the incoming Host, never a client-supplied destination.
  try {
    const origin = new URL(request.headers.get("origin") || "");
    if(!["http:", "https:"].includes(origin.protocol) || origin.host !== request.headers.get("host")) return reply("origin_not_allowed",403);
  } catch { return reply("origin_not_allowed",403); }
  if(!request.headers.get("content-type")?.startsWith("application/json")) return reply("unsupported_media_type",415);
  if(Number(request.headers.get("content-length"))>16000) return reply("payload_too_large",413);
  const reader=request.body?.getReader();
  if(!reader) return reply("invalid_payload",400);
  let raw=""; let bytes=0; const decoder=new TextDecoder();
  try {
    while(true){const {done,value}=await reader.read();if(done) break;bytes+=value.byteLength;if(bytes>16000){await reader.cancel();return reply("payload_too_large",413);}raw+=decoder.decode(value,{stream:true});}
    raw+=decoder.decode();
    const data=JSON.parse(raw);
    if(!data || typeof data!=="object" || Array.isArray(data)) return reply("invalid_payload",400);
    const validText=(key:string,min:number,max:number)=>typeof data[key]==="string" && data[key].trim().length>=min && data[key].length<=max;
    if(!validText("name",2,120)||!validText("city",2,120)||!validText("description",10,2000)||!validText("whatsapp",7,25)||!/[0-9]{7,}/.test(data.whatsapp.replace(/\D/g,""))||!validText("project",0,150)||!validText("website",0,250)||!validText("share",0,2000)||!validText("contribution",0,2000)||!participationTypes.includes(data.type)||data.consent!==true||!Array.isArray(data.interests)||data.interests.length<1||data.interests.length>interests.length||!data.interests.every((item:typeof interests[number])=>interests.includes(item))) return reply("invalid_fields",400);
    return reply("registration_not_configured",503);
  } catch {return reply("invalid_payload",400);}
}
