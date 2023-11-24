const crypto = require('crypto');

const keySize = 128;
const derivationIterations = 1000;

export function decrypt(cipherText: string, passPhrase: string): string {
    if (!cipherText || !passPhrase) {
        throw new Error('cipherText and passPhrase must not be empty.');
    }

    const cipherTextBytesWithSaltAndIv = base64StringToByteArray(cipherText);
    const saltStringBytes = cipherTextBytesWithSaltAndIv.slice(0, keySize / 8);
    const ivStringBytes = cipherTextBytesWithSaltAndIv.slice(keySize / 8, (keySize / 8) * 2);
    const cipherTextBytes = cipherTextBytesWithSaltAndIv.slice((keySize / 8) * 2);

    const password = crypto.pbkdf2Sync(passPhrase, saltStringBytes, derivationIterations, keySize / 8, 'sha1');
    const keyBytes = password.slice(0, keySize / 8);

    const symmetricKey = crypto.createDecipheriv('aes-128-cbc', keyBytes, ivStringBytes);
    const decryptedData = Buffer.concat([symmetricKey.update(cipherTextBytes), symmetricKey.final()]);

    let decryptedText = decryptedData.toString('utf16le'); // Unicode decoding

    // Trim any null characters at the end of the decrypted text
    decryptedText = decryptedText.replace(/\0+$/, '');

    // Remove control characters from the decrypted text
    const sanitizedInput = decryptedText.replace(/[\p{Cc}]/gu, '');

    console.log(sanitizedInput);

    return sanitizedInput;
}

export function encrypt(plainText: string, passPhrase: string): string {
    if (!plainText || !passPhrase) {
        throw new Error('plainText and passPhrase must not be empty.');
    }

    const saltStringBytes = generate128BitsOfRandomEntropy();
    const ivHex = generateRandomIv();

    const plainTextBytes = Buffer.from(plainText, 'utf16le'); // Unicode encoding

    const password = crypto.pbkdf2Sync(passPhrase, saltStringBytes, derivationIterations, keySize / 8, 'sha1');
    const keyBytes = password.slice(0, keySize / 8);

    const symmetricKey = crypto.createCipheriv('aes-128-cbc', keyBytes, hexStringToByteArray(ivHex));
    const encryptedData = Buffer.concat([symmetricKey.update(plainTextBytes), symmetricKey.final()]);

    const cipherTextBytes = Buffer.concat([saltStringBytes, hexStringToByteArray(ivHex), encryptedData]);

    return cipherTextBytes.toString('base64');
}

function base64StringToByteArray(base64String: string): Buffer {
    return Buffer.from(base64String, 'base64');
}

function generate128BitsOfRandomEntropy() {
    return crypto.randomBytes(128 / 8);
}

function generateRandomIv(): string {
    return crypto.randomBytes(16).toString('hex'); // Assuming IV size is 16 bytes (128 bits)
}

function hexStringToByteArray(hexString: string): Buffer {
    return Buffer.from(hexString, 'hex');
}
