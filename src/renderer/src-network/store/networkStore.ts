import { defineStore } from "pinia";
import { Report } from "../interfaces/_report";

export const useNetworkStore = defineStore({
    id: 'network',
    state: () => ({
        reportTracker: {} as Report,
        speed: "",
        progress: ""
    }),
    actions: {
        /**
         * Reset the checking status of each website check if a user is restarting the checks.
         */
        resetWebsiteResults() {
            const keys = Object.keys(this.reportTracker);
            for (const key of keys) {
                const value = this.reportTracker[key];
                value.checkingStatus = "unchecked";
            }
        },

        /**
         * Update a report entry with the results of a check.
         * @param name The key identifying the check.
         * @param passedStatus The result of the check, represented as a string.
         * @param message Additional information or details about the check, if any.
         */
        updateReportTracker(name: string, passedStatus: string, message: string): void {
            this.reportTracker[name] = {
                ...this.reportTracker[name],
                checkingStatus: "checked",
                passedStatus,
                message,
            };
        }
    },
    getters: {

    }
});
