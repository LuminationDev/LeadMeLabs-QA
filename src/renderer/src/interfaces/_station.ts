export default interface Station {
    ipAddress: string,
    nucIpAddress: string,
    labLocation: string,
    name: string;
    installedApplications: null | string[]; // Replace with the appropriate type if needed
    steamApplications: null | string[]; // Replace with the appropriate type if needed
    theatreId: number;
    state: string;
    gameName: null | string; // Replace with the appropriate type if needed
    gameId: null | number; // Replace with the appropriate type if needed
    gameType: null | string; // Replace with the appropriate type if needed
    id: number;
    volume: number;
    room: string;
    macAddress: string;
    ledRingId: string;
    status: string;
}
