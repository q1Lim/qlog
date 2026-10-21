# 프로젝트 개요

기술지원 엔지니어에서 프론트엔드 개발자로 직무 전환을 준비 중인 개발자의
포트폴리오 겸 학습 기록용 개발 블로그. MDX 기반으로 프론트엔드 학습 내용을
정리하고, CI/CD 및 AI 에이전트 활용 경험 자체도 포트폴리오 요소로 삼는다.

# 기술 스택 & 선택 이유

- **Next.js 16 (App Router)** — SSR 활용 목적. static export는 사용하지 않음.
- **Vercel 배포** — SSR/ISR을 살리기 위해 선택. GitHub Pages는 정적 호스팅만
  가능해 SSR을 지원하지 않으므로 제외함.
- **MDX + velite** — Contentlayer2 대안. frontmatter를 Zod 스키마로 타입 안전하게
  관리하기 위함. (Contentlayer 자체는 유지보수가 뜸해져서 velite로 대체)
  - 콘텐츠 위치: `content/posts/**/*.mdx` (root는 프로젝트 루트 기준 `content/`)
  - frontmatter 스키마: `title`, `description`, `date`, `tags`, `published`
    (`published` 기본값 `false` — 명시적으로 켜야 공개)
  - `slug`는 frontmatter에 직접 쓰지 않고 `s.path()` + `.transform()`으로
    파일 경로 기반 자동 생성 (예: `content/posts/hello.mdx` → `slug: "hello"`)
  - Next 16 기본 번들러는 Turbopack이라 velite 공식 가이드의 webpack 플러그인
    연동 방식이 동작하지 않음 → `next.config.ts`에서 config 로드 시점에
    `velite.build()`를 직접 실행하는 방식(번들러 무관)으로 연동함. 다른
    라이브러리를 webpack 플러그인 방식으로 붙이려 할 때도 같은 문제에
    부딪힐 수 있으니 유의
  - `s.image()`로 frontmatter에서 이미지를 참조하면 velite가 빌드 시
    `public/static/`에 해시가 붙은 파일을 자동 생성함 (`.velite/`와 동일한
    성격의 빌드 산출물) → `.gitignore`에 `/public/static/` 추가해둠, 커밋
    대상 아님
- **TypeScript, Tailwind CSS, ESLint** — create-next-app 기본 설정 사용
- **Prettier + `prettier-plugin-tailwindcss`** — ESLint와 역할 분리(포매팅 vs
  코드 품질)를 위해 별도 추가. Tailwind 클래스 순서 자동 정렬 목적으로 플러그인도
  같이 사용. `eslint-config-prettier`로 ESLint와 충돌하는 포매팅 규칙은 끔

# GitHub 워크플로우 방향

- GitHub Actions에서 lint / 타입체크 / 테스트 자동화
- Dependabot으로 디펜던시 자동 업데이트 PR 생성
- Claude Code Action으로 PR 자동 리뷰 (블로킹 아님, 제안 수준으로 운용)
- 배포 자체는 Vercel이 Git push 시 자동 처리 (PR 미리보기 URL 포함)

# Git 커밋 정책

- **초반 (GitHub Actions 워크플로우 초기 세팅 완료 전)**: git commit은 직접
  실행하지 말고, 변경사항(diff)만 보여주고 사용자 확인 후 진행할 것
- **이후 (GitHub Actions 워크플로우 초기 세팅 완료 후)**: 아래 커밋 메시지
  포맷을 따라 자동 커밋 허용
  - 포맷: `<type>: <description>`
  - type 종류: `feat`(기능 추가), `fix`(버그 수정), `docs`(문서/블로그 포스트),
    `style`(스타일/포맷팅), `refactor`(리팩토링), `chore`(설정/디펜던시 등)
  - 예: `feat: add post list filtering by tag`
  - 한 커밋에는 하나의 논리적 변경만 포함 (여러 기능 묶어서 커밋하지 않기)

# 코딩 컨벤션

- 컴포넌트는 함수형 + TypeScript, props는 interface로 명시
- 스타일링은 Tailwind CSS만 사용 (별도 CSS 모듈 지양)
- 파일명: kebab-case (예: post-list.tsx), 컴포넌트명: PascalCase

# 하지 말아야 할 것

- `output: 'export'` 설정하지 말 것 (SSR을 유지하기로 결정했으므로)
- `next/image`의 `unoptimized` 옵션 사용하지 말 것 (마찬가지 이유)
- 임의로 새 npm 패키지를 추가하지 말고, 먼저 이유와 함께 제안할 것

# 자주 쓰는 명령어

- `npm run dev` — 로컬 개발 서버
- `npm run lint` — ESLint 검사
- `npm run build` — 빌드 검증
- `npm run format` — Prettier로 전체 파일 포매팅
- `npm run format:check` — 포매팅 여부만 검사 (수정 없음)
- `npx velite build` — velite 단독 빌드 (스키마 검증만 빠르게 확인할 때)

---

# 장기 참고 아이디어 (miryang.dev / fe-lab 벤치마킹)

지금 당장 반영하지 않지만, 프로젝트가 성숙해지면 검토할 만한 아이디어들.
출처: github.com/MiryangJung/miryang.dev, github.com/Han5991/fe-lab

## velite / 콘텐츠 스키마 관련

- [x] 썸네일 필드 추가 — `thumbnail: s.image().optional()`로 구현 완료.
      단, 카드형이 아니라 리스트형 UI에서 선택적으로 보여주는 용도로 사용 중
      (카드형 전환은 보류)
- [ ] `rehype-pretty-code`를 velite MDX 옵션에 직접 연결해 코드 하이라이팅 처리
      (별도 컴포넌트 구현 없이)
- [ ] title/description 등에 `max()`로 글자 수 제한을 스키마 레벨에서 강제
      (SEO 메타 태그 길이 관리 목적)

## 콘텐츠 운영 / 검증 관련

- [ ] frontmatter 원문 검증 + 빌드 산출물(HTML) 검증을 2단계로 분리하는 체계
      (로컬/PR/배포가 항상 같은 검사를 통과하도록)
- [ ] `pnpm new-post` 같은 CLI 스캐폴딩 스크립트로 포스트 생성 자동화
- [ ] 시리즈(연재글) 개념 도입 — 특정 폴더에 메타 파일(`_series.yml` 등)을 두면
      자동으로 시리즈로 인식되는 구조
- [ ] 예약 발행 — cron 기반으로 예약된 날짜가 되면 자동 발행 (우선순위 낮음)

## AI 에이전트 자동화 관련 (GitHub Actions)

- [ ] PR 자동 코드 리뷰 외에, 주기적 작업도 cron으로 자동화하는 것 검토: - 매주 의존성 감사 (dead dependency 정리 + audit 결과 PR) - 매달 발행 글의 외부 링크 깨짐 검사 → 교체 PR - 배포 후 스모크 테스트 (HTML/sitemap/rss 정상 여부 확인)

## 기타

- [ ] 댓글 기능이 필요해지면 Giscus 사용 (GitHub Discussions 기반, 무료,
      개발 블로그에서 표준적으로 쓰이는 방식)
