import { BrowserWindow, dialog } from 'electron'
import PanasonicConnector from "../connectors/PanasonicConnector";

export async function sendCommandTcpPanasonic(
    mainWin: BrowserWindow,
    ip: string,
    port: number,
    username: string,
    password: string,
    desc: string,
    message: string)
{
    const panasonicConnector: PanasonicConnector = new PanasonicConnector(ip, port, username, password, desc)
    const response = new Promise<string>((resolve) => {
        panasonicConnector.sendMessage(resolve, message)
    })
    /**
     * PWR Codes
     * POF -> Off
     *
     * 01 -> Lamp on
     * 02 -> Warm Up
     * Both above considered to be on
     */
    await response.then(async (res) => {
        //remove the leading '00'
        let result = res.substring(2);

        if (result.includes('ERR')) {
            console.log('cause of error ' + message)
            console.log(res)
            mainWin.webContents.send('panasonic_status_update', {
                type: 'ERR',
                message: `Connection Error`,
                value: null
            })
            return;

        } else if (result.includes('ERRA')) {
            mainWin.webContents.send('panasonic_status_update', {
                type: 'ERR',
                message: `Username or Password is incorrect`,
                value: null
            })

            return;
        }

        // mainWin.webContents.send('panasonic_status_update', {
        //     type: 'details',
        //     username: await Encryption.encryptDataUTF16(username),
        //     password: await Encryption.encryptDataUTF16(password)
        // })

        if (
            result.includes('000') ||
            result.includes('POF') ||
            message.includes('PWR OFF')
        ) {
            console.log("Power off")
            mainWin.webContents.send('panasonic_status_update', {
                type: 'projectors',
                message: `${desc} is Off`,
                value: 0
            })
        } else if (
            result.includes('001') ||
            result.includes('PON') ||
            message.includes('PWR ON')
        ) {
            console.log("Power on")
            mainWin.webContents.send('panasonic_status_update', {
                type: 'projectors',
                message: `${desc} is On`,
                value: 255
            })
        } else if (
            result.includes('HD1') ||
            result.includes('DVI') ||
            result.includes('SD1')
        ) {
            console.log("Input: " + result)
            mainWin.webContents.send('panasonic_status_update', {
                type: 'sources',
                message: `${desc} is displaying input ${result}`,
                value: result
            })
        } else {
            console.log('Unknown command')
            dialog.showMessageBox({
                message: 'Unknown response received from epson ' + res
            })
        }
    })
}
