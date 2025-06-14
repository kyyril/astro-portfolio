/*
  Warnings:

  - You are about to drop the column `messageId` on the `replies` table. All the data in the column will be lost.
  - Added the required column `guestbookEntryId` to the `replies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "replies_messageId_fkey";

-- AlterTable
ALTER TABLE "replies" DROP COLUMN "messageId",
ADD COLUMN     "guestbookEntryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_guestbookEntryId_fkey" FOREIGN KEY ("guestbookEntryId") REFERENCES "guestbook_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
