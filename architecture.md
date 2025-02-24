.
├── prisma/ # 1. ルートの Prisma ディレクトリ (スキーマファイル)
│ └── schema.prisma
├── src/
│ ├── app.module.ts
│ ├── main.ts
│ ├── completion/
│ │ ├── completion.controller.ts
│ │ ├── completion.module.ts
│ │ └── completion.service.ts
│ ├── auth/
│ │ ├── auth.controller.ts
│ │ ├── auth.module.ts
│ │ └── auth.service.ts
│ ├── result/
│ │ ├── result.controller.ts
│ │ ├── result.module.ts
│ │ └── result.service.ts
│ ├── mypage/
│ │ ├── mypage.controller.ts
│ │ ├── mypage.module.ts
│ │ └── mypage.service.ts
│ ├── openai/ # 2. OpenAI 専用のモジュール
│ │ ├── openai.module.ts
│ │ └── openai.service.ts
│ └── prisma/ # 3. src 内の Prisma モジュール (Prisma Client)
│ ├── prisma.module.ts
│ └── prisma.service.ts
└── package.json
