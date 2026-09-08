import { ImageResponse } from "next/og";
export const alt = "FERINHA CULTURAL — Mostrar, descubrir, conectar y disfrutar";
export const size = {width:1200,height:630};
export const contentType = "image/png";
export default function Image(){return new ImageResponse(<div style={{display:"flex",flexDirection:"column",justifyContent:"space-between",width:"100%",height:"100%",background:"#087c9d",color:"#ffffff",padding:"64px"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:20}}><span>ORBIS / CULTURA EN COMUNIDAD</span><span>UN PROYECTO ITINERANTE</span></div><div style={{display:"flex",flexDirection:"column",fontSize:110,lineHeight:1,letterSpacing:-5}}><span>FERINHA</span><span style={{background:"#bd005e",padding:"0 18px"}}>CULTURAL ↗</span></div><div style={{fontSize:28,color:"#fff29a"}}>Un espacio para mostrar, descubrir, conectar y disfrutar.</div></div>,size);}

