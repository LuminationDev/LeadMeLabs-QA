export interface Check {
    type: string;
    checkingStatus: string;
    passedStatus: string;
    message: string;
    id: string;
}

interface Section {
    [check: string]: Check;
}

export interface Report {
    [section: string]: Section;
}
