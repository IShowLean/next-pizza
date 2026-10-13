"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "cn";
import React, { useState } from "react";

type SliderProps = Omit<
  SliderPrimitive.Root.Props<readonly number[]>,
  | "children"
  | "className"
  | "defaultValue"
  | "min"
  | "max"
  | "step"
  | "orientation"
  | "value"
  | "onValueChange"
> & {
  className?: string;
  min: number;
  max: number;
  step: number;
  formatLabel?: (value: number) => string;
  value?: readonly number[];
  onValueChange?: (values: number[]) => void;
  ref?: React.Ref<HTMLDivElement>;
};

export function RangeSlider({
  className,
  min,
  max,
  step,
  formatLabel,
  value,
  onValueChange,
  ref,
  ...props
}: SliderProps) {
  const incomingValues = value ?? [min, max];
  const [localValues, setLocalValues] = useState<number[]>(() =>
    Array.from(incomingValues),
  );
  const [previousInput, setPreviousInput] = useState(() => ({
    min,
    max,
    values: Array.from(incomingValues),
  }));

  if (
    min !== previousInput.min ||
    max !== previousInput.max ||
    incomingValues.length !== previousInput.values.length ||
    incomingValues.some(
      (currentValue, index) => currentValue !== previousInput.values[index],
    )
  ) {
    const nextValues = Array.from(incomingValues);
    setPreviousInput({ min, max, values: nextValues });
    setLocalValues(nextValues);
  }

  const handleValueChange = (newValues: readonly number[]) => {
    const values = Array.from(newValues);
    setLocalValues(values);
    onValueChange?.(values);
  };

  return (
    <SliderPrimitive.Root
      {...props}
      ref={ref}
      min={min}
      max={max}
      step={step}
      value={localValues}
      onValueChange={handleValueChange}
      className={cn(
        "relative mb-6 flex w-full touch-none items-center select-none",
        className,
      )}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none">
        <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-primary/20">
          <SliderPrimitive.Indicator className="h-full bg-primary" />
        </SliderPrimitive.Track>
        {localValues.map((_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            index={index}
            className="block size-4 rounded-full border border-primary/50 bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-disabled:pointer-events-none data-disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Control>
      {localValues.map((currentValue, index) => (
        <div
          key={index}
          className="pointer-events-none absolute text-center"
          style={{
            left: `${((currentValue - min) / (max - min)) * 100}%`,
            top: 10,
          }}
        >
          <span className="text-sm">
            {formatLabel ? formatLabel(currentValue) : currentValue}
          </span>
        </div>
      ))}
    </SliderPrimitive.Root>
  );
}
