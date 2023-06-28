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
import { createDisableCommandTable } from "./db/disableCommandDB";
import { createDonationTable } from "./db/donationDB";
import {
  createGroupLinksTable,
  createGroupLinksEnabledTable,
} from "./db/grouplinksDB";
import { createGroupNameTable } from "./db/groupNameDB";
import { createGroupParticipantTable } from "./db/groupParticipantDB";
import {
  createMilestoneTable,
  createMilestoneTextTable,
} from "./db/milestoneDB";
import { createMovieTable } from "./db/postMovieDB";
import { createSportTable } from "./db/postSportDB";
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
  await createDisableCommandTable();
  await createDonationTable();
  await createGroupLinksTable();
  await createGroupLinksEnabledTable();
  await createGroupNameTable();
  await createGroupParticipantTable();
  await createMilestoneTable();
  await createMilestoneTextTable();
  await createMovieTable();
  await createSportTable();
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
