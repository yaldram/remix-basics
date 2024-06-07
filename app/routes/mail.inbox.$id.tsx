import { format } from "date-fns/format"
import { type LoaderFunctionArgs } from "@remix-run/node"
import { type ClientLoaderFunctionArgs, useLoaderData, useRouteError } from "@remix-run/react";
import {
  Archive,
  ArchiveX,
  Forward,
  Reply,
  ReplyAll,
  Trash2,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cacheMail, getCachedMail } from "@/lib/utils";
import { getMailById } from "@/services/mails.server"

export async function loader({ params }: LoaderFunctionArgs) {
  const mailId = parseInt(params.id as string);
  const [mail] = await getMailById(mailId)

  if (mailId > 14) {
    throw new Error("Unable to fetch the mail.")
  }

  return mail;
}

export async function clientLoader({ serverLoader, params }: ClientLoaderFunctionArgs) {
  const mailId = parseInt(params.id as string);
  const cachedMail = await getCachedMail(mailId)

  if (cachedMail) return cachedMail
  
  const loaderData = await serverLoader<typeof loader>();
  await cacheMail(loaderData)

  return loaderData
}

export default function InboxMailPage() {
  const mail = useLoaderData<typeof loader>();

  return (
    <TooltipProvider delayDuration={0}>
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <ArchiveX className="h-4 w-4" />
                <span className="sr-only">Move to junk</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to junk</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Move to trash</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to trash</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mx-1 h-6" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Reply className="h-4 w-4" />
                <span className="sr-only">Reply</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <ReplyAll className="h-4 w-4" />
                <span className="sr-only">Reply all</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply all</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Forward className="h-4 w-4" />
                <span className="sr-only">Forward</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Forward</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Separator />
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={mail.name} />
                <AvatarFallback>
                  {mail.name
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{mail.name}</div>
                <div className="line-clamp-1 text-xs">{mail.subject}</div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">Reply-To:</span> {mail.email}
                </div>
              </div>
            </div>
            {mail.date && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(mail.date), "PPpp")}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
            {mail.text}
          </div>
        </div>
    </div>
    </TooltipProvider>
  )
}

export function ErrorBoundary() {
  const error = useRouteError() as Error;

  return (
    <div className="font-semibold h-screen flex items-center justify-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl">Something went wrong.</h1>
        <p className="text-center">{error?.message}</p>
      </div>
    </div>
  )
}
