import { getKv } from "./botStatic/kvClient.ts";

export interface UserData {
  nickName: string;
  name: string;
  birthday: string;
  status: string;
  cleaningStatus: string;
  reminderMode: string;
  keychain: Record<string, string>;
  notes: string;
}

export interface CleaningZones {
  kitchen: number;
  bathroomFirstFloor: number;
  bathroomSecondFloor: number;
}

export async function createNewUser(userId: number) {
  const kv = await Deno.openKv();

  const newUserData: UserData = {
    nickName: "",
    name: "",
    birthday: "",
    status: "",
    cleaningStatus: "",
    reminderMode: "",
    keychain: {},
    notes: "",
  };

  await kv.set(["reltubBot", "userId:", userId], newUserData);
}

export async function getUserIdByName(
  userName: string,
): Promise<number | null> {
  const kv = await getKv();
  const users = kv.list<UserData>({ prefix: ["reltubBot", "userId:"] });

  for await (const entry of users) {
    if (entry.value && entry.value.name === userName) {
      const key = entry.key[2] as string;
      const userId = Number(key.replace("userId:", ""));
      return userId;
    }
  }

  return null;
}

export async function updateUser<Key extends keyof UserData>(
  userId: number,
  dataUpdate: Key,
  valueUpdate: UserData[Key],
) {
  const kv = await getKv();
  const currentData = await kv.get<UserData>(["reltubBot", "userId:", userId]);
  if (
    currentData && currentData.value && `${dataUpdate}` in currentData.value
  ) {
    currentData.value[dataUpdate] = valueUpdate;
    await kv.set(["reltubBot", "userId:", userId], currentData.value);
  } else {
    console.log("Запись не найдена");
  }
}

export async function grantAccess(userId: number) {
  const kv = await getKv();

  const result = await kv.get<number[]>(["reltubBot", "accessList"]);
  const accessList = result.value || [];

  if (!accessList.includes(userId)) {
    accessList.push(userId);
    await kv.set(["reltubBot", "accessList"], accessList);
  }
}

export async function revokeAccess(userId: number) {
  const kv = await getKv();

  const result = await kv.get<number[]>(["reltubBot", "accessList"]);
  const accessList = result.value || [];

  const updatedList = accessList.filter((id) => id !== userId);

  await kv.set(["reltubBot", "accessList"], updatedList);
  await kv.delete(["reltubBot", "userId:", userId]);
}

export async function hasAccess(userId: number): Promise<boolean> {
  const kv = await getKv();

  const result = await kv.get<number[]>(["reltubBot", "accessList"]);
  const accessList = result.value || [];

  return accessList.includes(userId);
}

export async function getUser(userId: number) {
  const kv = await getKv();
  const user = await kv.get<UserData>(["reltubBot", "userId:", userId]);
  if (!user.value) {
    await createNewUser(userId);
    const newUserData = await kv.get(["reltubBot", "userId:", userId]);
    console.log("new user");
    return newUserData;
  }
  return user;
}

export async function getAllUserNames(): Promise<string[]> {
  const kv = await getKv();
  const users = kv.list<UserData>({ prefix: ["reltubBot", "userId:"] });
  const names: string[] = [];

  for await (const user of users) {
    if (user.value && user.value.name) {
      names.push(user.value.name);
    }
  }

  return names;
}

export async function getUserParametr<Key extends keyof UserData>(
  userId: number,
  parametr: Key,
) {
  const user = await getUser(userId);
  return (user.value as UserData)[parametr];
}

// console.log(await getUser(526827458));
