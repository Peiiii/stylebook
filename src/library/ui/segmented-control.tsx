import type { ComponentProps } from "react";
import { cn } from "./cn";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

type SingleToggleGroup = Extract<
  ComponentProps<typeof ToggleGroup>,
  { type: "single" }
>;

type SegmentedControlProps = Omit<
  SingleToggleGroup,
  "type" | "variant" | "spacing" | "value" | "defaultValue" | "onValueChange"
> & {
  value: string;
  onValueChange: (value: string) => void;
};

export function SegmentedControl({
  className,
  onValueChange,
  ...props
}: SegmentedControlProps) {
  return (
    <ToggleGroup
      {...props}
      type="single"
      spacing={1}
      data-slot="segmented-control"
      className={cn("gap-1 rounded-full border bg-muted p-1.5", className)}
      onValueChange={(value) => {
        if (value) onValueChange(value);
      }}
    />
  );
}

export function SegmentedControlItem({
  className,
  ...props
}: Omit<ComponentProps<typeof ToggleGroupItem>, "variant">) {
  return (
    <ToggleGroupItem
      {...props}
      data-slot="segmented-control-item"
      className={cn(
        "gap-2 rounded-full border border-transparent px-3 text-sm text-foreground aria-checked:border-primary/35 aria-checked:bg-background aria-checked:text-primary aria-checked:shadow-sm focus-visible:ring-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    />
  );
}
