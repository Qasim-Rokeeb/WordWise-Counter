
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Bot, FastForward, ScanText } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full pt-24 md:pt-32 lg:pt-40 xl:pt-56">
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
            <div className="mx-auto grid max-w-sm gap-8 pt-12 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              <Card className="bg-background/50">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                        <ScanText className="h-6 w-6"/>
                    </div>
                  <CardTitle>Instant Counts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get immediate word and character counts as you type or paste text, helping you stay on track with your writing goals.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background/50">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                    <Bot className="h-6 w-6"/>
                  </div>
                  <CardTitle>AI Modifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Summarize, change length, simplify, or even make your text more creative with a single click.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background/50">
                <CardHeader className="flex flex-row items-center gap-4">
                   <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                    <FastForward className="h-6 w-6"/>
                   </div>
                  <CardTitle>Efficient Workflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Easily copy, clear, or swap your modified text back into the editor for a seamless and productive writing experience.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">FAQ</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Have questions? We've got answers.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 w-full max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is WordWise Counter?</AccordionTrigger>
                  <AccordionContent>
                    WordWise Counter is a simple and efficient web application that allows you to easily count the number of words and characters in any text. It also offers AI-powered text modifications to enhance your writing.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I use the AI modifications?</AccordionTrigger>
                  <AccordionContent>
                    Simply paste your text into the text area, select the modification you want to apply from the dropdown menu (e.g., summarize, change length), configure any options, and click the "Modify Text" button to see the result.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is my data saved on your servers?</AccordionTrigger>
                  <AccordionContent>
                    No, WordWise Counter respects your privacy. All text processing is done in real-time, and we do not store your text on our servers.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I apply multiple modifications at once?</AccordionTrigger>
                  <AccordionContent>
                    Yes! You can chain multiple modifications together. Simply click "Add Modification" to add another step to the process. The modifications will be applied sequentially to your text.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2025 WordWise Counter. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
