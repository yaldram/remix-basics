import { useAsyncError } from "@remix-run/react";

export function DeferError() {
  const error = useAsyncError() as Error;

  return (
    <div className="font-semibold h-[450px] flex items-center justify-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl">Something went wrong.</h1>
        <p className="text-center">{error?.message}</p>
      </div>
    </div>
  );
}