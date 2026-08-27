import { posts } from "@/.velite";
import { run } from "@mdx-js/mdx";
import { notFound } from "next/navigation";
import * as runtime from "react/jsx-runtime";

/*
  slug로 찾아 MDX Body를 실제 컴포넌트로 렌더링 작업
*/

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post || !post.published) {
    notFound();
  }

  const { default: MDXContent } = await run(post.body, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  return (
    <article className="prose max-w-none py-8 prose-zinc">
      <h1 className="font-semibold">{post.title}</h1>
      <MDXContent />
    </article>
  );
}
