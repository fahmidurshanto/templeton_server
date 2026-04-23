import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const algorithm = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_sec_ket_for_now_at_least_32bytes'; 
// Use scrypt to derive a 32-byte key from the ENCRYPTION_KEY
const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
const IV_LENGTH = 16;

/**
 * Encrypts plain text to a reversible cipher.
 * @param {string} text - The plain text to encrypt.
 * @returns {string} - The encrypted string in the format iv:encryptedData.
 */
export function encryptText(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Decrypts an encrypted string back to the original text.
 * @param {string} encryptedText - The encrypted string (iv:encryptedData).
 * @returns {string} - The original plain text.
 */
export function decryptText(encryptedText) {
  if (!encryptedText || typeof encryptedText !== 'string' || !encryptedText.includes(':')) {
    return encryptedText;
  }

  const textParts = encryptedText.split(':');
  if (textParts.length < 2) return encryptedText;

  const ivHex = textParts.shift();
  if (ivHex.length !== IV_LENGTH * 2) return encryptedText;

  try {
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedData = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    // If decryption fails, it might be a regular hash or different format
    return encryptedText;
  }
}
