import net from 'net';
import { encrypt } from './TcpEncryption';

/**
 * Connect a TCP socket to the supplied address and port before sending through a message.
 * @param mainWindow
 * @param info An object containing the necessary information to send a message, includes the encryption key, destination
 * IP Address and Port as well as the data to send.
 */
export default function runTcpClient(mainWindow: Electron.BrowserWindow, info: any) {
    const key: string = info.key;
    const serverAddress: string = info.address;
    const serverPort: number = info.port;
    const message: string = info.data;
    const timeOut: number = 3000; //Socket timeout in milliseconds

    // Create a TCP client
    const client = net.createConnection({ host: serverAddress, port: serverPort });

    // Manually time out
    client.setTimeout(timeOut);
    client.on('timeout', () => {
        mainWindow.webContents.send('backend_message', {
            channelType: "tcp_client_message",
            headerMessage: "TimedOut",
            mainText: `${serverAddress}:${serverPort}`
        });
        client.end();
    });

    client.on('close', () => {
        console.log('Connection closed');
    });

    client.on('error', (error) => {
        console.error('Error:', error.message);
    });

    const headerMessageType = "text";
    const headerMessageTypeBytes = Buffer.from(headerMessageType, 'utf16le');
    const headerLength = headerMessageTypeBytes.length;

    // Encrypt the message
    console.log(message, key)
    const encryptedData = encrypt(message, key);

    // Combine the header, header length, and encrypted data
    const headerAndData = Buffer.concat([
        Buffer.alloc(4, headerLength),  // 4-byte header length
        headerMessageTypeBytes,             // Header message type
        Buffer.from(encryptedData)          // Encrypted data
    ]);

    // Set the correct header length in the message in big-endian format or little depending on if the message
    // is sent to the NUC or a Station.
    switch (serverPort) {
        case 55555: //Tablet
            //TODO work out the format for Tablets
            break;

        case 55556: //NUC
            headerAndData.writeUInt32BE(headerLength, 0); // Write in big-endian format
            break;

        case 55557: //Station
            headerAndData.writeUInt32LE(headerLength, 0); // Write in little-endian format
            break;
    }

    sendDataInChunks(headerAndData, client, () => {
        console.log('Data sent successfully.');
        client.end();
    });
}

/**
 * Break the client data into chunks to ensure that all information is collected.
 * @param data
 * @param client
 * @param callback
 */
function sendDataInChunks(data, client, callback) {
    console.log('data', data)
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
