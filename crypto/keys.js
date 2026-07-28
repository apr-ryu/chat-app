export async function generateKeys() {
  console.log("isSecureContext:", window.isSecureContext);
  console.log("crypto:", window.crypto);
  console.log("subtle:", window.crypto?.subtle);
  console.log("generateKey:", window.crypto?.subtle?.generateKey);
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey", "deriveBits"],
  );

  return keyPair;
}
