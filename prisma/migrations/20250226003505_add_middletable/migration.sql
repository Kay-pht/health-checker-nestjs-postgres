-- CreateTable
CREATE TABLE "Result" (
    "id" UUID NOT NULL,
    "missingNutrients" TEXT[],
    "recommendedFoods" TEXT[],
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Allergy" (
    "id" UUID NOT NULL,
    "name" VARCHAR(15) NOT NULL,

    CONSTRAINT "Allergy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAllergy" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "allergyId" UUID NOT NULL,
    "severity" VARCHAR(15) NOT NULL,

    CONSTRAINT "UserAllergy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AllergyToUser" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_AllergyToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Result_userId_idx" ON "Result"("userId");

-- CreateIndex
CREATE INDEX "Result_createdAt_idx" ON "Result"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Allergy_name_key" ON "Allergy"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserAllergy_userId_allergyId_key" ON "UserAllergy"("userId", "allergyId");

-- CreateIndex
CREATE INDEX "_AllergyToUser_B_index" ON "_AllergyToUser"("B");

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAllergy" ADD CONSTRAINT "UserAllergy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAllergy" ADD CONSTRAINT "UserAllergy_allergyId_fkey" FOREIGN KEY ("allergyId") REFERENCES "Allergy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllergyToUser" ADD CONSTRAINT "_AllergyToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Allergy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllergyToUser" ADD CONSTRAINT "_AllergyToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
