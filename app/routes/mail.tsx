import { Outlet } from "@remix-run/react"
import {
  Archive,
  ArchiveX,
  File,
  Inbox,
  Send,
  Trash2,
} from "lucide-react"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { LeftMenuSideBar } from "@/components/molecules/left-menu-sidebar"

const links = [
  {
    title: "Inbox",
    label: "12",
    icon: Inbox,
    to: "/mail/inbox",
  },
  {
    title: "Drafts",
    label: "9",
    icon: File,
    to: "/mail/drafts",
  },
  {
    title: "Sent",
    label: "",
    icon: Send,
    to: "/mail/send",
  },
  {
    title: "Junk",
    label: "3",
    icon: ArchiveX,
    to: "/mail/junk",
  },
  {
    title: "Trash",
    label: "",
    icon: Trash2,
    to: "/mail/trash",
  },
  {
    title: "Archive",
    label: "",
    icon: Archive,
    to: "/mail/archive",
  }
]

export default function Mail() {
  return (
    <div className="h-[100vh]">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-[100px]"
      >
        <ResizablePanel
          defaultSize={264}
          collapsible={true}
          minSize={15}
          maxSize={20}
        >
          <Separator />
          <LeftMenuSideBar links={links} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={655}>
          <Outlet />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
