import { defineStore } from "pinia";
import { Station } from "../types/_station";

export const usePasswordStore = defineStore({
    id: 'password',
    state: () => ({
        stations: [] as Station[],
        validSession: false,
        awaitingTwoStep: false,
        errorMessage: "",
        statusLogin: "",
        statusLogout: "",
        statusTwoFactor: "",
        savingDetails: false,
        saved: false,
        loaded: false,
        savingErrorMessage: ""
    }),
    actions: {
        resetStatuses() {
            this.statusLogin = "";
            this.statusLogout = "";
            this.statusTwoFactor = "";
            this.savingErrorMessage = "";
        }
    },
    getters: {
        getSavingDetails(state) {
            return state.savingDetails;
        }
    }
});
