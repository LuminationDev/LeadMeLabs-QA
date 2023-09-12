import { defineStore } from 'pinia';

/**
 * Used to store values for the Lab's Quick Check method only.
 */
export const useQuickStore = defineStore({
    id: 'quick',
    state: () => ({
        stationNumber: 0,
        stationDetails: String //Object of strings or list of objects
    }),
    actions: {

    },
    getters: {

    }
});
