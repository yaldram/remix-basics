import { type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { Card } from "@/components/ui/card";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const demos = [
  {
    title: "Routing & Data Mutations",
    path: "basic-crud"
  },
  {
    title: "Basic Form Validation",
    path: "basic-form-validation"
  },
  {
    title: "Conform Forms",
    path: "conform-forms"
  },
  {
    title: "Loading and Disabled States",
    path: "basic-loading-states"
  },
  {
    title: "Separate Loading States",
    path: "fetcher-loading-states"
  },
  {
    title: "Independent Fetchers",
    path: "independent-fetchers"
  },
  {
    title: "API Error Handling",
    path: "api-error-handling"
  },
  {
    title: "Optimistic Updates",
    path: "optimistic-updates"
  },
  {
    title: "Nested Routing, Error Handling & Caching",
    path: "mail"
  },
  {
    title: "Defer & Data Streaming",
    path: "defer-streaming"
  },
];

export default function Index() {
  return (
    <div className="flex justify-center py-20">
      <div className="grid grid-cols-4 gap-y-20 gap-x-10">
        {demos.map(({ title, path }, index) => (
          <Card key={index} className="w-[300px] h-[350px] p-4 relative border-0">
            <Link to={path}>
              <div className="absolute inset-0 bg-gradient-to-b from-green-500 to-green-800 opacity-75 rounded-lg shadow-lg"></div>
              <div className="h-full flex flex-col relative z-10">
                <h3 className="flex-1 text-9xl font-bold text-white">{index + 1}</h3>
                <h3 className="text-4xl font-bold text-white">{title}</h3>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
