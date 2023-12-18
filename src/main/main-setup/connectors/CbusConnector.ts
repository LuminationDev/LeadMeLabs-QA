import axios from 'axios'

export default class CbusConnector {
    private readonly creds: string
    private readonly cbusIP: string

    constructor(creds: string, cbusIP: string) {
        this.creds = creds
        this.cbusIP = cbusIP
        axios.defaults.headers.common['Authorization'] = this.generateCbusHeader(this.creds)
    }

    private getBaseAutomationLink(): string {
        return `http://${this.cbusIP}/scada-remote?m=json&r=cbus1`
    }

    private generateCbusHeader(creds: string): string {
        // const creds: string | undefined = process.env.CBUS_CREDS
        if (creds) {
            const buff = Buffer.from(creds)
            const credsBase64 = buff.toString('base64')
            return `Basic ${credsBase64}`
        }
        return ''
    }

    public async testConnection(): Promise<boolean> {
        const testLink = `${this.getBaseAutomationLink()}$c=get`
        return axios
            .get(testLink)
            .then((res) => {
                if (res.data.length > 0) {
                    return true
                } else {
                    return false
                }
            })
            .catch((err) => {
                console.log(err)
                return false
            })
    }

    public createSetLink(
        automationBase: string,
        automationGroup: string,
        automationId: string,
        value: string
    ): string {
        return (
            this.getBaseAutomationLink() +
            `&c=set&matchnet=${automationBase}&matchapp=${automationGroup}&matchgrp=${automationId}&value=${value}`
        )
    }

    public createScriptLink(group: string, application: string, address: string): string {
        return (
            this.getBaseAutomationLink() +
            `&c=set&matchnet=${group}&matchapp=${application}&matchgrp=${address}&value=`
        )
    }

    public createGetLink(group = '0', application: string, address = ''): string {
        let link = this.getBaseAutomationLink()
        if (application == 'appliances') {
            link += '&c=get'
        } else {
            link += `&c=get&matchnet=${group}&matchapp=${application}`
        }

        if (address != '') {
            link += `&matchgrp=${address}`
        }
        return link
    }

    public sendGetId(
        automationBase: string,
        automationGroup: string,
        automationId: string
    ): Promise<any> {
        const itemLink = this.createGetLink(automationBase, automationGroup, automationId)
        return axios
            .get(itemLink)
            .then((res) => {
                return res.data[0].id
            })
            .catch((err) => {
                console.log(err)
                return 0
            })
    }

    public getApplianceIdAndStatus(
        automationBase: string,
        automationGroup: string,
        automationId: string
    ): Promise<any> {
        const itemLink = this.createGetLink(automationBase, automationGroup, automationId)
        return axios
            .get(itemLink)
            .then((res) => {
                const applianceId = res.data[0].id
                const applianceStatus = res.data[0].data.target
                return {
                    id: applianceId,
                    status: applianceStatus
                }
            })
            .catch((err) => {
                console.log(err)
                return 0
            })
    }

    public sendSetValue(
        automationBase: string,
        automationGroup: string,
        automationId: string,
        value: number
    ): Promise<any> {
        const setLink = this.createSetLink(
            automationBase,
            automationGroup,
            automationId,
            value.toString()
        )
        return axios
            .get(setLink)
            .then((res) => {
                console.log('this is inside axios then for sendsetvalue')
                console.log('new value is' + value)
                console.log(res.data)
                return res.data
            })
            .catch((err) => {
                console.log(err)
                return 0
            })
    }
}
