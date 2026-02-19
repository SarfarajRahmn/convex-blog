import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Heart, HomeIcon, PenTool } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col ">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center ">
        <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Welcome to the Next Blog
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed ">
            A simple Next.js 16 + convex project exploring some new features and
            best practices. Built with Convex, Tailwind CSS, and love .
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/blog">Start Reading</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8"
            >
              <Link href="/create">Write a Post</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-6 px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mx-auto">
          <Card className="flex flex-col border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <HomeIcon className="w-6 h-6" />
              </div>
              <CardTitle>Home</CardTitle>
              <CardDescription>Return to the landing page</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                You are currently on the home page. This is the entry point of
                our application.
              </p>
            </CardContent>
            <CardFooter>
              <Link
                href="/"
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full",
                })}
              >
                Go Home
              </Link>
            </CardFooter>
          </Card>

          <Card className="flex flex-col border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <BookOpen className="w-6 h-6" />
              </div>
              <CardTitle>Blog</CardTitle>
              <CardDescription>Read our latest articles</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                Browse through a collection of interesting posts and tutorials.
              </p>
            </CardContent>
            <CardFooter>
              <Link
                href="/blog"
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full",
                })}
              >
                Visit Blog
              </Link>
            </CardFooter>
          </Card>

          <Card className="flex flex-col border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <PenTool className="w-6 h-6" />
              </div>
              <CardTitle>Create Post</CardTitle>
              <CardDescription>Share your thoughts</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                Have something to say? Create a new blog post and share it with
                the community.
              </p>
            </CardContent>
            <CardFooter>
              <Link
                href="/create"
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full",
                })}
              >
                Create Post
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
