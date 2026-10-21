import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  tag?: string;
}

/*
    페이지 바 컴포넌트: 페이지 목록 및 현재 페이지 표기
*/
export default function Pagination({
  currentPage,
  totalPages,
  tag,
}: PaginationProps) {
  // 총 페이지 수가 1개 이하면 페이지바를 보여주지 않음
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex justify-center gap-4 py-4">
      {pageNumbers.map((n) => {
        // tag 유무에 따라 쿼리스트링이 달라져서, 수동 문자열 조합 대신 URLSearchParams로 조립 (인코딩 처리 + 분기 처리 자동화)
        const params = new URLSearchParams();
        if (tag) params.set("tag", tag);
        params.set("page", String(n));

        const href = `/?${params.toString()}`;

        return (
          <Link
            key={n}
            href={href}
            className={n === currentPage ? "font-semibold text-accent" : ""}
          >
            {n}
          </Link>
        );
      })}
    </nav>
  );
}
