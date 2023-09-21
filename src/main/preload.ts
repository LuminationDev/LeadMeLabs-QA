import { contextBridge, ipcRenderer } from 'electron';

// Custom APIs for config tool
const configApi = {
  tryActivate: () => ipcRenderer.invoke('config_function',
      { channelType: 'try-activate' }),

  uploadStation: (stationObj: any) => ipcRenderer.invoke('config_function',
      { channelType: 'upload-station', stationObj }),

  uploadAppliance: (applianceJson: any) => ipcRenderer.invoke('config_function',
      { channelType: 'upload-appliance', applianceJson }),

  setCbus: async (creds: any, ipAddress: any): Promise<boolean> => await ipcRenderer.invoke('config_function',
      { channelType: 'set-cbus', creds, ipAddress }),

  isCbusInformationSet: async (): Promise<boolean> => await ipcRenderer.invoke('config_function',
      { channelType: 'is-cbus-information-set' }),

  writeTemp: (applianceJson: any) => ipcRenderer.invoke('config_function',
      { channelType: 'write-temp', applianceJson }),

  readTemp: () => ipcRenderer.invoke('config_function',
      { channelType: 'read-temp' }),

  loadTemp: (filepath: any) => ipcRenderer.invoke('config_function',
      { channelType: 'load-temp', filepath }),

  loadFilePicker: () => ipcRenderer.invoke('config_function',
      { channelType: 'load-file-picker' }),

  saveFilePicker: (applianceList: any, stationList: any) => ipcRenderer.invoke('config_function',
      { channelType: 'save-file-picker', applianceList, stationList }),

  readAppliancejson: () => ipcRenderer.invoke('config_function',
      { channelType: 'read-appliancejson' }),


  readStationjson: () => ipcRenderer.invoke('config_function',
      { channelType: 'read-stationjson' }),


  getCbusId: (automationBase: any, automationGroup: any, automationId: any) => ipcRenderer.invoke('config_function',
      { channelType: 'get-cbusid', automationBase, automationGroup, automationId }),

  getApplianceIdAndStatus: (automationBase: any, automationGroup: any, automationId: any): object => ipcRenderer.invoke('config_function',
      { channelType: 'get-appliance-id-and-status', automationBase, automationGroup, automationId }),

  setCbusApplianceValue: (automationBase: any, automationGroup: any, automationId: any, value: any): Promise<any> => {
    return ipcRenderer.invoke('config_function',
        { channelType: 'set-cbus-appliance-value', automationBase, automationGroup, automationId, value })
  },

  checkApplianceFile: (): Promise<boolean> => ipcRenderer.invoke('config_function',
      { channelType: 'check-appliance-file' }),


  checkStationFile: (): Promise<boolean> => ipcRenderer.invoke('config_function',
      { channelType: 'check-station-file' }),

  sendCommandTcpEpson: (ip: any, port: any, desc: any, message: any): Promise<any> => ipcRenderer.invoke('config_function',
      { channelType: 'send-command-epson', ip, port, desc, message }),

  getCbusEnv: (): Promise<object> => { return ipcRenderer.invoke('config_function',
      { channelType: 'get-cbus-env' })
  }
}

contextBridge.exposeInMainWorld('configApi', configApi)
contextBridge.exposeInMainWorld('api', {
  ipcRenderer: {
    ...ipcRenderer,
    on: ipcRenderer.on.bind(ipcRenderer),
    removeListener: ipcRenderer.removeListener.bind(ipcRenderer),
  },
});
