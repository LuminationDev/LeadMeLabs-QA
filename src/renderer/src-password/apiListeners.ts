import { usePasswordStore } from "./store/passwordStore";

let passwordStore: any;

/**
 * Initialise the pinia stores required for the api listeners. This needs to be done at run time otherwise
 * the compiler tries to initialise the stores before the app.
 */
export const initialise = () => {
    passwordStore = usePasswordStore();
}

/**
 * Backend listener, any messages from the node backend are directed to this listener and then
 * triaged for the appropriate follow through.
 */
//@ts-ignore
export const listeners = async (info: any) => {
    switch(info.channelType) {
        case "password_two_step":
            passwordStore.statusLogin = "";
            passwordStore.awaitingTwoStep = true;
            break;

        case "password_unlock":
            passwordStore.awaitingTwoStep = true;
            passwordStore.statusTwoFactor = "";
            passwordStore.validSession = true;
            break;

        case "password_valid_session":
            passwordStore.statusTwoFactor = "";
            passwordStore.validSession = true;
            break;

        case "password_log_out":
            passwordStore.statusLogout = "";
            passwordStore.validSession = false;
            passwordStore.awaitingTwoStep = false;
            break;

        case "password_error_message":
            passwordStore.resetStatuses();
            passwordStore.errorMessage = info.error;
            break;

        case "password_generated":
            for (const station of passwordStore.stations) {
                if (station.index === info.stationIndex) {
                    station.password = info.password;
                    break; // Exit the loop since you found and updated the entry
                }
            }
            break;

        case "search_results":
            const stations = transformItemData(info.data);
            passwordStore.stations = stations;

            if (stations.length > 0) {
                passwordStore.loaded = true;
            }
            break;

        case "saving_error_message":
            passwordStore.savingDetails = false;
            passwordStore.savingErrorMessage = info.error;
            break;

        case "saving_success":
            passwordStore.savingDetails = false;
            passwordStore.saved = true;
            break;

        default:
            console.log(info);
            break;
    }
};

const transformItemData = (data: string) => {
    const dataArray = JSON.parse(data);

    const uniqueIndices = new Set<string>();

    return dataArray
        .filter((item: any) => item.name !== undefined && item.name.includes("Steam"))
        .map((item: any) => {
            const index = item.name; // Use the appropriate property for the index

            // Check if the index is unique, if not, skip the item
            if (uniqueIndices.has(index)) {
                return null;
            }

            uniqueIndices.add(index);

            return {
                index,
                username: item.login.username,
                password: item.login.password,
                id: item.id || null,
            };
        })
        .filter(Boolean); // Remove any null items that were skipped
};
