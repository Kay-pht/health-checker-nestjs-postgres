/*
  Warnings:

  - You are about to drop the `Allergy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AllergyToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserAllergy" DROP CONSTRAINT "UserAllergy_allergyId_fkey";

-- DropForeignKey
ALTER TABLE "_AllergyToUser" DROP CONSTRAINT "_AllergyToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_AllergyToUser" DROP CONSTRAINT "_AllergyToUser_B_fkey";

-- DropTable
DROP TABLE "Allergy";

-- DropTable
DROP TABLE "_AllergyToUser";

-- CreateTable
CREATE TABLE "AllergyTypes" (
    "id" UUID NOT NULL,
    "name" VARCHAR(15) NOT NULL,

    CONSTRAINT "AllergyTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AllergyTypesToUser" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_AllergyTypesToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "AllergyTypes_name_key" ON "AllergyTypes"("name");

-- CreateIndex
CREATE INDEX "_AllergyTypesToUser_B_index" ON "_AllergyTypesToUser"("B");

-- AddForeignKey
ALTER TABLE "UserAllergy" ADD CONSTRAINT "UserAllergy_allergyId_fkey" FOREIGN KEY ("allergyId") REFERENCES "AllergyTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllergyTypesToUser" ADD CONSTRAINT "_AllergyTypesToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "AllergyTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllergyTypesToUser" ADD CONSTRAINT "_AllergyTypesToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
