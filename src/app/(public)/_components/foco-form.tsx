"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Foco, GenerateFocoInput, GenerateFocoOutput } from "@/types/foco";
import { FocoOutput } from "./foco-output";

type FormState = GenerateFocoInput;

type HistoryItem = {
  id: string;
  label: string;
  input: FormState;
  prompt: string;
  foco: Foco;
  createdAt: string;
};

const HISTORY_KEY = "focara:history";

const presets: Array<{ label: string; data: FormState }> = [
  {
    label: "Conteúdo",
    data: {
      idea: "Quero criar um prompt para gerar 10 ideias de posts sobre alimentação saudável.",
      audience: "Adultos entre 25 e 40 anos interessados em hábitos saudáveis.",
      outputFormat: "Lista com título, ângulo e CTA de cada post.",
      tone: "Direto, confiável e fácil de entender.",
      constraints: "Evitar promessas exageradas e linguagem técnica.",
    },
  },
  {
    label: "Estudo",
    data: {
      idea: "Preciso de um prompt para montar um plano de estudo de SQL em 30 dias.",
      audience: "Pessoa iniciante em dados.",
      outputFormat: "Plano semanal com tópicos, prática e revisão.",
      tone: "Didático e objetivo.",
      constraints: "Considerar 1 hora por dia e foco em prática.",
    },
  },
  {
    label: "Técnico",
    data: {
      idea: "Quero estruturar um pedido para implementar uma tela de cadastro de clientes.",
      audience: "Desenvolvedor frontend.",
      outputFormat: "Briefing técnico com escopo e critérios de aceite.",
      tone: "Claro, direto e profissional.",
      constraints: "Incluir responsividade, validações e estados de erro.",
    },
  },
];

async function requestFoco(input: FormState): Promise<GenerateFocoOutput> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
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

function emptyForm(): FormState {
  return {
    idea: "",
    audience: "",
    outputFormat: "",
    tone: "",
    constraints: "",
  };
}

function buildHistoryLabel(input: FormState) {
  const base = input.idea.trim();
  if (!base) return "Prompt sem título";
  return base.length > 56 ? `${base.slice(0, 56)}...` : base;
}

export function FocoForm() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [foco, setFoco] = useState<Foco | null>(null);
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved) as HistoryItem[];
      setHistory(Array.isArray(parsed) ? parsed.slice(0, 6) : []);
    } catch {}
  }, []);

  function updateField<Key extends keyof FormState>(
    key: Key,
    value: FormState[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function applyPreset(data: FormState) {
    setForm(data);
    setError(null);
  }

  function saveHistory(nextItem: HistoryItem) {
    const nextHistory = [
      nextItem,
      ...history.filter((item) => item.id !== nextItem.id),
    ].slice(0, 6);

    setHistory(nextHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
  }

  async function handleGenerate() {
    if (!form.idea.trim()) {
      setError("Escreva a solicitação principal antes de gerar.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await requestFoco(form);
      setFoco(data.foco);
      setPrompt(data.prompt);

      saveHistory({
        id: `${Date.now()}`,
        label: buildHistoryLabel(form),
        input: form,
        prompt: data.prompt,
        foco: data.foco,
        createdAt: new Date().toISOString(),
      });
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
    setForm(emptyForm());
    setFoco(null);
    setPrompt("");
    setError(null);
  }

  function restoreHistoryItem(item: HistoryItem) {
    setForm(item.input);
    setFoco(item.foco);
    setPrompt(item.prompt);
    setError(null);
  }

  return (
    <div className="space-y-6">
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-text">
          Solicitação principal
        </span>
        <Textarea
          value={form.idea}
          onChange={(e) => updateField("idea", e.currentTarget.value)}
          placeholder="Ex.: Quero um prompt para gerar uma sequência de e-mails de reativação para clientes inativos."
          className="min-h-40"
        />
      </label>

      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Modelos
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant="ghost"
              size="sm"
              onClick={() => applyPreset(preset.data)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm text-muted-foreground">Público</span>
          <Input
            value={form.audience}
            onChange={(e) => updateField("audience", e.currentTarget.value)}
            placeholder="Ex.: Pequenos negócios do setor de serviços"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-muted-foreground">Formato</span>
          <Input
            value={form.outputFormat}
            onChange={(e) => updateField("outputFormat", e.currentTarget.value)}
            placeholder="Ex.: Lista com 10 ideias, explicação e CTA"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm text-muted-foreground">Tom</span>
          <Input
            value={form.tone}
            onChange={(e) => updateField("tone", e.currentTarget.value)}
            placeholder="Ex.: Profissional, didático, direto"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-muted-foreground">Limites</span>
          <Input
            value={form.constraints}
            onChange={(e) => updateField("constraints", e.currentTarget.value)}
            placeholder="Ex.: Sem jargão técnico e até 800 palavras"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="md:min-w-40"
        >
          {loading ? "Gerando..." : "Gerar prompt FOCO"}
        </Button>

        <Button variant="ghost" onClick={handleClear} disabled={loading}>
          Limpar
        </Button>
      </div>

      {error && <div className="surface-2 p-4 text-sm text-danger">{error}</div>}

      {history.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-text">Recentes</div>
            <span className="badge">{history.length} salvos</span>
          </div>

          <div className="grid gap-2">
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => restoreHistoryItem(item)}
                className="surface-2 flex items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-surface"
              >
                <div>
                  <div className="text-sm font-medium text-text">
                    {item.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleString("pt-BR")}
                  </div>
                </div>
                <span className="badge badge--primary">Abrir</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {foco && prompt && <FocoOutput foco={foco} prompt={prompt} />}
    </div>
  );
}
