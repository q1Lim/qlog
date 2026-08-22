# qlog 프로젝트 결정 로그

프론트엔드 개발자 이직을 준비하며 만드는 학습 개발 블로그(`qlog`) 프로젝트의 논의 과정과 결정 사항을 정리한 기록입니다.

---

## 1. 초기 논의 — 프롬프트 활용 방향

- 프론트엔드 개발 블로그 제작을 위한 프롬프트 샘플 요청 → 기획, 디자인, 컴포넌트 개발, 코드 하이라이팅, 성능/SEO, 콘텐츠 작성 단계별 프롬프트 예시 제공
- "한꺼번에 물어보는 게 나은지" 질문 → **단계별 순차 진행이 낫다**고 결론. 이유: 각 단계가 이전 결정에 의존하고, 한 번에 다 물으면 AI가 임의로 가정해서 서로 안 맞는 결과가 나올 수 있음

## 2. 기획 단계 확정

사용자가 제시한 조건:

- **배경**: 기술지원 엔지니어 → 프론트엔드 개발자 전직 준비, 1~3년차, 취준 중
- **프로젝트**: MD 파일 기반 블로그
- **목표**: 프론트엔드 학습 + 학습 내용 포스팅
- **프레임워크**: Next.js
- **AI 활용 목표**: 배포, 디펜던시 관리, 코드 리뷰에 AI 에이전트 최대 활용

## 3. MDX 처리 방식 비교 (초기 논의)

세 가지 옵션 비교:

- `next-mdx-remote` (런타임 파싱) — 유연하지만 타입 안정성 약함
- `@next/mdx` (공식) — 안정적이지만 목록/필터 기능은 직접 구현 필요
- **Contentlayer2 계열(velite로 대체) — 최종 선택**. 이유: frontmatter를 Zod 스키마로 타입 안전하게 관리 가능하고, AI 에이전트가 정해진 스키마대로 작업하기 쉬워짐 (포트폴리오 스토리텔링에도 유리)

## 4. 배포 환경 비교 및 최초 결정 → 이후 번복

- 최초엔 Vercel 추천했으나, 사용자가 "CI/CD 경험 자체를 배우고 싶다"는 이유로 **GitHub Pages + GitHub Actions 직접 구성**을 선택
- 이후 SSR 관련 질문이 이어지면서 최종적으로는 **Vercel + SSR 유지**로 재변경됨 (6번 참고)

## 5. 개념 질문 — MDX, static export

- **MDX란?**: 일반 Markdown에 React 컴포넌트(JSX)를 삽입할 수 있게 만든 포맷. 인터랙티브 데모, 커스텀 알림 박스, 차트 등을 콘텐츠 안에 넣을 수 있음. 다만 처음엔 순수 MD로도 충분할 수 있고, velite 등 최신 파이프라인 도구들이 MDX를 기본 전제로 하기 때문에 확장성 차원에서 MDX 선택
- **Static Export란?**: `output: 'export'` 설정 시 빌드 타임에 모든 페이지를 HTML로 미리 만들어 서버 없이 배포하는 방식. 블로그처럼 콘텐츠가 빌드 시점에 확정되는 프로젝트엔 적합
- **왜 SSR/최적화 기능을 못 쓰는가**: 서버가 없어서 "요청 시점 계산"이 불가능하기 때문. SSR, ISR, `next/image` 자동 최적화, API Routes 전부 서버 연산이 필요한 기능이라 static export에서는 동작 안 함

## 6. GitHub Pages의 근본적 한계 확인 → Vercel + SSR로 최종 결정

- "GitHub Pages에서 SSR을 쓸 수 있는가?" 질문 → **불가능**. GitHub Pages는 정적 파일 호스팅 서비스라 Node.js 서버 실행 자체가 안 됨 (설정 문제가 아니라 플랫폼 구조적 한계)
- 이 답변을 계기로 **SSR을 살리기로 결정** → 배포처를 GitHub Pages에서 **Vercel로 전환**

## 7. GitHub Actions vs GitHub Pages 구분

- GitHub Pages(호스팅)와 GitHub Actions(워크플로우 엔진)는 별개 개념이라는 점 명확히 함
- **테스트 자동화는 GitHub Pages 선택 여부와 무관하게 GitHub Actions로 항상 구성 가능** (lint, 타입체크, 유닛테스트, `needs: test`로 배포 전 검증 게이트 구성 등)
- Vercel의 장점은 주로 "배포 이후" 경험: PR 미리보기 URL 자동 생성, 원클릭 롤백 등

## 8. AI 에이전트 활용 방안 조사 (웹 검색 진행)

- **`anthropics/claude-code-action`**: GitHub 공식 액션. PR diff를 읽고 인라인 코멘트로 리뷰. GitHub 호스팅 러너에서 실행되며 Anthropic API 호출만 외부로 나감. Claude Pro 구독만으로도 설정 가능 (Team/Enterprise 불필요)
- 설정: `ANTHROPIC_API_KEY` 시크릿 + permissions 블록만 있으면 최소 구성 가능
- 주의점: AI 리뷰 오탐율 약 5~8%대라 처음엔 "필수 체크"가 아닌 "제안" 수준으로 운용 권장, push마다 비용 발생하니 트리거 제한 필요
- **Dependabot**: GitHub 내장 기능, `dependabot.yml` 설정만으로 디펜던시 자동 업데이트 PR 생성 가능
- **최종 파이프라인 구조**: Dependabot(디펜던시 체크) → GitHub Actions(lint/테스트) → Claude Code Action(PR 리뷰) → Vercel(배포+미리보기)

## 9. 프로젝트 실제 세팅 시작

- Node.js 버전 확인: v26.3.0 (Next.js 요구사항 충분히 충족)
- `npx create-next-app@latest`로 프로젝트 생성, 이름은 **`qlog`**
- 결과 스택: **Next.js 16.3.1, React 19.2.8, TypeScript, Tailwind CSS v4, ESLint**, App Router 구조 (src 디렉토리는 안 씀)
- `.git` 자동 초기화됨, `AGENTS.md`/`CLAUDE.md` 파일이 create-next-app 기본 생성물로 함께 생성됨 (최근 Next.js가 AI 코딩 에이전트 사용을 염두에 두고 기본 제공하는 것으로 추정)
- `npm run dev` 정상 작동 확인 완료

## 10. Claude Code로의 전환 논의

- "이 대화를 VSCode로 옮길 수 있나?" 질문 → 대화 자체는 이전 불가하지만, **Claude Code(VSCode 확장)**를 통해 에디터 안에서 직접 파일 작업 가능하다는 점 안내
- 컨텍스트 전달 방법: 대화 요약을 자동으로 넘기는 기능은 없고, **`CLAUDE.md` 파일이 Claude Code가 자동으로 읽는 컨텍스트 저장소** 역할을 함

## 11. CLAUDE.md 작성

잘 쓰는 방법 논의 후 아래 내용으로 최종 확정:

- 프로젝트 개요, 기술 스택 및 선택 이유(Next.js/Vercel/velite), GitHub 워크플로우 방향
- **Git 커밋 정책**: GitHub Actions 워크플로우 초기 세팅 완료 **전**에는 diff만 보여주고 확인받기, **완료 후**부터는 `<type>: <description>` 포맷으로 자동 커밋 허용
- 코딩 컨벤션(함수형 컴포넌트+TS, Tailwind만 사용, kebab-case 파일명)
- 하지 말아야 할 것(`output: 'export'` 금지, `unoptimized` 이미지 옵션 금지, 임의 패키지 추가 금지)

## 12. 유사 프로젝트 벤치마킹

velite 스키마 설계 전, 유사한 개발 블로그 두 곳의 실제 코드를 조사함.

- **`Han5991/fe-lab`**: Turborepo 모노레포. 블로그 + 여러 실험 앱이 한 저장소에 공존.
  MDX가 아닌 `.md` + 자체 제작 콘텐츠 파이프라인(`@blog/content`) 사용. 배포는
  GitHub Pages(`output: 'export'`). frontmatter 원문 검증 + 빌드 산출물(HTML) 검증을
  분리한 2단계 검증 체계, `_series.yml` 기반 연재글 개념, cron 기반 예약 발행,
  `new-post` CLI 스캐폴딩, GitHub Actions cron으로 의존성 감사/링크 검사/배포 후
  스모크 테스트까지 자동화되어 있음. 댓글은 Giscus.
- **`MiryangJung/miryang.dev`**: 단일 Next.js 프로젝트. **Next.js + velite + Vercel +
  Tailwind + Zod** 조합으로 지금 프로젝트의 스택과 거의 동일함. 실제
  `velite.config.ts` 확인 결과 frontmatter는 `title`, `description`, `slug`,
  `date`, `thumbnailUrl`, `body`로 구성되어 있고, `tags`/`published` 필드는 없음.
  `slug`는 `s.path()` + `.transform()`으로 파일 경로 기반 자동 생성. 코드
  하이라이팅은 `rehype-pretty-code`를 velite MDX 옵션에 직접 연결해서 처리.
  title/description에 `max(99)` 글자 수 제한을 스키마 레벨에서 강제.

두 저장소의 아이디어를 바로 반영하지는 않고, `CLAUDE.md`에 "장기 참고 아이디어"
섹션으로 정리해 나중에 검토하기로 함 (아래 13번 참고).

## 13. CLAUDE.md — 장기 참고 아이디어 섹션 추가

벤치마킹한 두 저장소에서 나온 아이디어를 즉시 반영하지 않고, `CLAUDE.md`에
체크리스트 형태의 "장기 참고 아이디어" 섹션으로 추가하기로 함. 카테고리:

- velite/콘텐츠 스키마 관련 (slug 자동 생성, thumbnailUrl, rehype-pretty-code,
  글자 수 제한)
- 콘텐츠 운영/검증 관련 (2단계 검증, new-post CLI, 시리즈 개념, 예약 발행)
- AI 에이전트 자동화 관련 (의존성 감사, 링크 검사, 배포 후 스모크 테스트 cron)
- 기타 (댓글 — Giscus)

## 14. Claude Code 협업 방식 조정 — 학습용 직접 작성으로 전환

- velite.config.ts / next.config.ts / 샘플 포스트를 Claude Code가 먼저 자동으로
  작성해서 진행했으나, 사용자가 "학습용 프로젝트라 직접 작성하고 싶다"는 이유로
  전부 원복 요청 → 원복 완료
- 이후로는 Claude Code가 코드를 직접 쓰지 않고, 개념 설명 + 붙여넣을 코드 텍스트
  제공 + 단계별 가이드 역할로 전환. 실제 파일 작성/저장은 사용자가 직접 진행
- 예외: 사용자가 명시적으로 "대신 써줘"라고 요청한 경우(예: 이번 CLAUDE.md /
  decisions-log.md 갱신)는 Claude Code가 직접 편집

## 15. velite 스키마 최종 확정 및 next.config.ts 연동

- **frontmatter 스키마 확정**: `title`, `description`, `date`(`s.isodate()`),
  `tags`(`s.array(s.string())`), `published`(`s.boolean()`, **기본값 false** —
  실수로 초안이 공개되는 것을 방지하기 위해 명시적 opt-in 방식 선택)
- **slug 생성 방식 결정**: frontmatter에 별도로 안 쓰고 `s.path()` +
  `.transform()`으로 파일 경로 기반 자동 생성 (`content/posts/hello.mdx` →
  `slug: "hello"`). 12번 항목에서 miryang.dev 벤치마킹으로 알게 된 방식을
  실제로 채택
- **콘텐츠 위치**: `content/posts/**/*.mdx` (velite root 기본값이 `content/`이며,
  `app/` 디렉토리는 라우팅 전용이라 콘텐츠 데이터와 분리)
- **next.config.ts 연동 방식에서 발견한 이슈**: velite 공식 Next.js 가이드는
  webpack 플러그인으로 빌드 훅에 연결하는 예시를 제공하지만, **Next.js 16 기본
  번들러가 Turbopack이라 이 방식이 동작하지 않음** (Turbopack은 webpack의
  `config.plugins`/`compiler.hooks` 같은 훅 체계를 타지 않음). 대신 config 파일이
  로드되는 시점(Node.js 레벨)에 `import('velite').then(m => m.build(...))`를
  직접 실행하는, 번들러에 의존하지 않는 방식으로 연동함. `VELITE_STARTED`
  환경변수로 중복 실행 방지
  - 참고로 Next.js 16에서도 `--webpack` 플래그로 webpack으로 완전히 되돌리는
    건 여전히 가능하지만, 공식적으로 Turbopack 사용을 권장하는 방향
- `npx velite build` 단독 실행으로 스키마 검증 → `content/posts/hello.mdx`
  샘플로 title/date/tags/slug/컴파일된 MDX body까지 정상 출력 확인 완료

## 16. ESLint / Prettier 도입

- ESLint는 create-next-app 기본값(`eslint-config-next`: core-web-vitals +
  typescript) 그대로 유지, **Prettier는 별도 패키지 추가가 필요해 CLAUDE.md
  "임의 패키지 추가 금지" 정책에 따라 이유를 먼저 제시하고 확인받음**
- 추가 이유: ESLint(코드 품질) / Prettier(포매팅) 역할 분리가 표준적인 조합이고,
  Tailwind 클래스 순서를 자동 정렬해주는 `prettier-plugin-tailwindcss`도 같이
  쓰기로 함
- 설치: `prettier`, `eslint-config-prettier`, `prettier-plugin-tailwindcss`
- Tailwind v4는 CSS-first 설정(`app/globals.css`에 `@import "tailwindcss"`)이라
  `tailwind.config.js`가 없음 → `.prettierrc.json`의 `tailwindStylesheet` 옵션으로
  `./app/globals.css` 경로를 직접 지정해줘야 플러그인이 정렬 기준을 읽을 수 있음
- `eslint.config.mjs`에는 `eslintConfigPrettier`를 배열 **맨 뒤**에 추가 (ESLint
  flat config는 뒤쪽 설정이 앞쪽을 덮어쓰는 구조라, Prettier와 충돌하는 포매팅
  규칙을 끄려면 순서가 중요함)
- `package.json`에 `format`(수정) / `format:check`(검사만) 스크립트 추가
- 세부 옵션(`singleQuote`, `arrowParens`, `bracketSameLine`, `trailingComma`
  등)은 사용자가 직접 정함. `singleQuote`는 JSX 속성 기본값(큰따옴표)과의
  일관성을 위해 `false`(기본값)로 결정

## 17. CLAUDE.md 갱신

15~16번 결정사항을 반영해 CLAUDE.md 갱신:

- 기술 스택 섹션의 velite 항목에 콘텐츠 위치/스키마/slug 생성 방식/Turbopack
  유의사항 구체화, Prettier 항목 신규 추가
- 자주 쓰는 명령어에 `npm run format`, `npm run format:check`,
  `npx velite build` 추가
- "장기 참고 아이디어"의 slug 자동 생성 검토 항목은 이미 15번에서 실제
  적용됐으므로 목록에서 제거 (다른 미착수 아이디어들은 그대로 유지)

---

## 현재 진행 상태 (다음 할 일)

- [x] Next.js 프로젝트 생성
- [x] 개발 서버 확인
- [x] CLAUDE.md 작성
- [x] GitHub 리포지토리 생성 및 연결 (`q1Lim/qlog`)
- [x] 유사 프로젝트 벤치마킹 (fe-lab, miryang.dev) → CLAUDE.md에 장기 아이디어로 정리
- [x] velite 설정 (스키마 확정: title/date/description/tags/published, slug 자동 생성, next.config.ts 연동까지 완료)
- [x] ESLint / Prettier 설정
- [ ] Vercel 배포 연결 (velite 구성 이후로 보류하기로 결정)
- [ ] GitHub Actions 워크플로우 작성 (테스트, Dependabot, Claude Code Action)
- [ ] 기능 상세화 (포스트 목록/필터, 코드 하이라이팅, 디자인 시스템, 실제 MDX 렌더링)
