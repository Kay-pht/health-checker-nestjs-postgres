-- CreateTable
CREATE TABLE "Result" (
    "id" UUID NOT NULL,
    "missingNutrients" TEXT[],
    "recommendedFoods" TEXT[],
    "score" INTEGER NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);
