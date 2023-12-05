import { defineStore } from "pinia";
import { Report } from "../interfaces/_report";

export const useNetworkStore = defineStore({
    id: 'network',
    state: () => ({
        reportTracker: {} as Report,
        //Used to track the progress and result of the speed test
        speed: "0",
        progress: "0",
        //Determine if the program is connected to the internet
        networkOnline: null
    }),
    actions: {
        /**
         * Reset the checking status of each website check if a user is restarting the checks.
         */
        resetWebsiteResults() {
            const keys = Object.keys(this.reportTracker["Firewall"]);
            for (const key of keys) {
                const value = this.reportTracker["Firewall"][key];
                value.checkingStatus = "unchecked";
            }
        },

        /**
         * Update a report entry with the results of a check.
         * @param section The key identifying the section.
         * @param name The key identifying the check.
         * @param passedStatus The result of the check, represented as a string.
         * @param message Additional information or details about the check, if any.
         */
        updateReportTracker(section: string, name: string, passedStatus: string, message: string): void {
            this.reportTracker[section][name] = {
                ...this.reportTracker[section][name],
                checkingStatus: "checked",
                passedStatus,
                message,
            };
        }
    },
    getters: {
        /**
         * Collect just the titles (keys) from the report tracker.
         */
        getReportTitles(state) {
            return Object.keys(state.reportTracker);
        }
    }
});
