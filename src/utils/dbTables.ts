import { createAuthTable } from "../db/authDB";
import { createMemberTable } from "../db/membersDB";
import { createGroupTable } from "../db/groupsDB";
import { createbirthdayTable } from "../db/birthdayDB";
import { createBlacklistTable } from "../db/blacklistDB";
import { createCountMemberTable } from "../db/countMemberDB";
import { createMetaTable } from "../db/metaDB";
import { createMilestoneTextTable } from "../db/milestoneDB";
import { createNewsTable } from "../db/newsDB";
import { createUnknownCmdTable } from "../db/unknownCmdDB";
import { createVotingTable } from "../db/votingDB";

const createDbTables = async () => {
  console.log("- Creating all DB tables");
  await createAuthTable();
  await createMemberTable();
  await createGroupTable();
  await createbirthdayTable();
  await createBlacklistTable();
  await createCountMemberTable();
  await createMetaTable();
  await createMilestoneTextTable();
  await createNewsTable();
  await createVotingTable();
  await createUnknownCmdTable();
  console.log("✔ Created all DB tables");
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
createDbTables();
