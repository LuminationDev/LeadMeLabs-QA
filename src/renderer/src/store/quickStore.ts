import { defineStore } from 'pinia';

/**
 * Used to store values for the Lab's Quick Check method only.
 */
export const useQuickStore = defineStore({
    id: 'quick',
    state: () => ({
        labType: "Select", //The type of lab to check (online or offline)
        experienceTier: "Select", //Determines the amount of experiences tested
        stationDetails: String //Object of strings or list of objects
    }),
    actions: {

    },
    getters: {

    }
});
