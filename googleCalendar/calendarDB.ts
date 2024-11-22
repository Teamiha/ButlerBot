export interface OAuthTokens {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  expiry_date?: number;
}

export async function saveAdminOAuthTokens(tokens: OAuthTokens): Promise<void> {
  const kv = await Deno.openKv();
  await kv.set(["admin", "oauthTokens"], tokens);
  console.log("Токены успешно сохранены:", tokens);
  await kv.close();
}

export async function getAdminOAuthTokens(): Promise<OAuthTokens | null> {
  const kv = await Deno.openKv();
  const result = await kv.get<OAuthTokens>(["admin", "oauthTokens"]);
  await kv.close();
  return result.value || null;
}
