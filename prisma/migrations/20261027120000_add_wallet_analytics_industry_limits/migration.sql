-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "selectedIndustry" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "industry" TEXT;

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN IF NOT EXISTS "maxImagesPerProduct" INTEGER NOT NULL DEFAULT 3;

-- CreateTable
CREATE TABLE IF NOT EXISTS "Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balanceToman" BIGINT NOT NULL DEFAULT 0,
    "balanceUsdt" BIGINT NOT NULL DEFAULT 0,
    "pendingToman" BIGINT NOT NULL DEFAULT 0,
    "pendingUsdt" BIGINT NOT NULL DEFAULT 0,
    "lastPayoutAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "PageView" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "StoreView" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "productId" TEXT,
    "ipHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoreView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Wallet_userId_idx" ON "Wallet"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PageView_path_idx" ON "PageView"("path");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PageView_createdAt_idx" ON "PageView"("createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "StoreView_storeId_idx" ON "StoreView"("storeId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "StoreView_productId_idx" ON "StoreView"("productId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "StoreView_createdAt_idx" ON "StoreView"("createdAt");

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Wallet_userId_fkey'
    ) THEN
        ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
