import { webcrypto as crypto } from 'node:crypto';

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error('Usage: node scripts/admin-password.mjs "<password of 12+ characters>"');
  process.exit(1);
}
const enc = new TextEncoder();
const salt = crypto.getRandomValues(new Uint8Array(16));
const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100000 }, key, 256);
const b64 = (b) => Buffer.from(b).toString('base64');
console.log(`pbkdf2$100000$${b64(salt)}$${b64(bits)}`);
