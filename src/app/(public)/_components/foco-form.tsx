"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Foco, GenerateFocoOutput } from "@/types/foco";
import { FocoOutput } from "./foco-output";

async function requestFoco(idea: string): Promise<GenerateFocoOutput> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea }),
  });

  if (!response.ok) {
    let details = "";
    try {
      const data = (await response.json()) as {
        error?: string;
        details?: string;
      };
      details = data?.error ?? data?.details ?? "";
    } catch {}
    throw new Error(details || "Falha ao gerar FOCO.");
  }

  return (await response.json()) as GenerateFocoOutput;
}

export function FocoForm() {
  const [text, setText] = useState("");
  const [foco, setFoco] = useState<Foco | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    const idea = text.trim();
    if (!idea) {
      setError("Escreva uma ideia antes de gerar.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await requestFoco(idea);
      setFoco(data.foco);
      setPrompt(data.prompt);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Não foi possível gerar o prompt.";
      setError(message);
      setFoco(null);
      setPrompt("");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setText("");
    setFoco(null);
    setPrompt("");
    setError(null);
  }

  return (
    <div className="space-y-6">
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-text">
          Escreva sua ideia
        </span>
        <Textarea
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          placeholder="Ex.: Quero um sistema para registrar consumo de fraldas e prever compra bimestral."
        />
      </label>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "Gerando..." : "Gerar"}
        </Button>

        <Button variant="ghost" onClick={handleClear} disabled={loading}>
          Limpar
        </Button>

        {loading && (
          <span className="text-sm text-muted sm:ml-2">Chamando a IA...</span>
        )}
      </div>

      {error && (
        <div className="surface-2 p-4 text-sm text-danger">{error}</div>
      )}

      {foco && prompt && <FocoOutput foco={foco} prompt={prompt} />}
    </div>
  );
}
