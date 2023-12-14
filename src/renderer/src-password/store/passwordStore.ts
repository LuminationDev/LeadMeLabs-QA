import { defineStore } from "pinia";

export const usePasswordStore = defineStore({
    id: 'password',
    state: () => ({
        validSession: false,
        awaitingTwoStep: false,
        errorMessage: "",
        statusLogin: "",
        statusLogout: "",
        statusTwoFactor: ""
    }),
    actions: {
        resetStatuses() {
            this.statusLogin = "";
            this.statusLogout = "";
            this.statusTwoFactor = "";
        }
    },
    getters: {
    }
});
