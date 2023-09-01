import { defineStore } from 'pinia';

export const useStateStore = defineStore({
    id: 'state',
    state: () => ({
        //Current version of the application
        version: '',
        //Encryption key for TCP server and client
        key: '',
        //Local network information
        PortDetails: String,
    }),
    actions: {
        insertSpaceBetweenCapitalLetters(str: string) {
            return str.replace(/([a-z])([A-Z])/g, '$1 $2');
        },
    },
    getters: {

    }
});
