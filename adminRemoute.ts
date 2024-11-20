import type { UserData } from "./db.ts";

const kv = await Deno.openKv(
  "https://api.deno.com/databases/2e98651c-42ea-4252-87db-2d523699ec9b/connect",
);

async function grantAccess(userId: number) {
  const result = await kv.get<number[]>(["reltubBot", "accessList"]);
  const accessList = result.value || [];

  if (!accessList.includes(userId)) {
    accessList.push(userId);
    await kv.set(["reltubBot", "accessList"], accessList);
  }

  await kv.close();
}

export async function getUser(userId: number) {
  const user = await kv.get<UserData>(["reltubBot", "userId:", userId]);
  return user.value;
}

// grantAccess(526827458)
// console.log(await getUser(526827458));
