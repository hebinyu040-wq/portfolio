/**
 * 作品集内容配置
 * 后续只需修改这个文件中的文字、分类与项目数据。
 * cover 可填写本地图片路径，例如："./assets/project-01.jpg"。
 */
window.PORTFOLIO_CONTENT = {
  profile: {
    name: "你的名字",
    intro: "聚焦品牌、视觉与数字体验。这里会逐步收录我的代表项目与思考过程。",
    bio: "我是一名关注视觉叙事与数字体验的创作者，擅长把抽象想法转化成清晰、有个性的表达。",
    location: "你的城市",
    focus: "品牌 / 视觉 / 数字体验",
    availability: "Freelance & Collaboration",
    email: "3521815601@qq.com",
    role: "视觉设计师 / 创意工作者",
    experience: [
      {
        period: "2024 — NOW",
        title: "职位名称 / 自由创作者",
        organization: "公司或工作室名称",
        description: "用一到两句话概括你的职责、擅长方向和代表成果。"
      },
      {
        period: "2022 — 2024",
        title: "上一段工作经历",
        organization: "公司或团队名称",
        description: "这里之后可以替换为真实的项目类型、工作内容和成绩。"
      }
    ],
    education: [
      {
        period: "2018 — 2022",
        title: "专业名称",
        organization: "学校名称",
        description: "学位、研究方向或值得说明的学习经历。"
      }
    ],
    skills: ["品牌设计", "视觉系统", "版式设计", "UI / UX", "Motion", "Creative Direction"]
  },
  projects: [
    {
      id: "project-01",
      number: "01",
      title: "福客满 APP 改版设计",
      category: "UI / UX",
      year: "2026",
      role: "UI设计 / 视觉设计 / AIGC / AI协同开发",
      summary: "围绕会员焕新、体验优化、品牌强化与视觉升级，完成福客满 APP 的系统性改版设计。",
      accent: "#ff396e",
      surface: "#fff7f4",
      cover: "./assets/fukeman/slide-01.webp",
      metric: "16 页完整案例",
      challenge: "原有界面在信息识别、浏览效率、会员价值感知与品牌一致性上存在明显断层。",
      approach: "通过体验走查与定量调研重构首页、搜索、会员、签到及 AI 问答链路，并以小福 IP 建立更有温度的品牌体验。",
      outcome: "形成覆盖核心消费链路、会员经营、智能服务与 IP 场景延展的完整设计方案，并借助 AI Coding 验证关键功能。",
      frames: [
        { src: "./assets/fukeman/slide-01.webp", alt: "福客满 APP 改版设计项目封面" },
        { src: "./assets/fukeman/slide-02.webp", alt: "福客满项目背景" },
        { src: "./assets/fukeman/slide-03.webp", alt: "体验走查与设计目标" },
        { src: "./assets/fukeman/slide-04.webp", alt: "首屏视觉优化" },
        { src: "./assets/fukeman/slide-05.webp", alt: "首页卡片化表达焕新" },
        { src: "./assets/fukeman/slide-06.webp", alt: "搜索场景浏览体验优化" },
        { src: "./assets/fukeman/slide-10.webp", alt: "提升会员长期价值感知" },
        { src: "./assets/fukeman/slide-07.webp", alt: "会员开通页重构" },
        { src: "./assets/fukeman/slide-12.webp", alt: "积分签到改版升级" },
        { src: "./assets/fukeman/slide-08.webp", alt: "AI 对话场景的视觉表达" },
        { src: "./assets/fukeman/slide-09.webp", alt: "AI 问答体验优化" },
        { src: "./assets/fukeman/slide-13.webp", alt: "AI 协同功能构建" },
        { src: "./assets/fukeman/slide-11.webp", alt: "IP 小福营养师优化" },
        { src: "./assets/fukeman/slide-16.webp", alt: "IP 场景化延展" },
        { src: "./assets/fukeman/slide-15.webp", alt: "情感化 IP 陪伴式体验" },
        { src: "./assets/fukeman/slide-14.webp", alt: "项目视觉总览" }
      ]
    },
    {
      id: "project-02",
      number: "02",
      title: "运营设计",
      category: "运营设计",
      year: "2026",
      role: "运营设计 / 视觉设计 / AIGC",
      summary: "以“7天轻养生计划”为主题，把泡脚、阅读、早餐、散步和营养补给转化为可持续参与的轻量运营体验。",
      accent: "#a8ef32",
      surface: "#07140a",
      cover: "./assets/operation-design/slide-01.webp",
      metric: "8 页完整案例",
      challenge: "面向生活节奏快、关注健康却难以长期坚持的年轻用户，需要降低参与门槛并建立连续参与动力。",
      approach: "通过生活场景任务、连续打卡、阶段反馈与奖励承接，将内容种草、习惯培养和商品权益串联为完整运营链路。",
      outcome: "形成一套以小福 IP 为核心、覆盖五种生活场景的系列化活动视觉，并强化活动入口与奖励转化。",
      frames: [
        { src: "./assets/operation-design/slide-01.webp", alt: "运营设计：元气养生计划封面" },
        { src: "./assets/operation-design/slide-02.webp", alt: "运营设计项目介绍" },
        { src: "./assets/operation-design/slide-03.webp", alt: "活动页面的信息视觉规划" },
        { src: "./assets/operation-design/slide-04.webp", alt: "IP 场景化视觉探索" },
        { src: "./assets/operation-design/slide-05.webp", alt: "三日递进连续反馈的情绪化设计" },
        {
          src: "./assets/operation-design/slide-06.webp",
          alt: "静态聚焦信息与动效奖励反馈",
          overlays: [
            {
              src: "./assets/operation-design/operation-motion.gif",
              alt: "奖励弹窗动效展示",
              left: 39.17,
              top: 15.28,
              width: 19.53,
              height: 75.19
            }
          ]
        },
        { src: "./assets/operation-design/slide-07.webp", alt: "同一 IP 延展三种健康生活场景" },
        { src: "./assets/operation-design/slide-08.webp", alt: "五种生活场景持续唤起活动入口" }
      ]
    },
    {
      id: "project-03",
      number: "03",
      title: "AIGC创作",
      category: "AIGC",
      year: "2026",
      role: "创意策划 / AI 生成 / 后期整合",
      summary: "以年轻都市女性与红色大象 IP 为主角，通过创意判断、AI 生成与后期整合，完成一支 60 秒健康电商动画广告。",
      accent: "#7c5cff",
      surface: "#07101f",
      cover: "./assets/aigc-creation/slide-01-updated.png",
      metric: "6 页案例 + 1 页成片",
      challenge: "如何在保持人物与 IP 一致性的同时，将创意脚本稳定转化为可剪辑、可配音、可交付的连续画面？",
      approach: "先确定传播重点与分镜，再用人物三视图和首尾关键帧锁定造型与镜头，通过多轮生成测试控制动作、场景和节奏。",
      outcome: "完成从脚本、分镜、角色定义、视频生成到素材清理、配音和剪辑交付的完整 AIGC 成片流程。",
      frames: [
        { src: "./assets/aigc-creation/slide-01-updated.png", alt: "AIGC创作项目封面" },
        { src: "./assets/aigc-creation/slide-02.webp", alt: "60秒AI广告项目概览" },
        { src: "./assets/aigc-creation/slide-03.webp", alt: "从创意方向到最终分镜" },
        { src: "./assets/aigc-creation/slide-04.webp", alt: "人物三视图与关键帧生成" },
        { src: "./assets/aigc-creation/slide-05.webp", alt: "用首尾帧控制视频生成" },
        { src: "./assets/aigc-creation/slide-06.webp", alt: "生成素材清理、配音与剪辑" },
        {
          type: "video",
          src: "./assets/aigc-creation/final-film.mp4",
          alt: "AIGC 创作最终成片",
          poster: "./assets/aigc-creation/slide-01-updated.png"
        }
      ]
    },
    {
      id: "project-04",
      number: "04",
      title: "Vibe Coding",
      category: "Vibe Coding",
      year: "2026",
      role: "AI 产品规划 / 视觉检测 / 全栈开发",
      summary: "从产品边界、MVP 与工具链规划开始，通过 AI 协作完成 UI Inspector Lite 的开发，让界面规范检查从人工重复劳动变成可验证的小步循环。",
      accent: "#6275ff",
      surface: "#edf6ff",
      cover: "./assets/vibe-coding/slide-01.png",
      metric: "6 页完整案例",
      challenge: "人工重复检查 UI 截图成本高，单纯依靠视觉模型又难以稳定判断问题程度、准确定位元素并理解设计意图。",
      approach: "先定义 MVP 与检测边界，再结合视觉模型、OCR 和本地测量能力构建发现问题、生成候选、人工复核与正式纳入的检测闭环。",
      outcome: "完成 UI Inspector Lite 的可运行原型，覆盖色彩对比、文字排版、对齐、重复结构、间距与遮挡溢出六类主要 UI 规范问题。",
      frames: [
        { src: "./assets/vibe-coding/slide-01.png", alt: "Vibe Coding：UI Inspector Lite 项目封面" },
        { src: "./assets/vibe-coding/slide-02.png", alt: "项目概览与 AI 辅助规划" },
        { src: "./assets/vibe-coding/slide-03.png", alt: "把开发拆成可验证的小步循环" },
        { src: "./assets/vibe-coding/slide-04.png", alt: "视觉判断能力逐渐完善" },
        { src: "./assets/vibe-coding/slide-05.png", alt: "AI 提出疑点并由人工确认问题" },
        { src: "./assets/vibe-coding/slide-06.png", alt: "六类主要 UI 规范问题检测" }
      ]
    }
  ]
};
