
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Bot, FastForward, ScanText } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { motion } from "framer-motion";


const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeInOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1 pt-14">
        <section className="w-full py-24 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6">
            <motion.div 
              className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div className="flex flex-col justify-center space-y-4" variants={fadeIn}>
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
              </motion.div>
              <motion.img
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="abstract technology"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                variants={fadeIn}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </motion.div>
          </div>
        </section>

        <motion.section 
          id="features" 
          className="w-full py-16 md:py-24 lg:py-32 bg-muted/40"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div className="space-y-2" variants={fadeIn}>
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Write Better</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From basic counting to advanced AI transformations, WordWise Counter has you covered.
                </p>
              </motion.div>
            </div>
            <motion.div 
              className="mx-auto grid max-w-sm gap-8 pt-12 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3"
              variants={staggerContainer}
            >
              <motion.div variants={fadeIn}>
                <Card className="bg-background/50 h-full">
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
              </motion.div>
              <motion.div variants={fadeIn}>
                <Card className="bg-background/50 h-full">
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
              </motion.div>
              <motion.div variants={fadeIn}>
                <Card className="bg-background/50 h-full">
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
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
        
        <motion.section 
          id="faq" 
          className="w-full py-16 md:py-24 lg:py-32"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div className="space-y-2" variants={fadeIn}>
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">FAQ</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Have questions? We've got answers.
                </p>
              </motion.div>
            </div>
            <motion.div className="mx-auto mt-12 w-full max-w-3xl" variants={fadeIn}>
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
            </motion.div>
          </div>
        </motion.section>

        <motion.section 
          className="w-full py-16 md:py-24 lg:py-32 border-t"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ready to elevate your writing?</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Unlock the full potential of your text with our powerful and intuitive tools. Click the button below to start counting and modifying your words.
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <Link href="/word-counter">
                <Button size="lg">Start Modifying</Button>
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2025 WordWise Counter. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
