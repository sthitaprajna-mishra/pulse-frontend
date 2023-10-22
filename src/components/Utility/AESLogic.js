import { AES, enc } from "crypto-js";

export const encryptToken = (token, secretKey) => {
  const encryptedToken = AES.encrypt(token, secretKey).toString();
  return encryptedToken;
};

export const decryptToken = (encryptedToken, secretKey) => {
  try {
    // console.log(`encryptedToken: ${encryptedToken}; secretKey: ${secretKey}`);
    const decryptedToken = AES.decrypt(encryptedToken, secretKey).toString(
      enc.Utf8
    );
    // console.log(decryptedToken || "Return an empty string if decryption fails");
    return decryptedToken || ""; // Return an empty string if decryption fails
  } catch (error) {
    // console.log("Token decryption error:", error);
    return ""; // Return an empty string if decryption fails
  }
};
