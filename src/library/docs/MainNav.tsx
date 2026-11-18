"use client";

import { route } from "../route";
import { cn } from "../ui/cn";

import { Button } from "../ui/button";

export function MainNav({
  items,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: { href: string; label: string; id: string }[];
}) {
  const active = route.get("view", "components");

  return (
    <nav className={cn("items-center gap-0", className)} {...props}>
      {items.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          asChild
          size="sm"
          className="px-2.5"
        >
          <a
            href={item.href}
            aria-current={active === item.id ? "page" : undefined}
            className="relative items-center aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground"
          >
            {item.label}
          </a>
        </Button>
      ))}
    </nav>
  );
}
