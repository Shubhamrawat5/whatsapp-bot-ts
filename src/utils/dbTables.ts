import { createUnknownCmdTable } from "../db/addUnknownCmdDB";
import { createAuthTable } from "../db/authDB";
import { createbdayTable } from "../db/bdayDB";
import { createBlacklistTable } from "../db/blacklistDB";
import { createCountMemberTable } from "../db/countMemberDB";
import { createMembersTable } from "../db/membersDB";
import { createMetaTable } from "../db/metaDB";
import { createGroupsTable } from "../db/groupsDB";
import { createMilestoneTextTable } from "../db/milestoneDB";
import { createNewsTable } from "../db/newsDB";
import { createVotingTable } from "../db/VotingDB";

const createDbTables = async () => {
  console.log("- Creating all DB tables");
  await createUnknownCmdTable();
  await createAuthTable();
  await createbdayTable();
  await createBlacklistTable();
  await createCountMemberTable();
  await createMembersTable();
  await createMetaTable();
  await createGroupsTable();
  await createMilestoneTextTable();
  await createNewsTable();
  await createVotingTable();
  console.log("✔ Created all DB tables");
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
createDbTables();
