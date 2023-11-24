import { defineStore } from 'pinia'

export const useConfigStore = defineStore({
    id: 'main',
    state: () => ({
        welcomeModal: false,
        editMode: false,
        existingApplianceFile: false,
        existingStationFile: false,
        showPreview: false,
        initialApplianceData: {},
        initialStationData: {},
        openedFilename: '' as string,
        cbusStatus: 'Uninitialized',
        systemStatusMessage: [] as string[],
        systemError: false,
        systemErrorMessage: [] as string[],
        userInformation: ''
    }),
    getters: {
        getWelcomeModal: (state) => {
            return state.welcomeModal
        },
        getErrorMessage: (state) => {
            if (state.systemError) {
                return state.systemErrorMessage
            }
            return ''
        },
        getUserInformation: (state) => {
            return state.userInformation
        }
    },
    actions: {
        setWelcomeModal(value: boolean): void {
            this.welcomeModal = value
        },
        setEditMode(value: boolean): void {
            this.editMode = value
        },
        setShowPreview(value: boolean): void {
            this.showPreview = value
        },
        // setExistingFile(value: boolean): void {
        //     this.setExistingFile(value)
        // },
        setOpenedFilename(filename: string): void {
            this.openedFilename = filename
        },
        setCbusStatus(status: string): void {
            this.cbusStatus = status
        },
        setErrorMessage(message: string): void {
            this.systemError = true
            this.systemErrorMessage.push(message)
        },
        setUserInformation(info: string) {
            this.userInformation = info
        },
        clearErrorMessage(index) {
            this.systemErrorMessage.splice(index, 1)
        },
        clearSystemMessage(index: number) {
            this.systemStatusMessage.splice(index, 1)
        },
        setSystemMessage(message: string) {
            this.systemStatusMessage.push(message)
        }
    }
})
