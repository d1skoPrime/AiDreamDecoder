-- DropForeignKey
ALTER TABLE "Analysis" DROP CONSTRAINT "Analysis_dreamId_fkey";

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_dreamId_fkey" FOREIGN KEY ("dreamId") REFERENCES "Dream"("id") ON DELETE CASCADE ON UPDATE CASCADE;
