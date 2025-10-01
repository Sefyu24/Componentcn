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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [variant, setVariant] = useState<variant>("destructive");
  const [borderRadius, setBorderRadius] = useState("md");
  const [bgColor, setBgColor] = useState("primary");
  const [textSize, setTextSize] = useState("sm");
  const [fontWeight, setFontWeight] = useState("medium");

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
              <AccordionTrigger>Select Variant</AccordionTrigger>
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
            <AccordionItem value="item-2">
              <AccordionTrigger>Modify Style</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Border Radius
                    </label>
                    <Select
                      value={borderRadius}
                      onValueChange={setBorderRadius}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select border radius" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="none">
                            None (rounded-none)
                          </SelectItem>
                          <SelectItem value="sm">Small (rounded-sm)</SelectItem>
                          <SelectItem value="md">
                            Medium (rounded-md)
                          </SelectItem>
                          <SelectItem value="lg">Large (rounded-lg)</SelectItem>
                          <SelectItem value="full">
                            Full (rounded-full)
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Background Color
                    </label>
                    <Select value={bgColor} onValueChange={setBgColor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select background color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="destructive">
                            Destructive
                          </SelectItem>
                          <SelectItem value="accent">Accent</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Text Size
                    </label>
                    <Select value={textSize} onValueChange={setTextSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select text size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="xs">
                            Extra Small (text-xs)
                          </SelectItem>
                          <SelectItem value="sm">Small (text-sm)</SelectItem>
                          <SelectItem value="base">Base (text-base)</SelectItem>
                          <SelectItem value="lg">Large (text-lg)</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Font Weight
                    </label>
                    <Select value={fontWeight} onValueChange={setFontWeight}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select font weight" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="normal">
                            Normal (font-normal)
                          </SelectItem>
                          <SelectItem value="medium">
                            Medium (font-medium)
                          </SelectItem>
                          <SelectItem value="semibold">
                            Semibold (font-semibold)
                          </SelectItem>
                          <SelectItem value="bold">Bold (font-bold)</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <TestComponent
            variant={variant}
            borderRadius={borderRadius}
            bgColor={bgColor}
            textSize={textSize}
            fontWeight={fontWeight}
          />
        </CardContent>
      </Card>
    </main>
  );
}
