import { autoUpdater, UpdateCheckResult } from 'electron-updater';
import { join } from 'path';
import { GetIPAddress } from "../shared/network/Network";
import { optimizer } from "@electron-toolkit/utils";
import NetworkController from "../shared/controllers/NetworkController";
import * as Sentry from '@sentry/electron';
import {getCanAccessVultr} from "../canAccessVultr";

const { app, BrowserWindow, ipcMain, session, shell } = require('electron');

Sentry.init({
  dsn: "https://396e4f7bfb3b4ae856b9b47c829cb556@o1294571.ingest.sentry.io/4506375092633600",
});

/**
 * Request the application be a single instance. If there is another attempt to open it the original instance will be
 * focused instead.
 */
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  // If another instance of the app is already running, quit the current instance.
  app.quit();
}
else {
  // Create the main window of your application
  app.on('second-instance', () => {
    // When a second instance is detected, bring the existing instance to the front
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show(); //Open from icon tray
      mainWindow.focus(); //Bring to front of programs
    }
  });
}

autoUpdater.autoDownload = true;

// Listen for update download progress events
autoUpdater.on('update-downloaded', () => {
  if(mainWindow) {
    mainWindow.webContents.send('backend_message', {
      channelType: "update_ready",
      name: "UPDATE DOWNLOADED, close any open applications"
    });
  }

  if(downloadWindow) {
    //Setting progress above 1 turns the bar into an indeterminate loading bar while waiting for restart
    downloadWindow.setProgressBar(2);
  }

  //Wait for any open applications to close
  setTimeout(() => {
    //Close the download window?

    const isSilent = true
    const isForceRunAfter = true
    autoUpdater.quitAndInstall(isSilent, isForceRunAfter)
  }, 4000);
})

autoUpdater.on('download-progress', (progressObj) => {
  if(!downloadWindow) {
    createDownloadWindow();
  }

  // Calculate download progress percentage
  const progress = Math.floor(progressObj.percent)/100;

  if(downloadWindow) {
    downloadWindow.setProgressBar(progress);
  }

  if(mainWindow) {
    mainWindow.webContents.send('backend_message', {
      channelType: "update_downloading",
      progress
    });
  }
})

let downloadWindow;
function createDownloadWindow() {
  downloadWindow = new BrowserWindow({
    width: 400,
    height: 150,
    show: false,
    resizable: false,
    webPreferences: {
      preload: join(__dirname, '..', 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  downloadWindow.setMenu(null);

  downloadWindow.on('ready-to-show', () => {
    downloadWindow.show();
  });

  downloadWindow.webContents.setWindowOpenHandler((details) => {
    console.log('inside set window open handler')
    void shell.openExternal(details.url)
    return { action: 'deny' }
  });

  downloadWindow.loadFile(join(app.getAppPath(), 'static', 'download.html'));
}

//Maintain a reference to the window
let mainWindow
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: true,
    webPreferences: {
      preload: join(__dirname, '..', 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Show the main window and check for application updates
  mainWindow.on('ready-to-show', () => {
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools();
    }

    // Send through the current version number
    void sendApplicationDetails();

    if (process.env.NODE_ENV !== 'development') {
      getCanAccessVultr().then(canAccessVultr => {
        if (canAccessVultr) {
          autoUpdater.setFeedURL({
            provider: 'generic',
            url: 'https://leadme-tools.sgp1.vultrobjects.com/leadme-network/'
          })
        } else {
          autoUpdater.setFeedURL({
            provider: 'generic',
            url: 'https://leadme-network-tool-f81e92d61350.herokuapp.com/static/'
          })
        }
        autoUpdater.checkForUpdates().then((result) => {
          updateCheck(result);
        }).catch(handleUpdateCheckError);
      })
    }
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    console.log('inside set window open handler')
    void shell.openExternal(details.url)
    return { action: 'deny' }
  });

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  }
  else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
  }
}

/**
 * If retrieving the Live update does not work attempt to contact the offline installer
 * server.
 * @param error An object that details what has gone wrong in the connection process.
 */
async function handleUpdateCheckError(error) {
  mainWindow.webContents.send('backend_message', {
    channelType: "update_check",
    data: error
  });
}

/**
 * Check the result of the autoUpdate feed and fall back to the offline one if the
 * original FeedUrl does not work.
 * @param result
 */
function updateCheck(result: UpdateCheckResult|null) {
  if (result === null) {
    mainWindow.webContents.send('backend_message', {
      channelType: "update_check",
      data: "RESULT NULL"
    });

    return;
  }

  mainWindow.webContents.send('backend_message', {
    channelType: "update_check",
    data: result,
    hosting: "Hosting version: " + result.updateInfo.version,
    version: "Current version: " + app.getVersion()
  });
}

/**
 * Collect details about the launcher to display on the frontend.
 */
async function sendApplicationDetails(): Promise<void> {
  // Send through the current version number
  mainWindow.webContents.send('backend_message', {
    channelType: "application_settings",
    version: app.getVersion(),
    ipAddress: GetIPAddress()
  });
}

/**
 * Ignore certificate errors.
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.whenReady().then(async () => {
  if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
    const installDevtools = await import('../installDevtools')
    await installDevtools.install()
  }

  //Allow dev tools to toggle on F12
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  });

  createWindow();
  mainWindow.setMenu(null); //cannot open inspector in production if this is set to null

  console.log("Starting electron application");

  new NetworkController(ipcMain, mainWindow).startup();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['script-src \'self\' https://cdn.tailwindcss.com']
      }
    })
  })

  app.on('activate', function () {
    // On macOS, it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});
