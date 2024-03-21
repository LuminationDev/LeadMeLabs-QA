import { Socket } from 'net'
import crypto from 'crypto';

export default class PanasonicConnector {
    private static ESC_VP_HANDSHAKE = ''
    private readonly ip: string
    private readonly port: number
    private readonly username: string
    private readonly password: string
    public projectorDesc: string
    public socketClient?: Socket
    public resolve: any

    constructor(ip: string, port = 1024, username: string, password: string, projectorDesc?: string) {
        this.ip = ip
        this.port = port
        this.username = username
        this.password = password
        this.projectorDesc = projectorDesc ? projectorDesc : 'Projector'
    }

    public clientLogger(message: string): void {
        console.log('Client:: ' + message)
    }

    public serverLogger(message: string): void {
        console.log('Server:: ' + message)
    }

    private handleUncaughtException = (): void => {
        this.socketClient = undefined
        this.clientLogger('Failed to Establish TCP connection')
        this.resolve('ERR Connecting to the IP Address')
    }

    public init = (): void => {}

    public sendMessage(resolve, message: string): void {
        this.socketClient = new Socket()
        this.socketClient.connect({ host: this.ip, port: this.port })
        this.resolve = resolve

        process.on('uncaughtException', this.handleUncaughtException)
        this.socketClient.setTimeout(10000, () => {
            // @ts-ignore unknown type loaded
            process.removeListener('uncaughtException', handleUncaughtException)
            this.socketClient?.destroy()
            this.resolve('ERR Connection Timeout')
        })
        this.socketClient.once('connect', () => {
            this.clientLogger('Sending Empty Handshake')
            this.socketClient?.write(PanasonicConnector.ESC_VP_HANDSHAKE)
        })

        this.socketClient.on('data', (data) => {
            const responseString = data.toString()
            this.serverLogger(responseString)

            if (responseString.includes("NTCONTROL 1")) {
                const parts = responseString.split(/\s+/).filter(Boolean);
                if (parts.length >= 3) {
                    const result = parts[2].trim();
                    const passPhrase = this.calculateMd5Hash(`${this.username}:${this.password}:${result}`);

                    const modifiedMessage = passPhrase + "00" + message + "\r";

                    this.clientLogger('Server Acknowledge Handshake')
                    setTimeout(() => {
                        // Remove whitespace to get cleaner message on console
                        this.clientLogger('Sending ' + modifiedMessage.replace(/(\r\n|\n|\r)/gm, ' '))
                        try {
                            this.socketClient?.write(modifiedMessage, 'utf-8', () => {
                            })
                        } catch (e) {
                            console.error('Caught Exception when trying to send message to server')
                        }
                    }, 200)
                }
            } else {
                // @ts-ignore inside if else
                this.socketClient.removeAllListeners()
                // @ts-ignore inside if else
                this.socketClient.destroy()
                // @ts-ignore unknown type loaded
                process.removeListener('uncaughtException', this.handleUncaughtException)
                this.clientLogger('connection has been closed')

                this.resolve(responseString)
            }
        })
    }

    public calculateMd5Hash(input: string) {
        const md5 = crypto.createHash('md5');

        md5.update(input, 'utf8');

        return md5.digest('hex');
    }
}
