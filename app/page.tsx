import { posts } from "@/.velite";
import Link from "next/link";

/*
  Home으로 접속 시 전체 포스트 목록 조회
*/

export default function Home() {
  const published = posts
    .filter((post) => post.published)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
  return (
    <main>
      <h1>qlog</h1>
      <ul>
        {published.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            <p>{post.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
