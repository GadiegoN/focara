import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FocoForm } from "./_components/foco-form";
import { ThemeToggle } from "./_components/theme-toggle";

export default function HomePage() {
  return (
    <main className="bg-focara min-h-dvh">
      <header className="sticky top-0 z-10 border-b border-border bg-background/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="surface-2 grid h-10 w-10 place-items-center rounded-lg">
              <span className="text-lg font-extrabold">F</span>
            </div>
            <div className="leading-tight">
              <div className="text-base font-extrabold">FOCAra</div>
              <div className="text-sm text-muted-foreground">
                Transforme ideias confusas em instruções claras
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="badge badge--primary">Next 16 • React 19</span>
          </div>
        </div>
      </header>

      <section className="px-4 py-10">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-8 grid gap-3">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              De uma ideia solta a um prompt executável
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg">
              O Método FOCO organiza seus pedidos em quatro etapas:
              <span className="font-semibold">
                {" "}
                Fato, Objetivo, Condições e Ok
              </span>
              . Digite sua ideia abaixo e receba um prompt estruturado, pronto
              para usar em qualquer IA.
            </p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader className="border-b border-border/50 bg-muted/5 pb-6">
              <CardTitle className="text-2xl">Qual é a sua ideia?</CardTitle>
              <p className="text-muted-foreground mt-1.5 text-base">
                Descreva o que você precisa — quanto mais detalhes, mais preciso
                será o prompt gerado.
              </p>
            </CardHeader>

            <CardContent className="pt-6">
              <FocoForm />
            </CardContent>
          </Card>

          <div className="mt-8 grid grid-cols-1 gap-4 text-sm text-muted-foreground md:grid-cols-4">
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                F
              </span>
              <span>Fato: contexto atual</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                O
              </span>
              <span>Objetivo: entregável</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                C
              </span>
              <span>Condições: regras</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                O
              </span>
              <span>Ok: critérios de sucesso</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
