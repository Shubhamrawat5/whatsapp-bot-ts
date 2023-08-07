/*
  Warnings:

  - The primary key for the `countmember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `groupjid` on the `countmember` table. All the data in the column will be lost.
  - You are about to drop the column `memberjid` on the `countmember` table. All the data in the column will be lost.
  - Added the required column `group_groupjid` to the `countmember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `member_memberjid` to the `countmember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "countmember" DROP CONSTRAINT "countmember_pkey",
DROP COLUMN "groupjid",
DROP COLUMN "memberjid",
ADD COLUMN     "group_groupjid" TEXT NOT NULL,
ADD COLUMN     "member_memberjid" TEXT NOT NULL,
ADD CONSTRAINT "countmember_pkey" PRIMARY KEY ("member_memberjid", "group_groupjid");

-- AddForeignKey
ALTER TABLE "countmember" ADD CONSTRAINT "countmember_group_groupjid_fkey" FOREIGN KEY ("group_groupjid") REFERENCES "group"("groupjid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "countmember" ADD CONSTRAINT "countmember_member_memberjid_fkey" FOREIGN KEY ("member_memberjid") REFERENCES "member"("memberjid") ON DELETE RESTRICT ON UPDATE CASCADE;
