import CryptoJS from "crypto-js";

/**
 * Server Side AES Encryption
 * @param plainText
 * @returns
 * @throws Error
 * @example
 * clientSideAESDecrypt("aeshash")
 */
export const serverSideAESEncrypt = (plainText: string) => {
  try {
    return CryptoJS.AES.encrypt(plainText, `${process.env.AES_KEY}`).toString();
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * Server Side AES Decryption
 * @param AESHash
 * @returns
 * @throws Error
 * @example
 * clientSideAESDecrypt("aeshash")
 */
export const serverSideAESDecrypt = (AESHash: string): string => {
  try {
    return CryptoJS.AES.decrypt(AESHash, `${process.env.AES_KEY}`).toString(
      CryptoJS.enc.Utf8
    );
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * Client Side AES Encryption
 * @param plainText
 * @param AES_KEY
 * @returns
 * @throws Error
 * @example
 * clientSideAESDecrypt("aeshash", "my secret key")
 */
export const clientSideAESEncrypt = (
  plainText: string,
  AES_KEY: string
): string => {
  try {
    return CryptoJS.AES.encrypt(plainText, `${AES_KEY}`).toString();
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * Client Side AES Decryption
 * @param AESHash
 * @param AES_KEY
 * @returns
 * @throws Error
 * @example
 * clientSideAESDecrypt("aeshash", "my secret key")
 */
export const clientSideAESDecrypt = (
  AESHash: string,
  AES_KEY: string
): string => {
  try {
    return CryptoJS.AES.decrypt(AESHash, `${AES_KEY}`).toString(
      CryptoJS.enc.Utf8
    );
  } catch (error: any) {
    throw new Error(error);
  }
};

const cryptoAES = {
  serverSideAESEncrypt,
  serverSideAESDecrypt,
  clientSideAESEncrypt,
  clientSideAESDecrypt,
};

export default cryptoAES;
