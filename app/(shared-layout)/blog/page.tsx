import { fetchIPv4 } from "@/lib/fetch-ipv4";
import { fetchQuery } from "convex/nextjs";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
export const runtime = "nodejs";

export default function BlogPage() {
  return (
    <>
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Our Blog
        </h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Insights, thoughts and trends from our team
        </p>
      </div>

      <Suspense fallback={<SkeletonLoadingUi />}>
        <LoadBlogList />
      </Suspense>
    </>
  );
}

async function LoadBlogList() {
  await new Promise((resolve) => setTimeout(resolve, 10));

  const url = `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/query`;
  console.log("Fetching from:", url);

  const response = await fetchIPv4(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      path: "posts:getPosts",
      args: {},
      format: "json",
    }),
  });

  const parsed = await response.json();
  const data = parsed.value as Array<{
    _id: string;
    _creationTime: number;
    title: string;
    body: string;
    authorId: string;
    imageStorageId?: string;
    imageUrl: string | null;
  }>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
      {data?.map((post) => (
        <Card key={post._id} className="pt-0">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={
                post.imageUrl ??
                "https://images.unsplash.com/photo-1709884735017-114f4a31f944?q=80&w=1229&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt="blog image"
              fill
              unoptimized
              className="w-full h-full object-cover rounded-t-lg"
            />{" "}
          </div>
          <CardContent>
            <Link href={`/blog/${post._id}`}>
              <h1 className="text-2xl font-bold hover:text-primary transition-colors">
                {post.title}
              </h1>
              <p className="text-muted-foreground line-clamp-3 pt-2">
                {post.body}
              </p>
            </Link>
          </CardContent>
          <CardFooter>
            <Link
              className={buttonVariants({
                className: "w-full",
              })}
              href={`/blog/${post._id}`}
            >
              Read More...
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function SkeletonLoadingUi() {
  return (
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3 ">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="space-y-2 flex flex-col">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
