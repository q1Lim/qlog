import { posts } from "@/.velite";
import Link from "next/link";

interface TagListProps {
  activeTag?: string;
}

/*
  태그 컴포넌트 : 태그 목록 표시 및 태그 클릭 시 ?tag= 파라미터로 이동
*/

export default function TagList({ activeTag }: TagListProps) {
  const published = posts.filter((post) => post.published);
  const tagCounts = published.reduce<Record<string, number>>((acc, post) => {
    post.tags.forEach((t) => {
      acc[t] = (acc[t] ?? 0) + 1;
    });
    return acc;
  }, {});

  const tags = Object.keys(tagCounts).sort();

  return (
    <nav className="flex flex-wrap gap-2 py-4 md:flex-col md:gap-1">
      <Link href="/" className={!activeTag ? "font-semibold text-accent" : ""}>
        전체보기 ({published.length})
      </Link>
      {tags.map((t) => (
        <Link
          key={t}
          href={`/?tag=${t}`}
          className={`text-sm ${activeTag === t ? "font-semibold text-accent" : ""}`}
        >
          #{t} ({tagCounts[t]})
        </Link>
      ))}
    </nav>
  );
}
