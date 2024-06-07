import { NavLink } from "@remix-run/react";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

type LeftMenuSideBar = {
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    to: string;
  }[];
}

export function LeftMenuSideBar({ links }: LeftMenuSideBar) {
  return (
    <div className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            className={({ isActive }) =>
              cn(
                buttonVariants({ variant: isActive ? "default" : "ghost", size: "sm" }),
                !isActive && "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start"
              )
            }
          >
            <link.icon className="mr-2 h-4 w-4" />
            {link.title}
            {link.label && (
              <span
                className={cn(
                  "ml-auto",
                  // link.variant === "default" && "text-background dark:text-white"
                )}
              >
                {link.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
