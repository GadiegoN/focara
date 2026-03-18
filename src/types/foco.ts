export type Foco = {
  fato: string;
  objetivo: string;
  condicoes: string;
  ok: string;
};

export type GenerateFocoInput = {
  idea: string;
  audience?: string;
  outputFormat?: string;
  tone?: string;
  constraints?: string;
};

export type GenerateFocoOutput = {
  foco: Foco;
  prompt: string;
};
