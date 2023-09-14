import { defineStore } from 'pinia';

/**
 * Used to store the general state of the QA tool. This store provides variables and functions that are used across
 * different Tools with anything specific being placed into that Tool's own store to reduce overall clutter.
 */
export const useStateStore = defineStore({
    id: 'state',
    state: () => ({
        //Current version of the application
        version: '',
        //The address of the local computer
        ipAddress: '',
        //Encryption key for TCP server and client
        key: '',
        //Default blocker for if a user has not completed the required information before proceeding with a work flow
        canProceed: false,
        //Is the backend TCP server running
        isServerRunning: false,
        //Details of the electron server that is running in the backend
        serverDetails: {address: "", port: "55540"},
        //Local network information
        PortDetails: String,
        //Flag for if the tool is awaiting a response from a TCP client request
        isAwaitingResponse: false,
        //The device type that is using the tool
        deviceType: "Select",
        //The type of lab to check (online or offline)
        labType: "Select",
        //Determines the amount of experiences tested
        experienceTier: "Select",
        //Compared against the Station results
        labLocation: "",
    }),
    actions: {
        insertSpaceBetweenCapitalLetters(str: string): string {
            return str.replace(/([a-z])([A-Z])/g, '$1 $2');
        },

        capitalizeFirstLetter(inputString: string): string {
            return inputString.charAt(0).toUpperCase() + inputString.slice(1);
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

        formattedDate(): string {
            const currentDate = new Date();

            const months = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];

            const day = currentDate.getDate();
            const month = months[currentDate.getMonth()];
            const year = currentDate.getFullYear();

            return `${month}, ${day}, ${year}`;
        }
    },
    getters: {
        getServerDetails: (state) => {
            return `:${state.serverDetails.address}:${state.serverDetails.port}`
        }
    }
});
