import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FocoForm } from "./_components/foco-form";

export default function HomePage() {
  return (
    <main className="bg-focara min-h-dvh px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight">FOCAra</h1>
            <p className="text-muted">
              Cole seu texto livre e gere um prompt no modelo FOCO.
            </p>
          </div>
          <span className="badge badge--primary">Next 16 • React 19</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gerador de Prompt FOCO</CardTitle>
            <p className="text-muted mt-2 text-sm">
              Escreva do jeito que vier. O app retorna um prompt estruturado
              para você colar na IA.
            </p>
          </CardHeader>

          <CardContent>
            <FocoForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
