import { useEffect, useRef } from "react";
import { z } from "zod";
import { type ActionFunctionArgs } from "@remix-run/node";
import { ExternalLink, TrashIcon } from "lucide-react";
import { Form, Link, json, useActionData, useLoaderData } from "@remix-run/react";

import { deleteRepository, getAllRepositories, insertRepository } from "@/services/repositories.server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(1, { message: "name is required" }),
  link: z.string().url("link is not valid"),
  organization: z.string().url("organization link is not valid"),
});

export async function loader() {
  const repositories = await getAllRepositories();
  
  return json({ repositories });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const actionType = formData.get('_action') as string;

  const initialFormErrors = { name: "", link: "", organization: "" };
  const actionData = { success: true, errors: initialFormErrors, actionType };

  if (actionType === "insert") {
    const name = formData.get('name');
    const link = formData.get('link');
    const organization = formData.get('organization');
   
    const validationResult = formSchema.safeParse({ name, link, organization });

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
     
      return { 
        ...actionData, 
        success: false, 
        errors: {
          name: fieldErrors?.name?.[0] ?? "", 
          link: fieldErrors?.link?.[0] ?? "", 
          organization: fieldErrors?.organization?.[0] ?? ""
        } 
      };
    }

    await insertRepository({ ...validationResult.data });
  }

  if (actionType === "delete") {
    const repositoryId = formData.get('repositoryId') as string;
    await deleteRepository(repositoryId);
  }

  return actionData;
}

export default function BasicFormValidationPage() {
  const { repositories } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (!actionData?.success) return;

    if (actionData.actionType === "insert") {
      formRef.current?.reset();
      toast({
        title: "Notification",
        description: "Successfully added repository",
      });
    } 

    if (actionData?.actionType === "delete") {
      toast({
        variant: "destructive",
        title: "Notification",
        description: "Successfully removed repository",
      });
    }
  }, [actionData?.success, actionData?.actionType, toast]);

  return (
    <div className="divide-y divide-solid">
      <div className="flex justify-center my-10">
        <Card className="w-[40rem]">
          <CardHeader>
            <CardTitle>Add Repository</CardTitle>
            <CardDescription>Enter the details of the repository.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form ref={formRef} method="POST">
              <input type="hidden" name="_action" value="insert" />
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Input 
                    error={actionData?.errors?.name} 
                    label="Name" 
                    id="name" 
                    name="name" 
                    placeholder="Remix.js" 
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Input 
                    error={actionData?.errors?.link} 
                    label="Repository Link" 
                    id="link" 
                    name="link" 
                    placeholder="https://github.com/remix-run/remix" 
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Input 
                    error={actionData?.errors?.organization} 
                    label="Organization Link" 
                    id="organization" 
                    name="organization" 
                    placeholder="https://github.com/remix-run" 
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-3 gap-y-6 gap-x-4 p-8">
        {repositories.map((repository) => (
          <Card key={repository.id} className="w-[500px]  divide-y divide-solid">
            <CardContent className="p-0">
              <div className="flex flex-col gap-2">
                <div className="h-[300px]">
                  <img className="object-cover rounded-t-md w-full h-full" src={`${repository.organization}.png`} alt={repository.name} />
                </div>
                <h1 className="m-4 text-4xl font-bold tracking-tight">{repository.name}</h1>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4 p-6">
              <Form method="POST" className="w-full">
                <input type="hidden" name="_action" value="delete" />
                <input type="hidden" name="repositoryId" value={repository.id} />
                <Button type="submit" className="w-full" variant="destructive">
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </Form>
              <Button asChild variant="outline" className="w-full">
                <Link to={repository.link} target="_blank" rel="noreferrer">
                  Visit
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
