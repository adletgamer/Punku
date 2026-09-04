import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.72rem] font-medium leading-none",
  {
    variants: {
      variant: {
        verificado: "bg-verdigris-tenue text-verdigris",
        ocre: "bg-ocre-tenue text-ocre-hondo",
        neutro: "bg-ink/[0.055] text-tinta-suave",
      },
    },
    defaultVariants: { variant: "neutro" },
  }
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
