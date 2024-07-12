import {browser} from '@wdio/globals'

describe('Electron Testing', () => {
    it('should print application title', async () => {
        console.log('Hello', await browser.getTitle(), 'application!')
        return true
    })
    it('should verify initial window state', async () => {
        const windowSize = await browser.getWindowSize();
        console.log('Initial window size:', windowSize);
        return true;
    });

    it('should interact with menu items', async () => {
        // Example: Clicking on a menu item
        await browser.keys(['Alt', 'File']); // Example keystrokes to open File menu
        await browser.keys('Enter'); // Example keystroke to select a menu item
        // Add assertions or logging here
        return true;
    });

    // it('should interact with native dialogs', async () => {
    //     // Example: Handling file dialogs
    //     const filePath = '/path/to/test/file.txt';
    //     await browser.execute((filePath) => {
    //         window.electronAPI.openFile(filePath); // Example: Custom Electron API to open file dialog
    //     }, filePath);
    //     // Add assertions or logging here
    //     return true;
    // });

})