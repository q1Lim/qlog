"use client";

import { Post } from "@/.velite";
import { useEffect, useState } from "react";

interface TocProps {
  toc: Post["toc"];
}

function flattenToc(items: Post["toc"]): string[] {
  return items.flatMap((item) => [
    // 앞부분 #을 제거하여 평탄화 작업 진행
    item.url.slice(1), // eg. "#라우팅-방식" → "라우팅-방식"
    ...flattenToc(item.items),
  ]);
}

export default function Toc({ toc }: TocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const ids = flattenToc(toc);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    // 화면 상단 20% 영역에 걸쳐있는 헤딩들의 id를 추적
    const visibleIds = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleIds.add(entry.target.id);
          } else {
            visibleIds.delete(entry.target.id);
          }
        });

        // 문서 순서(ids)상, 지금 상단 영역에 걸쳐있는 헤딩 중 제일 마지막(가장 아래) 것을 활성화
        const visibleInOrder = ids.filter((id) => visibleIds.has(id));
        if (visibleInOrder.length > 0) {
          setActiveId(visibleInOrder[visibleInOrder.length - 1]);
        }
      },
      // 뷰포트 아래쪽 80%를 잘라내서, 화면 상단 20% 영역만 감지 범위로 삼음
      { rootMargin: "0px 0px -80% 0px" },
    );

    elements.forEach((el) => observer.observe(el));

    // 문서 끝에 가까운 헤딩들은 "상단 20%"까지 스크롤할 여유가 부족해서
    // IntersectionObserver가 영영 트리거 안 될 수 있음 → 페이지 맨 끝 근처에서는 작은 버퍼(20px)로 직접 위치를 비교해서, 서로 가까이 붙은 헤딩들도 제대로 구분해서 활성화
    function refineActiveNearBottom() {
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 10;

      if (!atBottom) return;

      const passedIds = elements
        .filter(
          (el) =>
            el.getBoundingClientRect().top + window.scrollY <=
            window.scrollY + 20,
        )
        .map((el) => el.id);

      const lastPassed = ids.filter((id) => passedIds.includes(id)).at(-1);

      if (lastPassed) {
        setActiveId(lastPassed);
      } else if (ids.length > 0) {
        setActiveId(ids[ids.length - 1]);
      }
    }

    window.addEventListener("scroll", refineActiveNearBottom);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", refineActiveNearBottom);
    };
  }, [toc]);

  function renderItems(items: Post["toc"], depth = 0) {
    return (
      <ul className={`list-none space-y-2 ${depth > 0 ? "mt-2" : ""}`}>
        {items.map((item) => {
          const id = item.url.slice(1);
          const isActive = id === activeId;

          return (
            <li key={item.url}>
              <a
                href={item.url}
                style={{ paddingLeft: `${depth * 0.75 + 0.5}rem` }}
                className={`block ${
                  isActive ? "font-semibold text-accent" : "text-muted"
                }`}
              >
                {item.title}
              </a>
              {item.items.length > 0 && renderItems(item.items, depth + 1)}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <nav className="fixed top-32 right-[calc((100vw-56rem)/2-15rem)] hidden w-60 border-l border-border pl-4 text-sm xl:block">
      {renderItems(toc)}
    </nav>
  );
}
