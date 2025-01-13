export interface User {
  sub: string;
  iss: string;
  aud: string;
}

export async function getUser(): Promise<User | null> {
  try {
    const res = await fetch('/api/auth/user', {
      credentials: 'include'
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    return null;
  }
}
