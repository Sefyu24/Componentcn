"use client";
import TestComponent from "@/components/test-component";
import { useState } from "react";
import { variant } from "@/components/test-component";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { hover } from "framer-motion";

interface ButtonStyleTypes {
  variant: variant;
  borderRadius: string;
  bgColor: string;
  textSize: string;
  fontWeight: string;
  hoversize: number[];
  tapsize: number[];
}

export default function Home() {
  const [buttonStyle, setButtonStyle] = useState<ButtonStyleTypes>({
    variant: "destructive" as variant,
    borderRadius: "md",
    bgColor: "none",
    textSize: "sm",
    fontWeight: "medium",
    hoversize: [1.2],
    tapsize: [1.2],
  });

  const setButtonConfig = <K extends keyof ButtonStyleTypes>(
    key: K,
    value: ButtonStyleTypes[K]
  ) => {
    setButtonStyle((prev) => ({ ...prev, [key]: value }));
  };

  const variants: variant[] = [
    "default",
    "link",
    "destructive",
    "outline",
    "secondary",
    "ghost",
  ];

  const borderRadiusOptions = [
    { value: "xs", label: "Extra Small (rounded-xs)" },
    { value: "sm", label: "Small (rounded-sm)" },
    { value: "md", label: "Medium (rounded-md)" },
    { value: "lg", label: "Large (rounded-lg)" },
    { value: "xl", label: "Extra Large (rounded-xl)" },
    { value: "2xl", label: "2X Large (rounded-2xl)" },
    { value: "full", label: "Full (rounded-full)" },
  ];

  return (
    <main className="m-5 p-4 border-amber-400 border-4 rounded-2xl shadow-2xl shadow-amber-200 inset-shadow-sm inset-shadow-red-400 ">
      <h1 className="flex justify-center text-2xl font-semibold border-4 border-red-400">
        In this page we are going to show how you can modify a component:{" "}
      </h1>

      {/* Here we will display the component and its source code to the right and to
      the left we will have all of our settings that we can play with to adjust tailwind css configs
      and other things like that in our component 
      */}

      <div className="border-red m-4 border-4 md:flex justify-between">
        <Card
          className="flex mb-2 md:mb-0 flex-col gap-4 border-8 border-rose-200"
          defaultValue="item-1"
        >
          <CardContent>
            {/* Here Im going to add all options to customize the button with tailwind and motion */}
            <div className="border-4 border-amber-300 p-4 flex flex-col gap-2 mb-4">
              <Label>Rounded Borders</Label>
              <Select
                value={buttonStyle.borderRadius}
                onValueChange={(v) => setButtonConfig("borderRadius", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select the border radius" />
                </SelectTrigger>
                <SelectContent>
                  {borderRadiusOptions.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="border-4 border-amber-300 p-4 flex flex-col gap-2 mb-4">
              <Label>Variants component</Label>
              <Select
                value={buttonStyle.variant}
                onValueChange={(v: variant) => setButtonConfig("variant", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select the border radius" />
                </SelectTrigger>
                <SelectContent>
                  {variants.map((v: variant) => (
                    <SelectItem value={v} key={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="border-4 border-green-500 p-4 flex flex-col gap-2 mb-4">
              <Label>Hover Size </Label>
              <Slider
                defaultValue={buttonStyle.hoversize}
                max={3}
                step={0.1}
                onValueChange={(v) => setButtonConfig("hoversize", v)}
              ></Slider>
              <Label>Current size: {buttonStyle.hoversize}</Label>
            </div>

            <div className="border-4 border-blue-600 p-4 flex flex-col gap-2">
              <Label>While Tap size </Label>
              <Slider
                defaultValue={buttonStyle.tapsize}
                max={3}
                step={0.1}
                onValueChange={(v) => setButtonConfig("tapsize", v)}
              ></Slider>
              <Label>Current size: {buttonStyle.tapsize}</Label>
            </div>
          </CardContent>
        </Card>

        {/*Current test component that is rendered to show the changes */}
        <div className="border-4 flex justify-center items-center w-full">
          <TestComponent
            variant={buttonStyle.variant}
            borderRadius={buttonStyle.borderRadius}
            textSize={buttonStyle.textSize}
            fontWeight={buttonStyle.fontWeight}
            whileHover={{ scale: buttonStyle.hoversize[0] }}
            whileTap={{ scale: buttonStyle.tapsize[0] }}
            ismotionActivated={true}
          />
        </div>
      </div>
    </main>
  );
}
