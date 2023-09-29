//NUC MESSAGES
//Source:Destination:Request (:ReturnAddress) - added through the stateStore on request
export const REQUEST_APPLIANCE_LIST = "QA:NUC:ApplianceList";
export const REQUEST_STATION_LIST = "QA:NUC:StationList";
export const CONNECT = "QA:NUC:Connect";
export const START_AUTO_TEST = "QA:NUC:StartAutoTest";
export const CBUS_CONNECTION_VALIDATION = "QA:NUC:cbusConnectionChecks";
export const CBUS_APPLIANCE_VALIDATION = "QA:NUC:CbusValidation";
export const RUN_GROUP = "QA:NUC:RunGroup";
export const LAUNCH_EXPERIENCE = "QA:Station:LaunchExperience";
export const CONNECT_TO_ANDROID = "QA:Android:Android";
export const GET_VR_STATUSES = "QA:Station:GetVrStatuses";

//STATION MESSAGES
//Source:Destination:ActionSpace:Request
export const REQUEST_STATION_DETAILS = "QA:Station:QA:StationDetails";
export const REQUEST_STATION_DETAILS_WINDOWS = "QA:Station:QA:StationWindows";
export const REQUEST_STATION_DETAILS_NETWORK = "QA:Station:QA:StationNetwork";
export const REQUEST_STATION_DETAILS_SOFTWARE = "QA:Station:QA:StationSoftware";
export const REQUEST_STATION_DETAILS_CONFIG = "QA:Station:QA:StationConfig";
export const REQUEST_STATION_DETAILS_ALL = "QA:Station:QA:StationAll";

//PROGRESS MESSAGES
export const SAVE_PROGRESS = "save_progress"; //The frontend is trying to save file
export const LOAD_PROGRESS = "load_progress"; //The backend is trying to load a saved file