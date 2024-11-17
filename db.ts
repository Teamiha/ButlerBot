export interface UserData {
  nick: string;
  name: string;
  birthday: string;
  status: string;
  cleaningStatus: string;
  reminderMode: string;
  keychain: Record<string, string>;
  notes: string;
}

export async function createNewUser(userId: number) {
  const kv = await Deno.openKv();

  const newUserData: UserData = {
    nick: "",
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
