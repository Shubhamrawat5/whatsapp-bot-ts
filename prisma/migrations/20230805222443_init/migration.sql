-- CreateTable
CREATE TABLE "auth" (
    "id" SERIAL NOT NULL,
    "noisekey" TEXT,
    "signedidentitykey" TEXT,
    "signedprekey" TEXT,
    "registrationid" TEXT,
    "advsecretkey" TEXT,
    "nextprekeyid" TEXT,
    "firstunuploadedprekeyid" TEXT,
    "account" TEXT,
    "me" TEXT,
    "signalidentities" TEXT,
    "lastaccountsynctimestamp" TEXT,
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
    "memberjid" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "admin" TEXT NOT NULL,

    CONSTRAINT "blacklist_pkey" PRIMARY KEY ("memberjid")
);

-- CreateTable
CREATE TABLE "countmember" (
    "memberjid" TEXT NOT NULL,
    "groupjid" TEXT NOT NULL,
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
    "donation" INTEGER,
    "milestone" TEXT[],

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
CREATE TABLE "milestone" (
    "sno" SERIAL NOT NULL,
    "milestone" TEXT NOT NULL,

    CONSTRAINT "milestone_pkey" PRIMARY KEY ("milestone")
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
