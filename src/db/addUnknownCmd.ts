import { Unknowncmd } from "@prisma/client";
import prisma from "../prismaClient";
import { loggerBot } from "../utils/logger";

export const getUnknownCmds = async (): Promise<Unknowncmd[]> => {
  try {
    const unknowncmds = await prisma.unknowncmd.findMany({
      orderBy: { count: "desc" },
    });

    return unknowncmds;
  } catch (error) {
    await loggerBot(undefined, "[getUnknownCmds DB]", error, undefined);
    return [];
  }
};

export const getUnknownCmd = async (
  command: string
): Promise<Unknowncmd | null> => {
  try {
    const unknowncmd = await prisma.unknowncmd.findUnique({
      where: {
        command,
      },
    });

    return unknowncmd;
  } catch (error) {
    await loggerBot(undefined, "[getUnknownCmd DB]", error, { command });
    return null;
  }
};

export const updateUnknownCmd = async (
  command: string
): Promise<Unknowncmd | null> => {
  try {
    const res = await getUnknownCmd(command);
    let unknowncmd: Unknowncmd;

    if (res) {
      unknowncmd = await prisma.unknowncmd.update({
        data: { count: res.count + 1 },
        where: { command },
      });
    } else {
      unknowncmd = await prisma.unknowncmd.create({
        data: { command, count: 1 },
      });
    }

    return unknowncmd;
  } catch (error) {
    await loggerBot(undefined, "[updateUnknownCmd DB]", error, { command });
    return null;
  }
};
