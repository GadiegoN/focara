import type { Foco } from "@/types/foco";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  foco: Foco;
};

export function FocoResult({ foco }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>F — Fato</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text whitespace-pre-wrap">{foco.fato}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>O — Objetivo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text whitespace-pre-wrap">
            {foco.objetivo}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>C — Condições</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text whitespace-pre-wrap">
            {foco.condicoes}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>O — Ok</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text whitespace-pre-wrap">{foco.ok}</p>
        </CardContent>
      </Card>
    </div>
  );
}
