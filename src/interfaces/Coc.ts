export interface CocTag {
  tag: string;
  memberjid: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ClanDetails {
  tag: string;
  name: string;
  type: string;
  description: string;
  location: Location;
  isFamilyFriendly: boolean;
  badgeUrls: BadgeUrls;
  clanLevel: number;
  clanPoints: number;
  clanBuilderBasePoints: number;
  clanCapitalPoints: number;
  capitalLeague: League;
  requiredTrophies: number;
  warFrequency: string;
  warWinStreak: number;
  warWins: number;
  isWarLogPublic: boolean;
  warLeague: League;
  members: number;
  memberList: ClanMember[];
  labels: Label[];
  requiredBuilderBaseTrophies: number;
  requiredTownhallLevel: number;
  clanCapital: ClanCapital;
  chatLanguage: ChatLanguage;
}

export interface BadgeUrls {
  small: string;
  large: string;
  medium: string;
}

export interface League {
  id: number;
  name: string;
}

export interface ChatLanguage {
  id: number;
  name: string;
  languageCode: string;
}

export interface ClanCapital {
  capitalHallLevel: number;
  districts: District[];
}

export interface District {
  id: number;
  name: string;
  districtHallLevel: number;
}

export interface Label {
  id: number;
  name: string;
  iconUrls: LabelIconUrls;
}

export interface LabelIconUrls {
  small: string;
  medium: string;
}

export interface Location {
  id: number;
  name: string;
  isCountry: boolean;
  countryCode: string;
}

export interface ClanMember {
  tag: string;
  name: string;
  role: Role;
  townHallLevel: number;
  expLevel: number;
  league: LeagueClass;
  trophies: number;
  builderBaseTrophies: number;
  clanRank: number;
  previousClanRank: number;
  donations: number;
  donationsReceived: number;
  playerHouse?: PlayerHouse;
  builderBaseLeague: League;
}

export interface LeagueClass {
  id: number;
  name: string;
  iconUrls: LeagueIconUrls;
}

export interface LeagueIconUrls {
  small: string;
  tiny: string;
  medium?: string;
}

export interface PlayerHouse {
  elements: Element[];
}

export interface Element {
  type: Type;
  id: number;
}

export enum Type {
  Decoration = "decoration",
  Ground = "ground",
  Roof = "roof",
  Walls = "walls",
}

export enum Role {
  Admin = "admin",
  CoLeader = "coLeader",
  Leader = "leader",
  Member = "member",
}

export interface CocPlayer {
  tag: string;
  name: string;
  townHallLevel: number;
  townHallWeaponLevel: number;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  warStars: number;
  attackWins: number;
  defenseWins: number;
  builderHallLevel: number;
  builderBaseTrophies: number;
  bestBuilderBaseTrophies: number;
  role: string;
  warPreference: string;
  donations: number;
  donationsReceived: number;
  clanCapitalContributions: number;
  clan?: Clan;
  league: League;
  builderBaseLeague: BuilderBaseLeague;
  achievements: Achievement[];
  playerHouse: PlayerHouse;
  labels: Label[];
  troops: HeroEquipment[];
  heroes: HeroEquipment[];
  heroEquipment: HeroEquipment[];
  spells: HeroEquipment[];
}

export interface Achievement {
  name: string;
  stars: number;
  value: number;
  target: number;
  info: string;
  completionInfo: null | string;
  village: Village;
}

export enum Village {
  BuilderBase = "builderBase",
  ClanCapital = "clanCapital",
  Home = "home",
}

export interface BuilderBaseLeague {
  id: number;
  name: string;
}

export interface Clan {
  tag: string;
  name: string;
  clanLevel: number;
  badgeUrls: BadgeUrls;
}

export interface HeroEquipment {
  name: string;
  level: number;
  maxLevel: number;
  village: Village;
  equipment?: HeroEquipment[];
}
