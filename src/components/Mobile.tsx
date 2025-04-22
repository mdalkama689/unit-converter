"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GrPowerReset } from "react-icons/gr";

const unitTypes = {
  length: ["meter", "kilometer", "centimeter", "mile", "inch", "foot"],
  weight: ["kilogram", "gram", "pound", "ounce"],
  temperature: ["celsius", "fahrenheit", "kelvin"],
  volume: ["liter", "milliliter", "gallon", "cubic_meter"],
};

const conversionRates: Record<
  string,
  Record<string, (value: number) => number>
> = {
  length: {
    meter: (v) => v,
    kilometer: (v) => v / 1000,
    centimeter: (v) => v * 100,
    mile: (v) => v * 0.000621371,
    inch: (v) => v * 39.3701,
    foot: (v) => v * 3.28084,
  },
  weight: {
    kilogram: (v) => v,
    gram: (v) => v * 1000,
    pound: (v) => v * 2.20462,
    ounce: (v) => v * 35.274,
  },
  temperature: {
    celsius: (v) => v,
    fahrenheit: (v) => (v * 9) / 5 + 32,
    kelvin: (v) => v + 273.15,
  },
  volume: {
    liter: (v) => v,
    milliliter: (v) => v * 1000,
    gallon: (v) => v * 0.264172,
    cubic_meter: (v) => v / 1000,
  },
};

export default function Mobile() {
  const [unitType, setUnitType] = useState<keyof typeof unitTypes>("length");
  const [fromUnit, setFromUnit] = useState<string>("");
  const [toUnit, setToUnit] = useState<string>("");
  const [inputValue, setInputValue] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);

  const handleConvert = () => {
    if (!fromUnit || !toUnit || inputValue === null) {
      return toast.error("All fields are required!");
    }

    const baseValue = Object.entries(conversionRates[unitType]).find(
      ([key]) => key === fromUnit
    )?.[1](inputValue);

    const finalValue = Object.entries(conversionRates[unitType]).find(
      ([key]) => key === toUnit
    )?.[1](baseValue ?? 0);

    if (finalValue !== undefined) {
      setResult(Number(finalValue.toFixed(4)));
      toast.success("Conversion successful!");
    } else {
      toast.error("Conversion failed.");
    }
  };

  const resetValue = () => {
    setUnitType("length");
    setFromUnit("");
    setToUnit("");
    setInputValue(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen  bg-black  text-white py-6 px-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md md:max-w-lg bg-zinc-900 border border-zinc-700 shadow-xl rounded-2xl">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-xl font-bold text-white">
            Unit Converter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-2">
            <Label className="text-white">Unit Type</Label>
            <Select
              value={unitType}
              onValueChange={(val) => {
                setUnitType(val as keyof typeof unitTypes);
                setFromUnit("");
                setToUnit("");
              }}
            >
              <SelectTrigger className="w-full bg-zinc-800 border-zinc-600 text-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                <SelectGroup>
                  {Object.keys(unitTypes).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label className="text-white">From</Label>
            <Select value={fromUnit} onValueChange={(val) => setFromUnit(val)}>
              <SelectTrigger className="w-full bg-zinc-800 border-zinc-600 text-white">
                <SelectValue placeholder="From unit" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                <SelectGroup>
                  {unitTypes[unitType].map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label className="text-white">To</Label>
            <Select value={toUnit} onValueChange={(val) => setToUnit(val)}>
              <SelectTrigger className="w-full bg-zinc-800 border-zinc-600 text-white">
                <SelectValue placeholder="To unit" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                <SelectGroup>
                  {unitTypes[unitType].map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label className="text-white">Value</Label>
            <input
              type="number"
              value={inputValue ?? ""}
              onChange={(e) => setInputValue(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-600 text-white px-3 py-2 rounded-md"
              placeholder="Enter value"
            />
          </div>

          <div className="flex justify-center items-center gap-3">
            <Button
              className="w-[90%] bg-blue-600 hover:bg-blue-700 cursor-pointer"
              onClick={handleConvert}
            >
              Convert
            </Button>
            <GrPowerReset
              onClick={resetValue}
              className="w-fit text-white font-bold text-2xl cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      {result !== null && (
        <div className="bg-zinc-900 text-white p-4 mt-6 md:ml-10 rounded-lg border border-zinc-700 w-full md:max-w-sm text-center space-y-2">
          <p className="text-xl font-semibold text-blue-400">
            Converted Result
          </p>
          <p>
            Result: <span className="text-blue-400">{result}</span> {toUnit}
          </p>
        </div>
      )}
    </div>
  );
}
