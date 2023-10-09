export type Comment = {
    date: string;
    content: string;
}

export type ReportCheck = {
    comments: Comment[];
    description: string;
    date: string|null;
    devices: {}
    targets: {
        station: boolean;
        tablet: boolean;
        nuc: boolean;
        cbus: boolean;
    }
};