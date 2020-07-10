const // std modules 
  childp = require('child_process'),
  // 3P modules 
  { app, BrowserWindow, Menu } = require('electron'),
  IoClient = require('socket.io-client'),
  // custom modules
  constants = require('./constants'),
  util = require('./util'),
  SocketIoMgr = require('./SocketIoMgr'),
  ConfigMgr = require('./ConfigMgr')

win = null

function createWindow () {
  ConfigMgr.init(constants.CONFIGFILE)
  Menu.setApplicationMenu(false)

  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  let socket = SocketIoMgr.init(win)

  if (ConfigMgr.attr('UseLastIsFullscreen')) {
    win.setFullScreen(ConfigMgr.attr('IsFullscreen'))
  }

  
  // and load the index.html of the app.
  let url = ConfigMgr.attr('UseLastUrl') ? ConfigMgr.attr('LastUrl') : 'index.html'
  console.log(`Starting url: ${url}`)
  win.loadURL(url)
}



app.whenReady().then(createWindow)
