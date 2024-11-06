import {
  AnyMessageContent,
  BaileysEventEmitter,
  BaileysEventMap,
  Contact,
  GroupMetadata,
  MiscMessageGenerationOptions,
  ParticipantAction,
  WAProto,
} from "@whiskeysockets/baileys";

export interface Bot {
  sendMessage: (
    jid: string,
    content: AnyMessageContent,
    options?: MiscMessageGenerationOptions
  ) => Promise<WAProto.WebMessageInfo | undefined>;
  groupMetadata: (jid: string) => Promise<GroupMetadata>;
  ev: BaileysEventEmitter & {
    process(
      handler: (events: Partial<BaileysEventMap>) => void | Promise<void>
    ): () => void;
    buffer(): void;
    // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
    createBufferedFunction<A extends any[], T_1>(
      work: (...args: A) => Promise<T_1>
    ): (...args: A) => Promise<T_1>;
    flush(force?: boolean | undefined): boolean;
    isBuffering(): boolean;
  };
  user: Contact | undefined;
  groupFetchAllParticipating: () => Promise<{
    [_: string]: GroupMetadata;
  }>;
  groupParticipantsUpdate: (
    jid: string,
    participants: string[],
    action: ParticipantAction
  ) => Promise<{ status: string; jid: string }[]>;
  groupSettingUpdate: (
    jid: string,
    setting: "announcement" | "locked" | "not_announcement" | "unlocked"
  ) => Promise<void>;
  groupInviteCode: (jid: string) => Promise<string | undefined>;
  groupUpdateSubject: (jid: string, subject: string) => Promise<void>;
}
