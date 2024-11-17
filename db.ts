export interface UserData {
    name: string;
    birthday: string;
    status: string;
    cleaningStatus: string;
    reminderMode: string;
    keychain: Record<string, string>;
    notes: string;
}





async function createNewUser(userId: number) {
    const kv = await Deno.openKv();
    
    const newUserData: UserData = {
        name: "",
        birthday: "",
        status: "",
        cleaningStatus: "",
        reminderMode: "",
        keychain: {},
        notes: "",
    } 

    await kv.set(["reltubBot", "userId:", userId], newUserData);
    
    await kv.close();
}

    
