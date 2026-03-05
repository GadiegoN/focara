import { NextResponse } from "next/server";
import type { GenerateFocoInput, GenerateFocoOutput, Foco } from "@/types/foco";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-4o-mini";

type LlmJson = {
  foco: Foco;
};

function buildLlmPrompt(idea: string) {
  return [
    "Você é um especialista em estruturar ideias usando o Método FOCO.",
    "",
    "O Método FOCO organiza qualquer pedido em quatro partes:",
    "- FATO: contexto atual, observável, sem opiniões (responda: onde estamos agora?)",
    "- OBJETIVO: o que exatamente deve ser entregue (use verbos de ação)",
    "- CONDIÇÕES: regras, formato, estilo, limitações",
    "- OK: critérios objetivos para validar se a tarefa foi concluída",
    "",
    "TAREFA:",
    "Transforme a ideia abaixo em um prompt estruturado no formato FOCO.",
    "O prompt gerado deve estar pronto para ser usado por outra pessoa ou IA executar a tarefa.",
    "",
    "IDEIA:",
    idea.trim(),
    "",
    "REGRAS OBRIGATÓRIAS:",
    "- A saída deve conter exatamente quatro seções: FATO, OBJETIVO, CONDIÇÕES e OK",
    "- Cada seção deve conter apenas informação necessária e objetiva",
    "- O FATO deve descrever o contexto atual sem opiniões ou julgamentos",
    "- O OBJETIVO deve definir claramente o entregável utilizando verbos de ação",
    "- As CONDIÇÕES devem especificar regras de formato, tamanho, estilo ou limitações",
    "- O OK deve definir critérios objetivos que permitam verificar se a tarefa foi concluída corretamente",
    "- Não incluir explicações sobre o método FOCO",
    "- Não adicionar comentários, justificativas ou texto fora das quatro seções",
    "- Linguagem clara, técnica e direta",
    "- Use o formato exato abaixo:",
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
    "",
    "A resposta é considerada correta quando:",
    "- a saída contém apenas as quatro seções do método FOCO",
    "- cada seção está claramente definida e separada",
    "- o prompt gerado pode ser usado diretamente por outra IA sem necessidade de edição",
    "- não existem explicações adicionais fora da estrutura FOCO",
  ].join("\n");
}

function extractFocoFromPrompt(promptContent: string): Foco | null {
  const lines = promptContent.split("\n");
  let currentSection: string | null = null;
  let fato: string[] = [];
  let objetivo: string[] = [];
  let condicoes: string[] = [];
  let ok: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("FATO:") || trimmedLine.startsWith("FATO")) {
      currentSection = "fato";
      continue;
    } else if (
      trimmedLine.startsWith("OBJETIVO:") ||
      trimmedLine.startsWith("OBJETIVO")
    ) {
      currentSection = "objetivo";
      continue;
    } else if (
      trimmedLine.startsWith("CONDIÇÕES:") ||
      trimmedLine.startsWith("CONDICOES:") ||
      trimmedLine.startsWith("CONDIÇÕES")
    ) {
      currentSection = "condicoes";
      continue;
    } else if (trimmedLine.startsWith("OK:") || trimmedLine.startsWith("OK")) {
      currentSection = "ok";
      continue;
    }

    if (currentSection && trimmedLine && !trimmedLine.startsWith("---")) {
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

    if (fatoMatch) fato = [fatoMatch[1].trim()];
    if (objetivoMatch) objetivo = [objetivoMatch[1].trim()];
    if (condicoesMatch) condicoes = [condicoesMatch[1].trim()];
    if (okMatch) ok = [okMatch[1].trim()];
  }

  if (fato.length === 0 || objetivo.length === 0) {
    return null;
  }

  return {
    fato: fato.join("\n").trim(),
    objetivo: objetivo.join("\n").trim(),
    condicoes: condicoes.join("\n").trim() || "Sem condições específicas",
    ok: ok.join("\n").trim() || "Prompt gerado conforme especificado",
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
      return NextResponse.json({ error: "Idea is required" }, { status: 400 });
    }

    const llmPrompt = buildLlmPrompt(body.idea);

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "focara",
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
        { error: "Erro na chamada da LLM", details: text },
        { status: 500 },
      );
    }

    const data = await response.json();
    const generatedPrompt: string = data?.choices?.[0]?.message?.content ?? "";

    const extractedFoco = extractFocoFromPrompt(generatedPrompt);

    if (!extractedFoco) {
      const result: GenerateFocoOutput = {
        foco: {
          fato: "Não foi possível extrair estrutura",
          objetivo: "Não foi possível extrair estrutura",
          condicoes: "Não foi possível extrair estrutura",
          ok: "Não foi possível extrair estrutura",
        },
        prompt: generatedPrompt,
      };
      return NextResponse.json(result);
    }

    const result: GenerateFocoOutput = {
      foco: extractedFoco,
      prompt: generatedPrompt,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Falha interna ao gerar FOCO." },
      { status: 500 },
    );
  }
}
