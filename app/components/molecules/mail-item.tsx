import { ComponentProps } from "react";
import { NavLink, useParams } from "@remix-run/react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

import { cn } from "@/lib/utils";
import { Mail } from "@/drizzle/schemas/mails.db.server";
import { Badge } from "../ui/badge";

type MailItemProps = {
  mail: Mail;
  search: string | null;
}

export function MailItem({ mail, search }: MailItemProps) {
  const params = useParams();

  return (
    <NavLink
      to={search ? `${mail.id}?search=${search}` : `${mail.id}`}
      className={({ isActive }) =>
        `flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent ${
          isActive ? "bg-muted" : ""
        }`
      }
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="font-semibold">{mail.name}</div>
            {!mail.read && (
              <span className="flex h-2 w-2 rounded-full bg-blue-600" />
            )}
          </div>
          <div
            className={cn(
              "ml-auto text-xs",
              params.id && mail.id === parseInt(params.id)
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {formatDistanceToNow(new Date(mail.date), {
              addSuffix: true,
            })}
          </div>
        </div>
        <div className="text-xs font-medium">{mail.subject}</div>
      </div>
      <div className="line-clamp-2 text-xs text-muted-foreground">
        {mail.text.substring(0, 300)}
      </div>
      {mail.labels && mail.labels.length ? (
        <div className="flex items-center gap-2">
          {mail.labels.map((label) => (
            <Badge
              key={label}
              variant={getBadgeVariantFromLabel(label)}
            >
              {label}
            </Badge>
          ))}
        </div>
      ) : null}
    </NavLink>
  );
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}
