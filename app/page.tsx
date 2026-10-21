import { posts } from "@/.velite";
import Link from "next/link";
import TagList from "@/components/tag-list";

/*
  Home으로 접속 시 전체 포스트 목록 조회
*/

interface HomeProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { tag } = await searchParams;

  const published = posts
    .filter((post) => post.published)
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  const filtered = (
    tag ? published.filter((post) => post.tags.includes(tag)) : published
  ).sort((a, b) => (a.date > b.date ? -1 : 1));

  return (
    <main>
      <TagList activeTag={tag} />
      <ul>
        {filtered.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            <p>{post.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
