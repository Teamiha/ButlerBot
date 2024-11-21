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

  await kv.close();
}

export async function updateUser<Key extends keyof UserData>(
  userId: number,
  dataUpdate: Key,
  valueUpdate: UserData[Key],
) {
  const kv = await Deno.openKv();
  const currentData = await kv.get<UserData>(["reltubBot", "userId:", userId]);
  if (
    currentData && currentData.value && `${dataUpdate}` in currentData.value
  ) {
    currentData.value[dataUpdate] = valueUpdate;
    await kv.set(["reltubBot", "userId:", userId], currentData.value);
  } else {
    console.log("Запись не найдена");
  }
  await kv.close();
}

export async function grantAccess(userId: number) {
  const kv = await Deno.openKv();

  const result = await kv.get<number[]>(["reltubBot", "accessList"]);
  const accessList = result.value || [];

  if (!accessList.includes(userId)) {
    accessList.push(userId);
    await kv.set(["reltubBot", "accessList"], accessList);
  }

  await kv.close();
}

export async function revokeAccess(userId: number) {
  const kv = await Deno.openKv();

  const result = await kv.get<number[]>(["reltubBot", "accessList"]);
  const accessList = result.value || [];

  const updatedList = accessList.filter((id) => id !== userId);

  await kv.set(["reltubBot", "accessList"], updatedList);

  await kv.close();
}

export async function hasAccess(userId: number): Promise<boolean> {
  const kv = await Deno.openKv();

  const result = await kv.get<number[]>(["reltubBot", "accessList"]);
  const accessList = result.value || [];

  await kv.close();

  return accessList.includes(userId);
}

export async function getUser(userId: number) {
  const kv = await Deno.openKv();
  const user = await kv.get<UserData>(["reltubBot", "userId:", userId]);
  if (!user.value) {
    await createNewUser(userId);
    const newUserData = await kv.get(["reltubBot", "userId:", userId]);
    console.log("new user");
    await kv.close();
    return newUserData;
  }
  await kv.close();
  return user;
}

export async function getAllUserNames(): Promise<string[]> {
  const kv = await Deno.openKv();
  const users = kv.list<UserData>({ prefix: ["reltubBot", "userId:"] });
  const names: string[] = [];

  for await (const user of users) {
    if (user.value && user.value.name) {
      names.push(user.value.name);
    }
  }

  await kv.close();
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
