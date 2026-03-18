import type { Foco } from "@/types/foco";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  foco: Foco;
};

const sections = [
  {
    key: "fato",
    title: "F — Fato",
    description: "Contexto",
  },
  {
    key: "objetivo",
    title: "O — Objetivo",
    description: "Entrega",
  },
  {
    key: "condicoes",
    title: "C — Condições",
    description: "Regras e formato",
  },
  {
    key: "ok",
    title: "O — Ok",
    description: "Validação",
  },
] as const satisfies Array<{
  key: keyof Foco;
  title: string;
  description: string;
}>;

export function FocoResult({ foco }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sections.map((section) => (
        <Card key={section.key} className="border-border/60 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">{section.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {section.description}
            </p>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-6 text-text">
              {foco[section.key]}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
