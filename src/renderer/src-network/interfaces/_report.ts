export interface Check {
    type: string;
    checkingStatus: string;
    passedStatus: string;
    message: string;
    id: string;
    date?: string;
}

export interface Section {
    [check: string]: Check;
}

export interface Report {
    [section: string]: Section;
}
