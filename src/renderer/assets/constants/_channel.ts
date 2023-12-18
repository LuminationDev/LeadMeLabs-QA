export const HELPER_CHANNEL = 'helper_function' //Frontend -> Backend channel
export const NETWORK_CHANNEL = 'network_function' //Frontend -> Backend channel
export const PASSWORD_CHANNEL = 'password_function' //Frontend -> Backend channel

export const APPLICATION_CHANNEL = 'application_settings'
export const ERROR_CHANNEL = 'error'
export const UPDATE_CHANNEL = 'update_check'
export const TCP_COMMAND_CHANNEL = 'tcp_server_command' //Control the TCP server class
export const TCP_SERVER_CHANNEL = 'tcp_server_message' //Receiving messages
export const TCP_CLIENT_CHANNEL = 'tcp_client_message' //Sending messages
export const NETWORK_PORT_CHANNEL = 'network_port_settings'; //Collect the computer's network settings
export const PORT_TEST = 'port_test'; //Collect the computer's network settings
export const BUILD_PORT_CHECK = 'build_port_check'; //Collect the computer's network settings
export const TEARDOWN_PORT_CHECK = 'teardown_port_check'; //Collect the computer's network settings
export const REFRESH_LAUNCHER_DETAILS = 'refresh_details'; //Recollect the launcher details from the backend
export const GENERATE_REPORT = 'generate_report'; //Tell the backend to generate a pdf document
export const UPLOAD_REPORT = 'upload_report'; //Tell the backend to generate a pdf document

export const REPORT_GENERATED = 'pdf_uploaded'; //The backend has uploaded the report