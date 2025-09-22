-- CreateEnum
CREATE TYPE "public"."AcademicYears" AS ENUM ('YEAR_2023_24', 'YEAR_2024_25', 'YEAR_2025_26');

-- CreateEnum
CREATE TYPE "public"."InternshipMode" AS ENUM ('REMOTE', 'ONSITE', 'PART_TIME');

-- CreateEnum
CREATE TYPE "public"."EnggYear" AS ENUM ('FE', 'SE', 'TE', 'BE');

-- CreateTable
CREATE TABLE "public"."Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "website" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InternalMentor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobileNo" TEXT NOT NULL,

    CONSTRAINT "InternalMentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExternalMentor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobileNo" TEXT NOT NULL,

    CONSTRAINT "ExternalMentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Student" (
    "id" SERIAL NOT NULL,
    "rollno" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" "public"."EnggYear" NOT NULL,
    "div" TEXT NOT NULL,
    "mobileNo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Internship" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "academicYear" "public"."AcademicYears" NOT NULL,
    "duration" INTEGER NOT NULL,
    "mode" "public"."InternshipMode" NOT NULL,
    "stipend" DOUBLE PRECISION NOT NULL,
    "PPO" BOOLEAN NOT NULL DEFAULT false,
    "CompletionCertificate" TEXT NOT NULL,
    "Remarks" TEXT,
    "CompanyId" INTEGER NOT NULL,
    "externalMentorId" INTEGER NOT NULL,
    "internalMentorId" INTEGER NOT NULL,

    CONSTRAINT "Internship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudentInternship" (
    "studentId" INTEGER NOT NULL,
    "internshipId" INTEGER NOT NULL,

    CONSTRAINT "StudentInternship_pkey" PRIMARY KEY ("studentId","internshipId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "public"."Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "public"."Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "InternalMentor_email_key" ON "public"."InternalMentor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalMentor_email_key" ON "public"."ExternalMentor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_rollno_key" ON "public"."Student"("rollno");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "public"."Student"("email");

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Internship" ADD CONSTRAINT "Internship_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Internship" ADD CONSTRAINT "Internship_externalMentorId_fkey" FOREIGN KEY ("externalMentorId") REFERENCES "public"."ExternalMentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Internship" ADD CONSTRAINT "Internship_internalMentorId_fkey" FOREIGN KEY ("internalMentorId") REFERENCES "public"."InternalMentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentInternship" ADD CONSTRAINT "StudentInternship_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentInternship" ADD CONSTRAINT "StudentInternship_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "public"."Internship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
