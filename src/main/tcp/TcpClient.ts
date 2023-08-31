import net from 'net';
import { encrypt } from './TcpEncryption';

/**
 * Connect a TCP socket to the supplied address and port before sending through a message.
 * @param info An object containing the necessary information to send a message, includes the encryption key, destination
 * IP Address and Port as well as the data to send.
 */
export default function runTcpClient(info: any) {
    const key: string = info.key;
    const serverAddress: string = info.address;
    const serverPort: number = info.port;
    const message: string = info.data;

    // Create a TCP client
    const client = net.createConnection({ host: serverAddress, port: serverPort }, () => {
        const headerMessageType = "text";
        const headerMessageTypeBytes = Buffer.from(headerMessageType, 'utf8');
        const headerLength = headerMessageTypeBytes.length;

        // Encrypt the message
        const encryptedData = encrypt(message, key);

        // Combine the header, header length, and encrypted data
        const headerAndData = Buffer.concat([
            Buffer.alloc(4, headerLength),  // 4-byte header length
            headerMessageTypeBytes,             // Header message type
            Buffer.from(encryptedData)          // Encrypted data
        ]);

        // Set the correct header length in the message in big-endian format
        headerAndData.writeUInt32BE(headerLength, 0); // Write in big-endian format

        sendDataInChunks(headerAndData, client, () => {
            console.log('Data sent successfully.');
            client.end();
        });
    });

    function sendDataInChunks(data, client, callback) {
        const chunkSize = 1024; // Adjust this to an appropriate chunk size
        let offset = 0;

        function sendChunk() {
            const chunk = data.slice(offset, offset + chunkSize);
            offset += chunk.length;

            if (chunk.length > 0) {
                client.write(chunk, sendChunk);
            } else {
                callback();
            }
        }

        sendChunk();
    }

    client.on('close', () => {
        console.log('Connection closed');
    });

    client.on('error', (error) => {
        console.error('Error:', error.message);
    });
}
