import { Search } from "lucide-react";
import { Form, Outlet, useLoaderData, useRouteError, useSearchParams } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMails } from "@/services/mails.server";
import { MailItem } from "@/components/molecules/mail-item";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  const mails = await getMails(search);
  // throw new Error('Unable to fetch mail list')
  
  return mails;
}

export default function InboxIndexPage() {
  const mails = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full items-stretch">
      <ResizablePanel defaultSize={440} minSize={30}>
        <div defaultValue="all">
          <div className="flex items-center px-4 py-2">
            <h1 className="text-xl font-bold">Inbox</h1>
          </div>
          <Separator />
          <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Form>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  defaultValue={searchParams.get("search") || ""} 
                  label="" 
                  name="search" 
                  id="search" 
                  placeholder="Search by name" 
                  className="pl-8" 
                />
              </div>
            </Form>
          </div>
          <ScrollArea className="h-screen pb-6">
            <div className="flex flex-col gap-2 p-4 pt-0">
              {mails.map((mail) => (
                <MailItem search={searchParams.get("search")} key={mail.id} mail={mail} />
              ))}
            </div>
          </ScrollArea>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={655}>
        <Outlet />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
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
  );
}
