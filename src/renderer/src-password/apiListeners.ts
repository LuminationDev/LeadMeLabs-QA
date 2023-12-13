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
        default:
            console.log(info);
            break;
    }
};
