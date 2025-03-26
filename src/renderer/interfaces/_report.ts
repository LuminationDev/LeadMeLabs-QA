export type Comment = {
    date: string;
    content: string;
}

export interface Check {
    comments: Comment[];
    description: string;
    date?: string|null;
    devices: {
        [deviceId: string]: Device;
    };
    targets: Targets
}

export interface Targets {
    station: boolean;
    tablet: boolean;
    nuc: boolean;
    cbus: boolean;
}

export interface Category {
    [check: string]: Check;
}

export interface Section {
    [category: string]: Category;
}

export interface Report {
    [section: string]: Section;
}

interface Device {
    deviceId: string;
    type: string;
    passedStatus: string;
    message: string;
    id: string;
}
