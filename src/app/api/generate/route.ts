import { NextResponse } from "next/server";
import type {
  GenerateFocoInput,
  GenerateFocoOutput,
  Foco,
} from "@/types/foco";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-4o-mini";

function buildIdeaBlock(input: GenerateFocoInput) {
  const sections = [
    `IDEIA PRINCIPAL:\n${input.idea.trim()}`,
    input.audience?.trim()
      ? `PÚBLICO-ALVO:\n${input.audience.trim()}`
      : null,
    input.outputFormat?.trim()
      ? `FORMATO DE SAÍDA DESEJADO:\n${input.outputFormat.trim()}`
      : null,
    input.tone?.trim() ? `TOM/ESTILO:\n${input.tone.trim()}` : null,
    input.constraints?.trim()
      ? `REGRAS, LIMITES OU CONTEXTO EXTRA:\n${input.constraints.trim()}`
      : null,
  ];

  return sections.filter(Boolean).join("\n\n");
}

function buildLlmPrompt(input: GenerateFocoInput) {
  return [
    "Você é um especialista em estruturar pedidos usando o Método FOCO.",
    "",
    "O Método FOCO organiza qualquer pedido em quatro partes:",
    "- FATO: contexto atual, observável, sem opiniões",
    "- OBJETIVO: o que deve ser entregue, com verbo de ação",
    "- CONDIÇÕES: regras, formato, estilo, limitações e preferências",
    "- OK: critérios objetivos para validar o resultado",
    "",
    "TAREFA:",
    "Transforme as informações abaixo em um prompt estruturado no formato FOCO.",
    "O resultado deve estar pronto para ser usado por outra pessoa ou por outra IA executar a tarefa.",
    "",
    buildIdeaBlock(input),
    "",
    "REGRAS OBRIGATÓRIAS:",
    "- A saída deve conter exatamente quatro seções: FATO, OBJETIVO, CONDIÇÕES e OK",
    "- Cada seção deve conter apenas informação útil, específica e objetiva",
    "- O FATO deve descrever o contexto atual sem julgamento",
    "- O OBJETIVO deve definir claramente o entregável",
    "- As CONDIÇÕES devem incluir formato, tamanho, estilo, restrições e público quando isso for relevante",
    "- O OK deve permitir verificar se a tarefa foi concluída corretamente",
    "- Não explique o método FOCO",
    "- Não adicione comentários extras antes ou depois das quatro seções",
    "- Linguagem clara, profissional e direta",
    "",
    "Use este formato exato:",
    "",
    "FATO:",
    "[contexto factual aqui]",
    "",
    "OBJETIVO:",
    "[entregável aqui com verbo de ação]",
    "",
    "CONDIÇÕES:",
    "[regras e limites aqui]",
    "",
    "OK:",
    "[critérios de validação aqui]",
  ].join("\n");
}

function extractFocoFromPrompt(promptContent: string): Foco | null {
  const lines = promptContent.split("\n");
  let currentSection: string | null = null;
  const fato: string[] = [];
  const objetivo: string[] = [];
  const condicoes: string[] = [];
  const ok: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("FATO:") || trimmedLine === "FATO") {
      currentSection = "fato";
      continue;
    }

    if (trimmedLine.startsWith("OBJETIVO:") || trimmedLine === "OBJETIVO") {
      currentSection = "objetivo";
      continue;
    }

    if (
      trimmedLine.startsWith("CONDIÇÕES:") ||
      trimmedLine.startsWith("CONDICOES:") ||
      trimmedLine === "CONDIÇÕES" ||
      trimmedLine === "CONDICOES"
    ) {
      currentSection = "condicoes";
      continue;
    }

    if (trimmedLine.startsWith("OK:") || trimmedLine === "OK") {
      currentSection = "ok";
      continue;
    }

    if (!currentSection || !trimmedLine || trimmedLine.startsWith("---")) {
      continue;
    }

    switch (currentSection) {
      case "fato":
        fato.push(line);
        break;
      case "objetivo":
        objetivo.push(line);
        break;
      case "condicoes":
        condicoes.push(line);
        break;
      case "ok":
        ok.push(line);
        break;
    }
  }

  if (
    fato.length === 0 &&
    objetivo.length === 0 &&
    condicoes.length === 0 &&
    ok.length === 0
  ) {
    const fatoMatch = promptContent.match(
      /\[F\]\s*FATO:?\s*([\s\S]*?)(?=\[O\]|$)/i,
    );
    const objetivoMatch = promptContent.match(
      /\[O\]\s*OBJETIVO:?\s*([\s\S]*?)(?=\[C\]|$)/i,
    );
    const condicoesMatch = promptContent.match(
      /\[C\]\s*CONDIÇÕES:?\s*([\s\S]*?)(?=\[O\]\s*OK|$)/i,
    );
    const okMatch = promptContent.match(/\[O\]\s*OK:?\s*([\s\S]*?)(?=$)/i);

    if (fatoMatch) fato.push(fatoMatch[1].trim());
    if (objetivoMatch) objetivo.push(objetivoMatch[1].trim());
    if (condicoesMatch) condicoes.push(condicoesMatch[1].trim());
    if (okMatch) ok.push(okMatch[1].trim());
  }

  if (fato.length === 0 || objetivo.length === 0) {
    return null;
  }

  return {
    fato: fato.join("\n").trim(),
    objetivo: objetivo.join("\n").trim(),
    condicoes: condicoes.join("\n").trim() || "Sem condições específicas.",
    ok: ok.join("\n").trim() || "Prompt estruturado conforme solicitado.",
  };
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY não configurada no servidor." },
        { status: 500 },
      );
    }

    const body = (await req.json()) as GenerateFocoInput;

    if (!body.idea || body.idea.trim().length === 0) {
      return NextResponse.json(
        { error: "Descreva a ideia antes de gerar o FOCO." },
        { status: 400 },
      );
    }

    const llmPrompt = buildLlmPrompt(body);

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-OpenRouter-Title": "focara",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        max_tokens: 900,
        messages: [
          {
            role: "system",
            content:
              "Você é um especialista no Método FOCO. Gere prompts estruturados seguindo rigorosamente o formato solicitado.",
          },
          { role: "user", content: llmPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OPENROUTER ERROR:", text);
      return NextResponse.json(
        { error: "Erro na chamada da LLM.", details: text },
        { status: 500 },
      );
    }

    const data = await response.json();
    const generatedPrompt: string = data?.choices?.[0]?.message?.content ?? "";
    const extractedFoco = extractFocoFromPrompt(generatedPrompt);

    if (!extractedFoco) {
      const fallback = "Não foi possível extrair a estrutura FOCO.";

      const result: GenerateFocoOutput = {
        foco: {
          fato: fallback,
          objetivo: fallback,
          condicoes: fallback,
          ok: fallback,
        },
        prompt: generatedPrompt,
      };

      return NextResponse.json(result);
    }

    return NextResponse.json({
      foco: extractedFoco,
      prompt: generatedPrompt,
    } satisfies GenerateFocoOutput);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Falha interna ao gerar FOCO." },
      { status: 500 },
    );
  }
}
