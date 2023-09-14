import { defineStore } from 'pinia';
import { Appliance, ReportTrackerItem, Station } from "../interfaces";

/**
 * Used to store values for the Lab's Full Check method only.
 */
export const useFullStore = defineStore({
    id: 'full',
    state: () => ({
        connected: false,
        //Compared against the number of Station's contacted
        numberOfStations: 0,
        //The IP address entered by a user that should be the NUC
        nucAddress: '',
        //List of the Station detail's from the NUC
        NucStationList: Array<Station>(),
        //List of the Station detail's from the Stations
        StationList: Array<Station>(),
        //Track the progress of the checks as an overall report object - populated in App.vue
        reportTracker: {} as ReportTrackerItem,

        //TEMPORARY ITEMS
        //List of appliance objects
        ApplianceList: Array<Appliance>(),
    }),
    actions: {

    },
    getters: {

    }
});
