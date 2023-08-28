import { defineStore } from 'pinia'

export const useStateStore = defineStore({
    id: 'state',
    state: () => ({
        version: '', //Current version of the application
        key: '', //Encryption key for TCP server and client
    }),
    actions: {

    },
    getters: {

    }
});
