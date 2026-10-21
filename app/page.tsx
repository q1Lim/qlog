import { posts } from "@/.velite";
import TagList from "@/components/tag-list";
import PostListItem from "@/components/post-list-item";

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
    <main className="flex flex-col gap-8 md:flex-row">
      <aside className="w-full shrink-0 md:w-40">
        <TagList activeTag={tag} />
      </aside>

      <div className="min-w-0 flex-1">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-muted">
            {tag
              ? `#${tag} 태그의 글이 아직 없습니다.`
              : "아직 발행된 글이 없습니다."}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((post) => (
              <PostListItem key={post.slug} post={post} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
