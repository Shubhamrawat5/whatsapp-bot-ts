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
    "reason" TEXT,
    "admin" TEXT,
    "memberjid" TEXT NOT NULL,

    CONSTRAINT "blacklist_pkey" PRIMARY KEY ("memberjid")
);

-- CreateTable
CREATE TABLE "countmember" (
    "groupjid" TEXT NOT NULL,
    "memberjid" TEXT NOT NULL,
    "message_count" INTEGER NOT NULL DEFAULT 0,
    "warning_count" INTEGER NOT NULL DEFAULT 0,
    "video_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "countmember_pkey" PRIMARY KEY ("memberjid","groupjid")
);

-- CreateTable
CREATE TABLE "groups" (
    "groupjid" TEXT NOT NULL,
    "gname" TEXT NOT NULL,
    "link" TEXT,
    "commands_disabled" TEXT[],

    CONSTRAINT "groups_pkey" PRIMARY KEY ("groupjid")
);

-- CreateTable
CREATE TABLE "members" (
    "memberjid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "donation" INTEGER NOT NULL DEFAULT 0,
    "milestones" TEXT[],

    CONSTRAINT "members_pkey" PRIMARY KEY ("memberjid")
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
CREATE UNIQUE INDEX "groups_link_key" ON "groups"("link");

-- CreateIndex
CREATE UNIQUE INDEX "milestonetext_sno_key" ON "milestonetext"("sno");

-- AddForeignKey
ALTER TABLE "blacklist" ADD CONSTRAINT "blacklist_memberjid_fkey" FOREIGN KEY ("memberjid") REFERENCES "members"("memberjid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "countmember" ADD CONSTRAINT "countmember_groupjid_fkey" FOREIGN KEY ("groupjid") REFERENCES "groups"("groupjid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "countmember" ADD CONSTRAINT "countmember_memberjid_fkey" FOREIGN KEY ("memberjid") REFERENCES "members"("memberjid") ON DELETE RESTRICT ON UPDATE CASCADE;
