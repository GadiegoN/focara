import { Card, CardContent } from "@/components/ui/card";
import { FocoForm } from "./_components/foco-form";
import { ThemeToggle } from "./_components/theme-toggle";

const focoBadges = ["Fato", "Objetivo", "Condições", "Ok"];

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-focara">
      <header className="border-b border-border bg-background/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-background shadow-[0_10px_30px_hsl(var(--shadow))]">
              <span className="text-sm font-extrabold">FO</span>
            </div>

            <div className="leading-tight">
              <div className="text-base font-semibold">FOCAra</div>
              <div className="text-xs text-muted-foreground">
                Método FOCO para prompts
              </div>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </header>

      <section className="px-4 pb-16 pt-10 md:pb-20 md:pt-14">
        <div className="mx-auto w-full max-w-4xl space-y-6">
          <div className="space-y-3 text-center">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Transforme uma ideia em prompt.
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Escreva sua solicitação e o FOCAra organiza em Fato, Objetivo,
              Condições e Ok.
            </p>
          </div>

          <Card className="border-border/60 shadow-none">
            <CardContent className="p-5 md:p-7">
              <FocoForm />
            </CardContent>
          </Card>

          <div className="flex flex-wrap justify-center gap-2">
            {focoBadges.map((item) => (
              <span key={item} className="badge">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
