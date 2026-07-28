-- CreateTable
CREATE TABLE "Prediction" (
    "id" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "correct" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);
