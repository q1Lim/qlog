import Image from "next/image";

export default function AboutPage() {
  return (
    <article className="prose max-w-none py-8 prose-zinc">
      <h1 className="font-semibold">About</h1>

      <figure className="not-prose">
        <Image
          src="/img/profile-mudo.png"
          alt="한번 또 잘해보자"
          width={2102}
          height={1184}
          className="w-full rounded-lg"
          priority
        />
        <figcaption className="mt-2 text-sm text-muted">다짐의 다짐</figcaption>
      </figure>
      <h3>기록 습관 들이기</h3>
      <p>
        뒤만 돌아도 무엇을 했는지 자꾸 까먹어서 안되겠다!! 하고 시작하게된
        블로그입니다. <br />
        프론트엔드 학습 내용을 기록합니다. :)
      </p>
    </article>
  );
}
