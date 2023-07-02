import { createUnknownCmdTable } from "./db/addUnknownCmdDB";
import { createAuthTable } from "./db/authDB";
import { createbdayTable } from "./db/bdayDB";
import { createBlacklistTable } from "./db/blacklistDB";
import { createCountMemberTable } from "./db/countMemberDB";
import { createMembersTable } from "./db/membersDB";
import { createCountVideoTable } from "./db/countVideoDB";
import { createGroupLinksEnabledTable } from "./db/groupLinksEnabled";
import { createGroupsTable } from "./db/groupsDB";
import {
  createMilestoneTable,
  createMilestoneTextTable,
} from "./db/milestoneDB";
import { createStudyTable } from "./db/postStudyDB";
import { createTechTable } from "./db/postTechDB";
import { createVotingTable } from "./db/VotingDB";

const createDbTables = async () => {
  console.log("Creating all DB tables");
  await createUnknownCmdTable();
  await createAuthTable();
  await createbdayTable();
  await createBlacklistTable();
  await createCountMemberTable();
  await createMembersTable();
  await createCountVideoTable();
  await createGroupLinksEnabledTable();
  await createGroupsTable();
  await createMilestoneTable();
  await createMilestoneTextTable();
  await createStudyTable();
  await createTechTable();
  await createVotingTable();
  console.log("Created all DB tables");
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
createDbTables();
