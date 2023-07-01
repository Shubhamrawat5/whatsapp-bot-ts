import { createUnknownCmdTable } from "./db/addUnknownCmdDB";
import { createAuthTable } from "./db/authDB";
import { createbdayTable } from "./db/bdayDB";
import { createBlacklistTable } from "./db/blacklistDB";
import {
  createCountMemberTable,
  createCountMemberNameTable,
} from "./db/countMemberDB";
import { createCountTable } from "./db/countDB";
import { createCountVideoTable } from "./db/countVideoDB";
import { createDonationTable } from "./db/donationDB";
import { createGroupLinksEnabledTable } from "./db/groupLinksEnabled";
import { createGroupsTable } from "./db/groupsDataDB";
import { createGroupParticipantTable } from "./db/groupParticipantDB";
import {
  createMilestoneTable,
  createMilestoneTextTable,
} from "./db/milestoneDB";
import { createStudyTable } from "./db/postStudyDB";
import { createTechTable } from "./db/postTechDB";
import { createVotingAllTable } from "./db/votingAllDB";
import { createVotingTable } from "./db/VotingDB";
import { createCountWarningTable } from "./db/warningDB";
import { createGroupbackupTable } from "./db/backupDB";

const createDbTables = async () => {
  console.log("Creating all DB tables");
  await createUnknownCmdTable();
  await createAuthTable();
  await createbdayTable();
  await createBlacklistTable();
  await createCountMemberTable();
  await createCountMemberNameTable();
  await createCountTable();
  await createCountVideoTable();
  await createDonationTable();
  await createGroupLinksEnabledTable();
  await createGroupsTable();
  await createGroupParticipantTable();
  await createMilestoneTable();
  await createMilestoneTextTable();
  await createStudyTable();
  await createTechTable();
  await createVotingAllTable();
  await createVotingTable();
  await createCountWarningTable();
  await createGroupbackupTable();
  console.log("Created all DB tables");
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
createDbTables();
