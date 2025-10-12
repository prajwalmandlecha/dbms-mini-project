-- DropForeignKey
ALTER TABLE "public"."Internship" DROP CONSTRAINT "Internship_externalMentorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Internship" DROP CONSTRAINT "Internship_internalMentorId_fkey";

-- AlterTable
ALTER TABLE "public"."Internship" ALTER COLUMN "externalMentorId" DROP NOT NULL,
ALTER COLUMN "internalMentorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Internship" ADD CONSTRAINT "Internship_externalMentorId_fkey" FOREIGN KEY ("externalMentorId") REFERENCES "public"."ExternalMentor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Internship" ADD CONSTRAINT "Internship_internalMentorId_fkey" FOREIGN KEY ("internalMentorId") REFERENCES "public"."InternalMentor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
