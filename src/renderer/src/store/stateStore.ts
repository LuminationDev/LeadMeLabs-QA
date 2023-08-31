import { defineStore } from 'pinia';
import { NetworkInfo, SoftwareInfo, WindowsInfo } from "../interfaces";

export const useStateStore = defineStore({
    id: 'state',
    state: () => ({
        //Current version of the application
        version: '',
        //Encryption key for TCP server and client
        key: '',
        //Local network information
        network: {} as NetworkInfo,
        //Local windows information
        windows: {} as WindowsInfo,
        //Local software information
        software: {} as SoftwareInfo,
    }),
    actions: {
        insertSpaceBetweenCapitalLetters(str: string) {
            return str.replace(/([a-z])([A-Z])/g, '$1 $2');
        },
    },
    getters: {

    }
});
