import crypto from "crypto-js";

export interface User {
  sub: string;
  iss: string;
  aud: string;
}

export async function getUser(): Promise<User | null> {
  try {
    const res = await fetch("/api/auth/user", {
      credentials: "include",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    return null;
  }
}

export function generateHash(pin: string, user: User): string {
  // Create hash using HMAC-SHA256 on client side
  const hmac = crypto.HmacSHA256(
    user.sub + user.iss + user.aud,
    pin,
  );
  console.log(`hash inputs:`)
  console.log(
    JSON.stringify(
      [user.sub, user.iss, user.aud, pin],
      null,
      4,
    ),
  );
  const hmacStr = hmac.toString();
  console.log(`hash result: [${hmacStr}]`)
  return hmacStr;
}
