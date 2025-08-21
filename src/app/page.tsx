
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Bot, FastForward, ScanText } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Count Words & Transform Text with AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    WordWise Counter is your go-to tool for instant word and character counts, plus powerful AI-driven text modifications.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/word-counter">
                    <Button size="lg">Get Started</Button>
                  </Link>
                </div>
              </div>
              <img
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="abstract technology"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Write Better</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From basic counting to advanced AI transformations, WordWise Counter has you covered.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold flex items-center gap-2"><ScanText/>Instant Counts</h3>
                      <p className="text-muted-foreground">
                        Get immediate word and character counts as you type or paste text.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold flex items-center gap-2"><Bot/>AI-Powered Modifications</h3>
                      <p className="text-muted-foreground">
                        Summarize, change length, simplify, or even make your text more creative with a single click.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold flex items-center gap-2"><FastForward/>Efficient Workflow</h3>
                      <p className="text-muted-foreground">
                        Easily copy, clear, or swap your modified text back for further editing.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <img
                src="https://placehold.co/600x500.png"
                width="600"
                height="500"
                alt="Features"
                 data-ai-hint="writer computer"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2025 WordWise Counter. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
