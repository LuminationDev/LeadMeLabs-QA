import { defineStore } from 'pinia';
import { NetworkInfo } from "../interfaces";

export const useStateStore = defineStore({
    id: 'state',
    state: () => ({
        //Current version of the application
        version: '',
        //Encryption key for TCP server and client
        key: '',
        //Local network information
        network: {} as NetworkInfo,
    }),
    actions: {

    },
    getters: {

    }
});
