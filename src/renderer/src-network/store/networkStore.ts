import { defineStore } from "pinia";
import { Report } from "../interfaces/_report";
import { useStateStore } from "../../store/stateStore";

export const useNetworkStore = defineStore({
    id: 'network',
    state: () => ({
        reportTracker: {} as Report,
        //Used to track the progress and result of the speed test
        speed: "0",
        progress: "0",
        //Used to track the current device ip connection attempt
        connectionState: "waiting",
        uploadResult: ""
    }),
    actions: {
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
                date: useStateStore().formattedDate(true)
            };
        },

        /**
         * Reset the checking status for each check.
         */
        resetReportState()  {
            //Loop through each category
            Object.entries(this.reportTracker).forEach(([index, _]) => {
                //Loop through each section
                Object.entries(this.reportTracker[index]).forEach(([_, check]) => {
                    check.checkingStatus = "checking";
                    check.passedStatus = "";
                    check.message = "";
                });
            });
        }
    },
    getters: {
        /**
         * Collect just the titles (keys) from the report tracker.
         */
        getReportTitles(state) {
            return Object.keys(state.reportTracker);
        },

        /**
         * Show the user a quick view of if the tests were passed by all devices.
         */
        generateCategoryStatus: (state) => (category: string) => {
            let { unchecked, testing, failed, skipped, passed, warning, not_applicable, total } =
                { unchecked: 0, testing: 0, failed: 0, skipped: 0, passed: 0, warning: 0, not_applicable: 0, total: 0 };

            Object.entries(state.reportTracker[category]).forEach(([_, item]) => {
                total += 1;

                const { passedStatus: status, checkingStatus: checking } = item;

                if (checking === 'unchecked') unchecked++;
                else if (checking === 'checking') testing++;
                else if (status === 'passed') passed++;
                else if (status === 'warning') warning++;
                else if (status === 'warning') warning++;
                else if (status === 'failed') failed++;
                else if (status === 'not_applicable') not_applicable++;
                else if (status === 'skipped' || status === undefined || checking === 'unchecked') skipped++;
            });

            if (unchecked === total) return 'not_started';
            if (unchecked > 0 || testing > 0) return 'testing...';
            if (failed > 0) return 'failed';
            if (warning > 0) return 'warning';
            if (skipped > 0 && (failed > 0 || passed > 0)) return 'incomplete';
            if (skipped > 0) return 'skipped';
            if (passed > 0 && passed + not_applicable === total) return 'passed';
            if (total === 0 || not_applicable > 0) return 'N/A';

            return 'unknown';
        },

        /**
         * Check if the tests are still running.
         */
        checkReportState: (state) => {
            let checked = 0;
            let unchecked = 0;
            let total = 0;

            Object.entries(state.reportTracker).forEach(([index, _]) => {
                Object.entries(state.reportTracker[index]).forEach(([_, check]) => {
                    total++;

                    if (check.checkingStatus === "unchecked" || check.checkingStatus === "checking") {
                        unchecked++;
                    }
                    else if (check.checkingStatus === "checked") {
                        checked++;
                    }
                });
            });

            if (unchecked === total) return 'caution'; //Tests have not started yet
            if (checked === total) return 'done'; //Tests are all complete
            return 'testing'; //Running tests
        },
    }
});
