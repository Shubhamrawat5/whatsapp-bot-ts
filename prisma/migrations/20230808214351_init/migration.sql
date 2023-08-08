-- CreateTable
CREATE TABLE "auth" (
    "id" SERIAL NOT NULL,
    "noisekey" TEXT NOT NULL,
    "signedidentitykey" TEXT NOT NULL,
    "signedprekey" TEXT NOT NULL,
    "registrationid" INTEGER NOT NULL,
    "advsecretkey" TEXT NOT NULL,
    "nextprekeyid" INTEGER NOT NULL,
    "firstunuploadedprekeyid" INTEGER NOT NULL,
    "account" TEXT,
    "me" TEXT,
    "signalidentities" TEXT,
    "lastaccountsynctimestamp" INTEGER,
    "myappstatekeyid" TEXT,

    CONSTRAINT "auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bday" (
    "number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "date" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER,
    "place" TEXT NOT NULL,

    CONSTRAINT "bday_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "blacklist" (
    "reason" TEXT NOT NULL,
    "admin" TEXT NOT NULL,
    "member_memberjid" TEXT NOT NULL,

    CONSTRAINT "blacklist_pkey" PRIMARY KEY ("member_memberjid")
);

-- CreateTable
CREATE TABLE "countmember" (
    "message_count" INTEGER NOT NULL DEFAULT 0,
    "warning_count" INTEGER NOT NULL DEFAULT 0,
    "video_count" INTEGER NOT NULL DEFAULT 0,
    "group_groupjid" TEXT NOT NULL,
    "member_memberjid" TEXT NOT NULL,

    CONSTRAINT "countmember_pkey" PRIMARY KEY ("member_memberjid","group_groupjid")
);

-- CreateTable
CREATE TABLE "group" (
    "groupjid" TEXT NOT NULL,
    "gname" TEXT NOT NULL,
    "link" TEXT,
    "commands_disabled" TEXT[],

    CONSTRAINT "group_pkey" PRIMARY KEY ("groupjid")
);

-- CreateTable
CREATE TABLE "member" (
    "memberjid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "donation" INTEGER NOT NULL DEFAULT 0,
    "milestone" TEXT[],

    CONSTRAINT "member_pkey" PRIMARY KEY ("memberjid")
);

-- CreateTable
CREATE TABLE "meta" (
    "variable" TEXT NOT NULL,
    "value" BOOLEAN NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meta_pkey" PRIMARY KEY ("variable")
);

-- CreateTable
CREATE TABLE "milestonetext" (
    "sno" SERIAL NOT NULL,
    "milestone" TEXT NOT NULL,

    CONSTRAINT "milestonetext_pkey" PRIMARY KEY ("milestone")
);

-- CreateTable
CREATE TABLE "news" (
    "headline" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("headline")
);

-- CreateTable
CREATE TABLE "voting" (
    "groupjid" TEXT NOT NULL,
    "is_started" BOOLEAN NOT NULL,
    "started_by" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "choices" TEXT[],
    "count" INTEGER[],
    "members_voted_for" TEXT[],
    "voted_members" TEXT[],

    CONSTRAINT "voting_pkey" PRIMARY KEY ("groupjid")
);

-- CreateTable
CREATE TABLE "unknowncmd" (
    "command" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "unknowncmd_pkey" PRIMARY KEY ("command")
);

-- CreateIndex
CREATE UNIQUE INDEX "group_link_key" ON "group"("link");

-- CreateIndex
CREATE UNIQUE INDEX "milestonetext_sno_key" ON "milestonetext"("sno");

-- AddForeignKey
ALTER TABLE "blacklist" ADD CONSTRAINT "blacklist_member_memberjid_fkey" FOREIGN KEY ("member_memberjid") REFERENCES "member"("memberjid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "countmember" ADD CONSTRAINT "countmember_group_groupjid_fkey" FOREIGN KEY ("group_groupjid") REFERENCES "group"("groupjid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "countmember" ADD CONSTRAINT "countmember_member_memberjid_fkey" FOREIGN KEY ("member_memberjid") REFERENCES "member"("memberjid") ON DELETE RESTRICT ON UPDATE CASCADE;
