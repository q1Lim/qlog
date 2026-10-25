import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="text-7xl font-bold text-muted">404</p>
      <p className="text-muted">요청하신 페이지를 찾을 수 없습니다. :(</p>
      <Link
        href="/"
        className="mt-4 rounded-md bg-foreground px-4 py-2 font-semibold text-white transition-colors hover:bg-foreground/80"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
