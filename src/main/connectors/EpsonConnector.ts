import { Socket } from 'net'

export default class EpsonConnector {
    private static ESC_VP_HANDSHAKE = 'ESC/VP.net\u0010\u0003\u0000\u0000\u0000\u0000'
    private readonly ip: string
    private readonly port: number
    public projectorDesc: string
    public socketClient?: Socket
    public resolve: any

    constructor(ip: string, port = 3629, projectorDesc?: string) {
        this.ip = ip
        this.port = port
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
            this.clientLogger('Sending Handshake ESC/VP.net')
            this.socketClient?.write(EpsonConnector.ESC_VP_HANDSHAKE)
        })
        this.socketClient.on('data', (data) => {
            const responseString = data.toString()
            this.serverLogger(responseString)
            if (responseString.includes('ESC/VP.net')) {
                this.clientLogger('Server Acknowledge Handshake')
                setTimeout(() => {
                    // Remove whitespace to get cleaner message on console
                    this.clientLogger('Sending ' + message.replace(/(\r\n|\n|\r)/gm, ' '))
                    try {
                        this.socketClient?.write(message, 'utf-8', () => {})
                    } catch (e) {
                        console.error('Caught Exception when trying to send message to server')
                    }
                }, 200)
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
}
