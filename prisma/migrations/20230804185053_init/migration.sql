-- CreateTable
CREATE TABLE "auth" (
    "id" SERIAL NOT NULL,
    "noisekey" TEXT NOT NULL,
    "signedidentitykey" TEXT NOT NULL,
    "signedprekey" TEXT NOT NULL,
    "registrationid" TEXT NOT NULL,
    "advsecretkey" TEXT NOT NULL,
    "nextprekeyid" TEXT NOT NULL,
    "firstunuploadedprekeyid" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "me" TEXT NOT NULL,
    "signalidentities" TEXT NOT NULL,
    "lastaccountsynctimestamp" TEXT NOT NULL,
    "myappstatekeyid" TEXT NOT NULL,

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
    "number" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "admin" TEXT NOT NULL,

    CONSTRAINT "blacklist_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "countmember" (
    "memberjid" TEXT NOT NULL,
    "groupjid" TEXT NOT NULL,
    "message_count" INTEGER NOT NULL DEFAULT 0,
    "warning" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "countmember_pkey" PRIMARY KEY ("memberjid","groupjid")
);

-- CreateTable
CREATE TABLE "countvideo" (
    "memberjid" TEXT NOT NULL,
    "groupjid" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "countvideo_pkey" PRIMARY KEY ("memberjid","groupjid")
);

-- CreateTable
CREATE TABLE "meta" (
    "variable" TEXT NOT NULL,
    "value" BOOLEAN NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meta_pkey" PRIMARY KEY ("variable")
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
    "donation" INTEGER,
    "milestone" TEXT[],

    CONSTRAINT "members_pkey" PRIMARY KEY ("memberjid")
);

-- CreateTable
CREATE TABLE "milestoneString" (
    "sno" SERIAL NOT NULL,
    "milestone" TEXT NOT NULL,

    CONSTRAINT "milestoneString_pkey" PRIMARY KEY ("milestone")
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
