import { Card, CardContent } from "@/components/ui/card";
import { FocoForm } from "./_components/foco-form";
import { ThemeToggle } from "./_components/theme-toggle";

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-focara">
      <header className="border-b border-border bg-background/60 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-md border border-border bg-background">
              <span className="text-sm font-extrabold">F</span>
            </div>

            <div className="leading-tight">
              <div className="text-sm font-semibold">FOCAra</div>
              <div className="text-xs text-muted-foreground">
                Método FOCO para instruções claras
              </div>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </header>

      <section className="px-4 py-12">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Transforme uma ideia em um prompt executável
            </h1>

            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              Escreva o que você quer. Eu organizo em{" "}
              <span className="font-medium text-foreground">
                Fato, Objetivo, Condições e Ok
              </span>
              .
            </p>
          </div>

          <Card className="border-border/50 shadow-none">
            <CardContent className="p-6 md:p-7">
              <div className="mb-4 space-y-1">
                <div className="text-sm font-medium text-foreground">
                  O que você precisa comunicar?
                </div>

                <div className="text-sm text-muted-foreground">
                  Descreva em linguagem natural. Você pode colar contexto,
                  regras e exemplos.
                </div>
              </div>

              <FocoForm />

              <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2">
                <span className="badge">
                  <b>F</b> Fato
                </span>

                <span className="badge">
                  <b>O</b> Objetivo
                </span>

                <span className="badge">
                  <b>C</b> Condições
                </span>

                <span className="badge">
                  <b>O</b> Ok
                </span>
              </div>
            </CardContent>
          </Card>

          <footer className="mt-8 text-xs text-muted-foreground">
            Dica: inclua restrições, público-alvo e formato desejado para sair
            melhor.
          </footer>
        </div>
      </section>
    </main>
  );
}
