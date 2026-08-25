import type { NextConfig } from "next";

const isDev = process.argv.indexOf("dev") !== -1;
const isBuild = process.argv.indexOf("build") !== -1;

/*
    Next 16 기본 번들러는 webpack 플러그인을 하지 않아 velite 공식 가이드의 webpack 플러그인 방식 대신
    config 로드 시점에 직접 build()를 실행 -> VELITE_STARTED로 중복 실행 방지
*/
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = "1";
  import("velite").then((m) => m.build({ watch: isDev, clean: !isDev }));
}

const nextConfig: NextConfig = {/* config options here */};

export default nextConfig;
