// Modules to control application life and create native browser window
const {app, BrowserWindow, dialog} = require('electron')
const path = require('path')
const autoUpdater = require('electron-updater').autoUpdater
function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 550,
    height: 700,
    icon: path.join(__dirname, 'assets', 'images', `dracarys.ico`),
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    },
  })

  mainWindow.loadFile('app/frontend/index.html')
  console.log(path.join(__dirname, 'assets', 'images', `dracarys.ico`))
}

autoUpdater.on('checking-for-update', () => {
  //sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (ev, info) => {
  //sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (ev, info) => {
  //sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (ev, err) => {
  //sendStatusToWindow('Error in auto-updater.');
})
autoUpdater.on('download-progress', (ev, progressObj) => {
  //sendStatusToWindow('Download progress...');
})
autoUpdater.on('update-downloaded', (ev, info) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Found Updates',
    message: 'Found updates, do you want update now?',
    buttons: ['Sure', 'No']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      const isSilent = true;
      const isForceRunAfter = true; 
      autoUpdater.quitAndInstall(isSilent, isForceRunAfter); 
    } 
    else {
      updater.enabled = true
      updater = null
    }
  });
});

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

function getPlatformIcon(filename){
  let ext
  switch(process.platform) {
      case 'win32':
          ext = 'ico'
          break
      case 'darwin':
      case 'linux':
      default:
          ext = 'png'
          break
  }

  return path.join(__dirname, 'app', 'assets', 'images', `${filename}.${ext}`)
}