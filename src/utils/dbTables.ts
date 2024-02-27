import { createAuthTable } from "../db/authDB";
import { createbdayTable } from "../db/bdayDB";
import { createBlacklistTable } from "../db/blacklistDB";
import { createCountMemberTable } from "../db/countMemberDB";
import { createMembersTable } from "../db/membersDB";
import { createMetaTable } from "../db/metaDB";
import { createGroupsTable } from "../db/groupsDB";
import { createMilestoneTextTable } from "../db/milestoneDB";
import { createNewsTable } from "../db/newsDB";
import { createUnknownCmdTable } from "../db/unknownCmdDB";
import { createVotingTable } from "../db/votingDB";

const createDbTables = async () => {
  console.log("- Creating all DB tables");
  await createAuthTable();
  await createMembersTable();
  await createGroupsTable();
  await createbdayTable();
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
