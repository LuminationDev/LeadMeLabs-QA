export interface Report {
    [section: string]: {
        [category: string]: {
            [check: string]: {
                description: string;
                comments: string[];
                targets: {};
                devices: {
                    [deviceId: string]: Device
                };
            }
        }
    }
}

interface Device {
    deviceId: string;
    type: string;
    passedStatus: string;
    message: string;
    id: string;
}
