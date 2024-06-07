import { Suspense } from "react";
import { defer } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { ArrowUpRight, DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AnalyticsSkeleton, SalesSkeleton, TransactionsSkeleton } from "@/components/molecules/skeletons";
import { getAllAnalytics } from "@/services/analytics.server";
import { getAllTransactions } from "@/services/transactions.server";
import { getAllSales } from "@/services/sales.server";
import { SalesList } from "@/components/templates/SalesList";
import { DeferError } from "@/components/templates/DeferError";

export async function loader() {
  const analytics = await getAllAnalytics(); // 1 second
  const transactions = getAllTransactions(); // 4 seconds
  const sales = getAllSales() // 3 seconds

  return defer({ analytics, transactions, sales });
}

export default function DashboardPage() {
  const { analytics, transactions, sales } = useLoaderData<typeof loader>();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Suspense fallback={<AnalyticsSkeleton />}>
            <Await resolve={analytics}>
              {(analyticsData) =>
                analyticsData.map((item, index) => (
                  <Card className="h-[120px]" key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {item.title}
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{item.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {item.change}
                      </p>
                    </CardContent>
                  </Card>
                ))
              }
            </Await>
          </Suspense>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2 h-[450px]">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  Recent transactions from your store.
                </CardDescription>
              </div>
              <Button size="sm" className="ml-auto gap-1">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <Suspense fallback={<TransactionsSkeleton />}>
                    <Await resolve={transactions}>
                      {(transactionsData) =>
                        transactionsData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="font-medium">{item.email}</div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="hidden text-sm text-muted-foreground md:inline">
                                {item.amount}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      }
                    </Await>
                  </Suspense>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="h-[450px]">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <Suspense fallback={<SalesSkeleton />}>
                <Await resolve={sales} errorElement={<DeferError />}>
                  <SalesList />
                </Await>
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

