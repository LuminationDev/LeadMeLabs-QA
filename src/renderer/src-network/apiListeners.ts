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
        case "website_result":
            networkStore.updateReportTracker("Firewall", info.name, info.passedStatus, info.message);
            break;

        case "speed_test_progress":
            networkStore.progress = info.progress;
            break;

        case "speed_test_result":
            networkStore.speed = info.speed;
            break;

        case "port_result":
            console.log(info)
            break;

        default:
            console.log(info);
            break;
    }
};
