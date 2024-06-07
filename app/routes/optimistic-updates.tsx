import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { parseWithZod } from '@conform-to/zod';
import { SubmissionResult, getInputProps, useForm } from "@conform-to/react";
import { ActionFunctionArgs } from "@remix-run/node";
import { ExternalLink, TrashIcon } from "lucide-react";
import { Link, json, useFetcher, useLoaderData } from "@remix-run/react";

import { deleteRepository, getAllRepositories, insertRepository } from "@/services/repositories.server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { delay } from "@/lib/utils";
import { type Respository } from "@/drizzle/schemas/repositories.db.server";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string({ required_error: 'name is required' }),
  link: z.string({ required_error: "link is required" }).url("link is not valid"),
  organization: z.string({ required_error: 'organization link is required' }).url("organization link is not valid"),
});

export async function loader() {
  const repositories = await getAllRepositories();

  return json({ repositories });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const actionType = formData.get('_action') as string;

  if (actionType === "insert") {
    await delay(7000)
    const submission = parseWithZod(formData, { schema: formSchema });

    if (submission.status !== 'success') {
      return json({
        actionType,
        ...submission.reply()
      });
    }

    await insertRepository({ ...submission.value });
    
    // return null because returning success will reset the form.
    return null;
  }

  if (actionType === "delete") {
    try {
      // if (Math.random() > 0.5) throw new Error('cannot delete')

      const repositoryId = formData.get('repositoryId') as string;
      await deleteRepository(repositoryId);
    } catch (error) {
      return {
        status: "error",
        actionType
      } as SubmissionResult & { actionType: string };
    }
  }

  return {
    status: "success",
    actionType,
  } as SubmissionResult & { actionType: string };
}

export default function OptimisticUpdatesPage() {
  const { repositories } = useLoaderData<typeof loader>();
  const [optimisticData, setOptimisticData] = useState<Respository[]>([])
  
  const { toast } = useToast();
  const addFetcher = useFetcher<typeof action>()

  const [form, fields] = useForm({
    id: "repo-form",
    lastResult: addFetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: formSchema });
    },
    shouldValidate: 'onInput',
  });

  const nameRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setOptimisticData((prevState) => prevState.slice(repositories.length))
  }, [repositories])

  useEffect(() => {
    if (addFetcher.state !== "submitting") return;
  
    const formData = addFetcher.formData;
    
    const optimisticRepository = {
      id: 1,
      name: formData?.get('name') ,
      link: formData?.get('link') ,
      organization: formData?.get('organization') 
    } as Respository

    form.reset();
    setOptimisticData(prevState => [optimisticRepository].concat(prevState));
    toast({
      title: "Notification",
      description: "Repository will be added...",
    });
    
  }, [addFetcher.state, addFetcher.formData])
  
  return (
    <div className="divide-y divide-solid">
      <div className="flex justify-center my-10">
        <Card className="w-[40rem]">
          <addFetcher.Form method="post" id={form.id} onSubmit={form.onSubmit}>
            <CardHeader>
              <CardTitle>Add Repository</CardTitle>
              <CardDescription>Enter the details of the repository.</CardDescription>
            </CardHeader>
            <CardContent>
              <input type="hidden" name="_action" value="insert" />
              <fieldset className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Input 
                    label="Name" 
                    placeholder="Remix.js" 
                    {...getInputProps(fields.name, { type: 'text' })} 
                    error={fields.name.errors?.[0] ?? ""}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Input 
                    ref={nameRef}
                    label="Respository Link" 
                    placeholder="https://github.com/remix-run/remix" 
                    {...getInputProps(fields.link, { type: 'text' })} 
                    error={fields.link.errors?.[0] ?? ""} 
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Input 
                    label="Organizaiton Link" 
                    placeholder="https://github.com/remix-run" 
                    {...getInputProps(fields.organization, { type: 'text' })} 
                    error={fields.organization.errors?.[0] ?? ""} 
                  />
                </div>
              </fieldset>
            </CardContent>
            <CardFooter className="">
              <Button type="submit" className="w-full">Add</Button>
            </CardFooter>
          </addFetcher.Form>
        </Card>
      </div>
      <div className="grid grid-cols-3 gap-y-6 gap-x-4 p-8">
      {optimisticData.map((optimisticRecord, index) => (
          <RepositoryCard key={index} repository={optimisticRecord} optimistic />
        ))}
        {repositories.map((repository) => (
          <RepositoryCard key={repository.id} repository={repository} />
        ))}
      </div>
    </div>
  );
}

type RepositoryCardProps = {
  repository: Respository
  optimistic?: boolean
}

function RepositoryCard({ repository, optimistic = false }: RepositoryCardProps) {
  const deleteFetcher = useFetcher<typeof action>()
  const { toast } = useToast()

  const failedToDelete = deleteFetcher?.data?.status === "error";

  useEffect(() => {
    if (!failedToDelete && deleteFetcher?.data?.actionType === "delete") {
      toast({
        variant: "destructive",
        title: "Notification",
        description: "Successfully removed repository",
      });
    }
  }, [failedToDelete, deleteFetcher?.data?.actionType])

  return (
    <Card className="w-[500px] divide-y divide-solid">
    <CardContent className="p-0">
      <div className="flex flex-col gap-2">
        <div className="h-[300px]">
          <img className="object-cover rounded-t-md w-full h-full" src={`${repository.organization}.png`} alt={repository.name} />
        </div>
        <h1 className="m-4 text-4xl font-bold tracking-tight">{repository.name}</h1>
      </div>
    </CardContent>
    <CardFooter className="flex gap-4 p-6">
      <deleteFetcher.Form method="POST" className="w-full">
        <input type="hidden" name="_action" value="delete" />
        <input type="hidden" name="repositoryId" value={repository.id} />
        <Button disabled={deleteFetcher.state !== "idle" || optimistic} type="submit" className="w-full" variant="destructive">
          <TrashIcon className="mr-2 h-4 w-4" />
          {optimistic ? "Adding repository..." : failedToDelete ? "Retry" : "Remove"}
        </Button>
      </deleteFetcher.Form>
      <Button asChild variant="outline" className="w-full">
        <Link to={repository.link} target="_blank" rel="noreferrer">
          Visit
          <ExternalLink className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </CardFooter>
  </Card>
  )
}
