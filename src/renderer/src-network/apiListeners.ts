import { useNetworkStore } from "./store/networkStore";

let networkStore: any;

/**
 * Initialise the pinia stores required for the api listeners. This needs to be done at run time otherwise
 * the compiler tries to initialise the stores before the app.
 */
export const initialise = () => {
    networkStore = useNetworkStore();
}

/**
 * Backend listener, any messages from the node backend are directed to this listener and then
 * triaged for the appropriate follow through.
 */
//@ts-ignore
export const listeners = (info: any) => {
    switch(info.channelType) {
        case "speed_test_result":
        case "internet_result":
        case "website_result":
            networkStore.updateReportTracker(info.section, info.id, info.passedStatus, info.message);
            break;

        case "speed_test_progress":
            networkStore.progress = info.progress;
            break;

        case "attempt_device_connection":
            networkStore.connectionState = info.passedStatus;
            //TODO in the future dynamically add/update the report tracker
            console.log(info);
            break;

        default:
            break;
    }
};
