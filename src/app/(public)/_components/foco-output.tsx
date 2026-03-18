"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FocoResult } from "./foco-result";
import type { Foco } from "@/types/foco";

type Props = {
  foco: Foco;
  prompt: string;
};

function formatFocoAsText(foco: Foco) {
  return [
    "FATO:",
    foco.fato,
    "",
    "OBJETIVO:",
    foco.objetivo,
    "",
    "CONDIÇÕES:",
    foco.condicoes,
    "",
    "OK:",
    foco.ok,
  ].join("\n");
}

export function FocoOutput({ foco, prompt }: Props) {
  const [copiedTarget, setCopiedTarget] = useState<"prompt" | "foco" | null>(
    null,
  );

  async function handleCopy(target: "prompt" | "foco") {
    const content = target === "prompt" ? prompt : formatFocoAsText(foco);
    await navigator.clipboard.writeText(content);
    setCopiedTarget(target);
    window.setTimeout(() => setCopiedTarget(null), 1400);
  }

  return (
    <div className="space-y-5">
      <div className="surface-2 p-4 md:p-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm font-extrabold text-text">Prompt gerado</div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => handleCopy("prompt")}>
              {copiedTarget === "prompt" ? "Prompt copiado" : "Copiar prompt"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCopy("foco")}
            >
              {copiedTarget === "foco" ? "FOCO copiado" : "Copiar FOCO"}
            </Button>
          </div>
        </div>

        <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-background/70 p-4 text-[13px] leading-relaxed text-text">
          {prompt}
        </pre>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-extrabold text-text">Estrutura FOCO</div>
          <span className="badge badge--success">Extraído</span>
        </div>

        <FocoResult foco={foco} />
      </div>
    </div>
  );
}
