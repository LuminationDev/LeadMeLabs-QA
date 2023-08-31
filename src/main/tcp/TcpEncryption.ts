const crypto = require('crypto');

export function decrypt(cipherText, passPhrase) {
    let decrypted = '';
    for (let i = 0; i < cipherText.length; i += 108) {
        let substringLength = 108;
        if (cipherText.length < i + 108) {
            substringLength = cipherText.length - i;
        }
        decrypted += decrypt108(cipherText.substring(i, i + substringLength), passPhrase);
    }
    return decrypted.replace('_', '');
}

function decrypt108(cipherText, passPhrase) {
    const keySize = 128;
    const encryptedBytes = Buffer.from(cipherText, 'base64');

    // Extract salt, IV, and encrypted data
    const saltBytes = encryptedBytes.slice(0, 128 / 8);
    const ivBytes = encryptedBytes.slice(128 / 8, 128 / 8 * 2);
    const cipherTextBytes = encryptedBytes.slice(128 / 8 * 2);

    // Derive key from passphrase and salt
    const password = crypto.pbkdf2Sync(passPhrase, saltBytes, 1000, keySize / 8, 'sha1');
    const keyBytes = password.slice(0, keySize / 8);

    // Decrypt the message
    const decipher = crypto.createDecipheriv(`aes-${keySize}-cbc`, keyBytes, ivBytes);
    const decryptedData = Buffer.concat([decipher.update(cipherTextBytes), decipher.final()]);

    return decryptedData.toString('utf8').replace(/_+$/, ''); // Remove trailing underscores
}

export function encrypt(plainText, passPhrase) {
    let encrypted = '';
    if (plainText.length % 32 !== 0) {
        const requiredPadding = 32 - (plainText.length % 32);
        plainText += '_'.repeat(requiredPadding);
    }
    for (let i = 0; i < plainText.length; i += 32) {
        let substringLength = 32;
        if (plainText.length < i + 32) {
            substringLength = plainText.length - i;
        }
        encrypted += encrypt32(plainText.substring(i, i + substringLength), passPhrase);
    }

    return encrypted;
}

function encrypt32(plainText, passPhrase) {
    const keySize = 128;

    const saltBytes = generate128BitsOfRandomEntropy(); // Generate a random salt

    // Derive key from passphrase and salt
    const password = crypto.pbkdf2Sync(passPhrase, saltBytes, 1000, keySize / 8, 'sha1');
    const keyBytes = password.slice(0, keySize / 8);

    // Generate a random initialization vector (IV)
    const ivBytes = generate128BitsOfRandomEntropy();

    // Encrypt the message
    const cipher = crypto.createCipheriv(`aes-${keySize}-cbc`, keyBytes, ivBytes);
    const encryptedData = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);

    // Combine salt, IV, and encrypted data
    const combinedBytes = Buffer.concat([saltBytes, ivBytes, encryptedData]);

    // Convert combined bytes to Base64
    return combinedBytes.toString('base64');
}

function generate128BitsOfRandomEntropy() {
    return crypto.randomBytes(128 / 8);
}
