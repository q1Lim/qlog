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

/*
    헤딩이 화면 맨 위에서 이 거리(px) 안이면 "지나쳤다"고 판단하는 기준
    -> atBottom으로 페이지 끝에 도달한 걸 확인한 뒤, 그중 어떤 헤딩이 지금 활성화 대상인지 고를 때 사용
*/
const NEAR_TOP_PX = 20;

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
      // 화면 상단 20%만 감지 영역으로 삼기 위해, 뷰포트 아래쪽 80%를 잘라냄
      { rootMargin: "0px 0px -80% 0px" },
    );

    elements.forEach((el) => observer.observe(el));

    /*
        페이지 끝 근처에서 activeId를 다시 한번 보정하는 함수
        IntersectionObserver만으로는 문서 끝에 가까운 헤딩들이 화면 상단 20% 지점까지 스크롤할 여유가 부족해 영영 트리거 안 될 수 있어서, NEAR_TOP_PX 버퍼로 직접 위치를 비교해 보완함
    */
    function refineActiveNearBottom() {
      const canScroll = document.body.scrollHeight > window.innerHeight;
      // 스크롤 가능한 문서에서 더 이상 스크롤할 수 없는 바닥에 도달했는지 판단
      const atBottom =
        canScroll &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 10;

      if (!atBottom) return;

      const lastPassed = elements
        .filter((el) => el.getBoundingClientRect().top <= NEAR_TOP_PX)
        .at(-1)?.id;

      setActiveId(lastPassed ?? ids[ids.length - 1]);
    }

    window.addEventListener("scroll", refineActiveNearBottom, {
      passive: true,
    });

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

  // 헤딩이 없는 글이면 내용 없는 border-l 선만 떠있게 되어 없을 경우 null 처리
  if (toc.length === 0) return null;

  // right 계산의 56rem은 app/layout.tsx의 body에 있는 max-w-4xl(본문 폭)과, 15rem은 바로 아래 w-60(이 nav 자체의 폭)과 값이 맞물려 있음 — 둘 중 하나라도 바뀌면 이 계산도 같이 고쳐야 TOC가 본문과 안 겹침
  // (100vw는 세로 스크롤바 폭도 포함하는데, 그로 인한 오차는 스크롤바 폭의 절반 수준(보통 7~8px)이라 장식용 TOC 위치에선 무시함)
  return (
    <nav className="fixed top-32 right-[calc((100vw-56rem)/2-15rem)] hidden w-60 border-l border-border pl-4 text-sm xl:block">
      {renderItems(toc)}
    </nav>
  );
}
