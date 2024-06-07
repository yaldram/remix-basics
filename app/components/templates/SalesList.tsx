import { useAsyncValue } from "@remix-run/react";
import { type Sales } from "@/drizzle/schemas/sales.db.server";

import { Avatar, AvatarFallback } from "../ui/avatar";

export function SalesList() {
  const salesData = useAsyncValue() as Sales[];

  return (
    <>
      {salesData.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          <Avatar className="h-9 w-9 sm:flex">
            <AvatarFallback>{item.avatar}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">
              {item.customer}
            </p>
            <p className="text-sm text-muted-foreground">
              {item.email}
            </p>
          </div>
          <div className="ml-auto font-medium">{item.amount}</div>
        </div>
      ))}
    </>
  );
}
