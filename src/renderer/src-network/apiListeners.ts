import { useNetworkStore } from "./store/networkStore";
import {PORTS} from "../assets/checks/_networkValues";

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
export const listeners = async (info: any) => {
    console.log(info , 'info');

    switch(info.channelType) {
        case "speed_test_result":
        case "internet_result":
        case "website_result":
        case "port_result":
            networkStore.updateReportTracker(info.section, info.id, info.passedStatus, info.message);
            break;
        case "build_port_check":
            for (const port of PORTS) {
                //@ts-ignore
                api.ipcRenderer.send('network_function', { channelType: 'port_check', id: port.name, value: port.value });

                setTimeout(() => {
                    const category = 'Ports';
                    if (networkStore.reportTracker[category][port.name].passedStatus === '') {
                        networkStore.updateReportTracker(category, port.name, 'failed', 'Timed out');
                    }
                }, 5000);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

        case "speed_test_progress":
            networkStore.progress = info.progress;
            break;

        default:
            console.log(info);
            break;
    }
};
