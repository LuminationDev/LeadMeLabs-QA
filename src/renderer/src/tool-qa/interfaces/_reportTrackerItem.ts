import { QaCheck } from "./index";

export default interface ReportTrackerItem {
    [variableName: string]: QaCheck;
}