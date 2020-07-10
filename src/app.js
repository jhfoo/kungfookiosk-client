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

  // and load the index.html of the app.
  win.loadFile('index.html')
}



app.whenReady().then(createWindow)
