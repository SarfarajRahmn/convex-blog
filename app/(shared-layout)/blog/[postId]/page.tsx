export default function PostPage({ params }: { params: { postId: string } }) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-300 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-muted/50"></div>
      PostPage {params.postId}
    </div>
  );
}

export async function generateStaticParams() {
  return [{ postId: "1" }, { postId: "2" }, { postId: "3" }];
}

export async function generateMetadata({
  params,
}: {
  params: { postId: string };
}) {
  return {
    title: `Post ${params.postId}`,
  };
}
