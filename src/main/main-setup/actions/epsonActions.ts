import { BrowserWindow, dialog } from 'electron'
import EpsonConnector from '../connectors/EpsonConnector'

export async function sendCommandTcpEpson(
    mainWin: BrowserWindow, ip: string,
    port: number,
    desc: string,
    message: string)
{
    const epsonConnector: EpsonConnector = new EpsonConnector(ip, port, desc)
    const response = new Promise<string>((resolve) => {
        epsonConnector.sendMessage(resolve, message)
    })
    /**
     * PWR Codes
     * 00 -> Off
     * 03 -> Cool down
     * 04 -> Standby Mode (Network ON)
     * All above considered current state off
     *
     * 01 -> Lamp on
     * 02 -> Warm Up
     * Both above considered to be on
     */
    await response.then((res) => {
        if (res.includes('ERR')) {
            console.log('cause of error ' + message)
            console.log(res)
            mainWin.webContents.send('epson_status_update', {
                type: 'ERR',
                message: `Connection Error`,
                value: null
            })
        } else if (
            res.includes('PWR=00') ||
            res.includes('PWR=03') ||
            res.includes('PWR=04') ||
            message.includes('PWR OFF')
        ) {
            mainWin.webContents.send('epson_status_update', {
                type: 'projectors',
                message: `${desc} is Off`,
                value: 0
            })
        } else if (
            res.includes('PWR=01') ||
            res.includes('PWR=02') ||
            message.includes('PWR ON')
        ) {
            mainWin.webContents.send('epson_status_update', {
                type: 'projectors',
                message: `${desc} is On`,
                value: 255
            })
        } else if (message.includes('SOURCE?')) {
            const key = res.split('=')[1].substring(0, 2)
            mainWin.webContents.send('epson_status_update', {
                type: 'sources',
                message: `${desc} is displaying input ${key}`,
                value: key
            })
        } else if (message.includes('SOURCE ')) {
            const key = message.split(' ')[1].substring(0, 2)
            mainWin.webContents.send('epson_status_update', {
                type: 'sources',
                message: `${desc} is displaying input ${key}`,
                value: key
            })
        } else {
            console.log('Unknown command')
            dialog.showMessageBox({
                message: 'Unknown response received from epson ' + res
            })
        }
    })
}
