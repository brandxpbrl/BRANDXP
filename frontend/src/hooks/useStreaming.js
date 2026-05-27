import { useState } from "react";

export default function useStreaming() {

  const [streaming, setStreaming] = useState(false);

  return {

    streaming,
    setStreaming

  };

}