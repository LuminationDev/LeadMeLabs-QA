import net from 'net';
import { decrypt } from './TcpEncryption';

/**
 * This class a TCP Server along with their associated handles. The TCP server handles communication from external
 * sources, in this case messages from the NUC or Stations. Any message received is passed to Socket.IO for frontend visuals and manipulation.
 */
export default class TcpServer {
    ipcMain: Electron.IpcMain;
    mainWindow: Electron.BrowserWindow;
    tcpServer: net.Server|undefined;

    constructor(ipcMain: Electron.IpcMain, mainWindow: Electron.BrowserWindow) {
        this.ipcMain = ipcMain;
        this.mainWindow = mainWindow;
    }

    /**
     * Control the TcpServer classes internal functions.
     * @param info An object containing the command and any necessary data.
     */
    handleCommand(info: any): void {
        const { command } = info;
        switch(command) {
            case "start":
                this.startServer(info.address ?? null, info.port ?? null, info.key);
                break;

            case "stop":
                this.stopServer();
                break

            default:
                console.log(`TcpServer - Unknown command: ${JSON.stringify(info)}`);
                break;
        }
    }

    /**
     * Start the TCP server if it is not already listening, or it is null or undefined.
     */
    startServer(address: string|null, port: number|null, key: string): void {
        if(this.tcpServer?.listening) {
            return;
        }

        // Create a TCP server
        this.tcpServer = net.createServer((socket) => {
            const remoteAddress = socket.remoteAddress;
            console.log(`TCP client connected: ${remoteAddress}`);

            //Initialise the variables used for each socket connection
            let headerBytes: number = 4;
            let headerLength: number | null = null;
            let headerMessage: string | null = null;
            let encryptedMainText: string = "";
            let onlyBytes: boolean = false;

            // Handle data received from the TCP client
            socket.on('data', (data) => {
                const buffer = Buffer.from(data);

                // Parse the header length from the first 4 bytes, considering byte order
                if (headerLength === null) {
                    headerLength = buffer.readUInt32LE(0); // Default to little-endian

                    if (headerLength > 16) {
                        headerLength = buffer.readUInt32BE(0); // Switch to big-endian for large headers
                    }

                    // Bail out if only the header length was sent
                    if (buffer.length === headerBytes) {
                        onlyBytes = true;
                        return;
                    }
                }

                // Slice out the header type from the buffer
                // BEWARE: headerStart depends on if only the header length was sent in the first message
                if (headerMessage === null) {
                    const headerStart = onlyBytes ? 0 : headerBytes;
                    headerMessage = buffer.slice(headerStart, headerStart + headerLength).toString('utf8');
                    encryptedMainText += buffer.slice(headerStart + headerLength).toString('utf8');
                    return;
                }

                // Message has been split into data chunks, continue to add the chunks to the overall received text
                if (headerMessage.length > 0) {
                    encryptedMainText += buffer.toString('utf8');
                }
            });

            // Handle TCP client disconnections
            socket.on('end', () => {
                console.log('TCP client disconnected');

                // Bail out early if there is nothing to decrypt
                if (encryptedMainText.length === 0) return;

                // Decrypt the collective encrypted main text
                const mainText = decrypt(encryptedMainText, key);

                // Send to the frontend via Electron.IpcMain
                this.mainWindow.webContents.send('backend_message', {
                    channelType: "tcp_server_message",
                    headerMessage,
                    mainText
                });
            });

            // Handle TCP client errors
            socket.on('error', (error) => {
                console.error('TCP client error:', error);
                //Unsure if the error will cause a server stoppage
                //this.sendStatus("false");
            });
        });

        // Create the TCP options
        const options = {
            host: address != null ? address : undefined,
            port: port != null ? port : undefined
        };

        // Start the TCP server
        this.tcpServer.listen(options, () => {
            console.log('TCP server started, listening on ', this.tcpServer?.address());
            this.sendStatus("true");
        });
    }

    /**
     * If the tcpServer is not null or undefined close the connection.
     */
    stopServer(): void {
        this.tcpServer?.close();
        this.sendStatus("false");
        console.log('TCP server stopped');
    }

    /**
     * Send the status of the TCP server to the frontend.
     * @param status A string that is either 'true' (server running) or 'false' (server stopped)
     */
    sendStatus(status: string): void {
        this.mainWindow.webContents.send('backend_message', {
            channelType: "tcp_server_message",
            headerMessage:"status",
            mainText:`ServerStatus:${status}`
        });
    }
}
