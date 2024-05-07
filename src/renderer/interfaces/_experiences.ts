export interface ExperienceCheck {
    id: number,
    title: string,
    stations: Array<ExperienceStation>
}

interface ExperienceStation {
    id: string,
    status: string|null,
    checkingStatus: string,
    message: string|null
}