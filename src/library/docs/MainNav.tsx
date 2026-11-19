"use client";

import { cn } from "../ui/cn";

import { Button } from "../ui/button";

export function MainNav({
  items,
  active,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: { href: string; label: string; id: string }[];
  active: string;
}) {
  return (
    <nav
      data-slot="main-navigation"
      className={cn("items-center gap-1", className)}
      {...props}
    >
      {items.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          asChild
          size="sm"
          className="relative px-2.5 after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:rounded-full after:bg-transparent aria-[current=page]:text-primary aria-[current=page]:after:bg-current aria-[current=page]:hover:bg-transparent aria-[current=page]:hover:text-primary"
        >
          <a
            href={item.href}
            aria-current={active === item.id ? "page" : undefined}
          >
            {item.label}
          </a>
        </Button>
      ))}
    </nav>
  );
}
