import { defineStore } from 'pinia';
import * as CHECK from "../assets/checks"
import {ReportTrackerItem} from "../interfaces";

/**
 * Used to store values for the Lab's Quick Check method only.
 */
export const useQuickStore = defineStore({
    id: 'quick',
    state: () => ({
        //IP address of the Station currently being checked
        stationAddress: '',
        //Object of strings or list of objects
        stationNetworkDetails: {} as ReportTrackerItem,
        stationWindowsDetails: {} as ReportTrackerItem,
        stationSoftwareDetails: {} as ReportTrackerItem,
        stationConfigDetails: {} as ReportTrackerItem,
        //Known values that are correct for a Station
        correctStationValues: CHECK.QUICK.VALUES
    }),
    actions: {

    },
    getters: {

    }
});
