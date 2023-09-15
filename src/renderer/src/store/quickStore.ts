import { defineStore } from 'pinia';
import { ReportTrackerItem } from "../interfaces";

/**
 * Used to store values for the Lab's Quick Check method only.
 */
export const useQuickStore = defineStore({
    id: 'quick',
    state: () => ({
        //IP address of the Station currently being checked
        stationAddress: '',
        //Object of QaChecks with checkId as the key
        stationDetails: [],
        //Details sent back as strings
        stationNetworkDetails: {} as ReportTrackerItem,
        stationConfigDetails: {} as ReportTrackerItem,
        //Known values that are correct for a Station
        correctStationValues: {}
    }),
    actions: {

    },
    getters: {

    }
});
