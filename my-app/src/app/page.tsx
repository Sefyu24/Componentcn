"use client";
import TestComponent from "@/components/test-component";
import { useState } from "react";
import { variant } from "@/components/test-component";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [variant, setVariant] = useState<variant>("destructive");
  const variants: variant[] = [
    "default",
    "link",
    "destructive",
    "outline",
    "secondary",
    "ghost",
  ];

  return (
    <main className="mt-5">
      <h1 className="flex justify-center text-2xl font-semibold">
        In this page we are going to show how you can modify a component:{" "}
      </h1>

      {/* Here we will display the component and its source code to the right and to
      the left we will have all of our settings that we can play with to adjust tailwind css configs
      and other things like that in our component 
      */}

      <Card className="flex w-auto" defaultValue="item-1">
        <CardContent className="flex col-2 justify-between">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Hello</AccordionTrigger>
              <AccordionContent>
                <Select
                  value={variant}
                  onValueChange={(value) => setVariant(value as variant)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="please select a variant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {variants.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}{" "}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <TestComponent variant={variant} />
        </CardContent>
      </Card>
    </main>
  );
}
