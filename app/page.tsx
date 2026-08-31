import { posts } from "@/.velite";
import Link from "next/link";

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

  const tags = Array.from(
    new Set(published.flatMap((post) => post.tags)),
  ).sort();

  const filtered = (
    tag ? published.filter((post) => post.tags.includes(tag)) : published
  ).sort((a, b) => (a.date > b.date ? -1 : 1));

  return (
    <main>
      <h1>qlog</h1>
      <nav className="flex flex-wrap gap-2 py-4">
        <Link href="/" className={!tag ? "font-semibold text-accent" : ""}>
          전체
        </Link>
        {tags.map((t) => (
          <Link
            key={t}
            href={`/?tag=${t}`}
            className={tag === t ? "font-semibold text-accent" : ""}
          >
            #{t}
          </Link>
        ))}
      </nav>
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
