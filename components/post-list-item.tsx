import { Post } from "@/.velite";
import formatDate from "@/util/format";
import Link from "next/link";
import Image from "next/image";

interface PostListItemProps {
  post: Post;
}

/*
    글 목록의 하나의 행(row)을 렌더링
    렌더링 요소 : 제목/설명/날짜 + 썸네일(있을 경우)
*/

export default function PostListItem({ post }: PostListItemProps) {
  return (
    <li className="py-4">
      <Link
        href={`/posts/${post.slug}`}
        className="flex items-start justify-between gap-4"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="text-xl font-semibold">{post.title}</div>
          <p>{post.description}</p>
          <div className="text-xs text-muted">{formatDate(post.date)}</div>
        </div>
        {
          //썸네일이 있을 경우에만 표시
          post.thumbnail && (
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded">
              <Image
                src={post.thumbnail.src}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )
        }
      </Link>
    </li>
  );
}
