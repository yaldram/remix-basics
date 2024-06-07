import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

export function AnalyticsSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }, (_, index) => (
        <Card key={index} className="flex flex-col h-[120px] gap-4 p-4">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[170px]" />
          <Skeleton className="h-4 w-[130px]" />
        </Card>
      ))}
    </>
  );
}

export function TransactionsSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-[200px]" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-4 w-[200px]" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export function SalesSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="grid gap-1">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <div className="ml-auto font-medium">
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </>
  );
}
