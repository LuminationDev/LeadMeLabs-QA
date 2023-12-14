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

        default:
            console.log(info);
            break;
    }
};
