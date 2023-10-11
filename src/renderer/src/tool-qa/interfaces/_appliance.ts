export default interface Appliance {
    automationBase: number;
    automationGroup: number;
    automationId: number;
    automationValue: number;
    associatedStation: string | null;
    ipAddress: string | null;
    type: string;
    name: string;
    room: string;
    id: string;
    value: string;
    automationType: string;
    displayType: string | null;
    hidden: boolean | null;
    labels: Record<string, string> | null;
    preAppliances: string[] | null;
    stations: string[] | null;
    appliances: string[] | null;
    options: string[] | null;
    correct: boolean | null;
    correctId: boolean | null;
    checked: boolean | null;
}