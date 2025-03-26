import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-assembler";

async function install() {
    if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
        await installExtension(VUEJS_DEVTOOLS)
    }
}

export { install }