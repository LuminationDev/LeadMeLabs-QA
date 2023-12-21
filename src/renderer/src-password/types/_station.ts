export type Station = {
    index: number,
    username: string,
    password: string,
    id?: string|null //The auto-generated Bitwarden ID that is present after creation.
}
