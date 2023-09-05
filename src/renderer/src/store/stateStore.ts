import { defineStore } from 'pinia';
import { Station } from "../interfaces/index";

export const useStateStore = defineStore({
    id: 'state',
    state: () => ({
        //Current version of the application
        version: '',
        //Encryption key for TCP server and client
        key: '',
        //Is the backend TCP server running
        isServerRunning: false,
        //Details of the electron server that is running in the backend
        serverDetails: {address: "", port: null},
        //The IP address entered by a user that should be the NUC
        nucAddress: '',
        //Local network information
        PortDetails: String,
        //List of the Station detail's from the NUC
        NucStationList: Array<Station>(),
        //List of the Station detail's from the Stations
        StationList: Array<Station>()
    }),
    actions: {
        insertSpaceBetweenCapitalLetters(str: string) {
            return str.replace(/([a-z])([A-Z])/g, '$1 $2');
        },

        splitStringWithLimit(input: string, delimiter: string, limit: number): string[] {
            const parts = input.split(delimiter);

            if (parts.length <= limit) {
                return parts;
            }

            const result: string[] = [];
            for (let i = 0; i < limit - 1; i++) {
                result.push(parts.shift() as string);
            }

            // Combine the remaining parts into the last block
            result.push(parts.join(delimiter));

            return result;
        },
    },
    getters: {
        getServerDetails: (state) => {
            return `:${state.serverDetails.address}:${state.serverDetails.port}`
        }
    }
});
