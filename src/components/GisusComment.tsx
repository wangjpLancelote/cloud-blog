"use client";
import dynamic from "next/dynamic";

// import Giscus from '@giscus/react'
const Giscus = dynamic(() => import("@giscus/react").then((mod) => mod.default), { ssr: false });

export default function GiscusComment() {
  return (
    <Giscus
      id="comments"
      repo="wangjpLancelote/cloud-blog" // 你的仓库
      repoId="R_kgDOOV5Axw" // 仓库 ID
      category="Announcements" // 分类名
      categoryId="DIC_kwDOOV5Ax84Co5Vf" // 分类 ID
      mapping="pathname" // 根据 pathname 匹配文章
      strict="0" // 严格模式：0=关闭
      reactionsEnabled="1" // 表情反应：1=启用
      emitMetadata="0" // 发出元数据：0=关闭
      inputPosition="bottom" // 评论框位置
      theme="preferred_color_scheme" // 自动跟随系统主题
      lang="en" // 评论语言
      loading="lazy"
    />
  );
}
