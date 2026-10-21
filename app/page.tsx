import { posts } from "@/.velite";
import TagList from "@/components/tag-list";
import PostListItem from "@/components/post-list-item";
import Pagination from "@/components/pagination";

/*
  Home으로 접속 시 전체 포스트 목록 조회
*/

interface HomeProps {
  searchParams: Promise<{ tag?: string; page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { tag, page } = await searchParams;

  const published = posts
    .filter((post) => post.published)
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  const filtered = (
    tag ? published.filter((post) => post.tags.includes(tag)) : published
  ).sort((a, b) => (a.date > b.date ? -1 : 1));

  // 페이징 처리
  const PAGE_SIZE = 5;
  let currentPage = Number(page) || 1;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  // 글이 0개일때 currentPage가 0이 되는 걸 막기 위해 추가
  if (totalPages > 0 && currentPage > totalPages) {
    currentPage = totalPages;
  }

  // 현재 페이지에 해당되는 글 목록 잘라내기
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

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
          <ul className="min-h-[830px] divide-y divide-border">
            {paginated.map((post) => (
              <PostListItem key={post.slug} post={post} />
            ))}
          </ul>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          tag={tag}
        />
      </div>
    </main>
  );
}
