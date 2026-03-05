"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FocoResult } from "./foco-result";
import type { Foco } from "@/types/foco";

type Props = {
  foco: Foco;
  prompt: string;
};

export function FocoOutput({ foco, prompt }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="space-y-4">
      <div className="surface-2 p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="text-sm font-extrabold text-text">
            Prompt final (executável)
          </div>
          <Button size="sm" onClick={handleCopy}>
            {copied ? "Copiado!" : "Copiar"}
          </Button>
        </div>

        <pre className="whitespace-pre-wrap wrap-break-words text-[13px] leading-relaxed text-text">
          {prompt}
        </pre>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-extrabold text-text">FOCO (estrutura)</div>
        <FocoResult foco={foco} />
      </div>
    </div>
  );
}
