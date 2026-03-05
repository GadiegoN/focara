"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function buildFocoPrompt(userText: string) {
  const trimmed = userText.trim();

  return [
    "Você é um assistente que transforma texto livre em um prompt no modelo FOCO.",
    "",
    "MODELO FOCO",
    "F — Função: defina seu papel e objetivo com clareza.",
    "O — Objetivo: o que deve ser entregue (resultado final).",
    "C — Contexto: informações relevantes, restrições, público, cenário.",
    "O — Output: formato de saída esperado (ex.: lista, tabela, código, passos).",
    "",
    "INSTRUÇÕES",
    "- Gere um prompt FOCO direto e sem código legado.",
    "- Faça perguntas somente se faltar informação essencial.",
    "- Mantenha linguagem clara e operacional.",
    "",
    "ENTRADA DO USUÁRIO (texto livre)",
    trimmed.length ? trimmed : "(vazio)",
    "",
    "AGORA: escreva o PROMPT FOCO final para eu copiar e colar, com seções F/O/C/O.",
  ].join("\n");
}

export function FocoForm() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(() => buildFocoPrompt(text), [text]);

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-text">
          Texto livre do usuário
        </span>
        <Textarea
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          placeholder='Ex.: "Quero um passo a passo para criar um CRUD com Next 16 + Prisma. Preciso de SSR nas páginas e forms em client components..."'
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted">
          O prompt é gerado automaticamente conforme você digita.
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setText("")}>
            Limpar
          </Button>
          <Button onClick={handleCopy}>{copied ? "Copiado!" : "Copiar"}</Button>
        </div>
      </div>

      <div className="surface-2 p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-semibold">Prompt FOCO gerado</div>
          <span className="badge badge--info">Output</span>
        </div>
        <pre className="whitespace-pre-wrap wrap-break-words text-[13px] leading-relaxed text-text">
          {prompt}
        </pre>
      </div>
    </div>
  );
}
