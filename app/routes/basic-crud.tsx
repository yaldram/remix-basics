import { type ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, json, useLoaderData } from "@remix-run/react";
import { ExternalLink, TrashIcon } from "lucide-react";

import { deleteRepository, getAllRepositories, insertRepository } from "@/services/repositories.server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function loader() {
  const repositories = await getAllRepositories();
  
  return json({ repositories });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const _action = formData.get('_action') as string;

  if (_action === "insert") {
    const name = formData.get('name') as string;
    const link = formData.get('link') as string;
    const organization = formData.get('organization') as string;

    await insertRepository({ name, link, organization });
    
    return null;
  }

  const repositoryId = formData.get('repositoryId') as string;
  await deleteRepository(repositoryId);
  
  return null;
}

export default function BasicCrudPage() {
  const { repositories } = useLoaderData<typeof loader>();
  
  return (
    <div className="divide-y divide-solid">
      <div className="flex justify-center my-10">
        <Card className="w-[40rem]">
          <CardHeader>
            <CardTitle>Add Repository</CardTitle>
            <CardDescription>Enter the details of the repository.</CardDescription>
          </CardHeader>
          <CardContent>
          <Form method="POST">
            <input type="hidden" name="_action" value="insert" />
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input 
                  label="Name" 
                  id="name" 
                  name="name" 
                  placeholder="Remix.js" 
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input 
                  label="Respository Link" 
                  id="link" 
                  name="link" 
                  placeholder="https://github.com/remix-run/remix" 
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input 
                  label="Organizaiton Link" 
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
