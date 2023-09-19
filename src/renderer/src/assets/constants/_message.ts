//NUC MESSAGES
//Source:Destination:Request (:ReturnAddress) - added through the stateStore on request
export const REQUEST_APPLIANCE_LIST = "QA:NUC:ApplianceList";
export const REQUEST_STATION_LIST = "QA:NUC:StationList";
export const CONNECT = "QA:NUC:Connect";
export const START_AUTO_TEST = "QA:NUC:StartAutoTest";
export const CBUS_CONNECTION_VALIDATION = "QA:NUC:cbusConnectionChecks";
export const CBUS_APPLIANCE_VALIDATION = "QA:NUC:CbusValidation";

//STATION MESSAGES
//Source:Destination:ActionSpace:Request
export const REQUEST_STATION_DETAILS = "QA:Station:QA:StationDetails";
export const REQUEST_STATION_DETAILS_WINDOWS = "QA:Station:QA:StationWindows";
export const REQUEST_STATION_DETAILS_NETWORK = "QA:Station:QA:StationNetwork";
export const REQUEST_STATION_DETAILS_SOFTWARE = "QA:Station:QA:StationSoftware";
export const REQUEST_STATION_DETAILS_CONFIG = "QA:Station:QA:StationConfig";
export const REQUEST_STATION_DETAILS_ALL = "QA:Station:QA:StationAll";