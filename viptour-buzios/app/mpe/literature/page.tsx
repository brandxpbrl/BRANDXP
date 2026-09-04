import type {Metadata} from "next";
import MpeLiterarySurface from "./MpeLiterarySurface";

export const metadata:Metadata={
 title:"MPE Literary Organ | ORBIS",
 description:"Explora estados narrativos, continuidad y posibilidades de escena sin confundir generación con canon.",
};

export default function MpeLiteraturePage(){return <MpeLiterarySurface/>;}
