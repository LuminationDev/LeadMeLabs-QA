export interface Check {
    type: string;
    checkingStatus: string;
    passedStatus: string;
    message: string;
    id: string;
}

export interface Report {
    [check: string]: Check;
}
