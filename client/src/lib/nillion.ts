
import { generateKeyPair } from '@nillion/client-wasm';
import { generateNillionVMSKeyPair } from '@nillion/client-vms';
import { useNillionKeyPair } from '@nillion/client-react-hooks';

export async function generateUserKeys(seed: string): Promise<[Uint8Array, Uint8Array]> {
  // Convert the hash string to bytes for use as seed
  const encoder = new TextEncoder();
  const seedBytes = encoder.encode(seed);
  
  // Generate VMS keypair using the seed
  const keyPair = await generateNillionVMSKeyPair(seedBytes);
  return keyPair;
}
