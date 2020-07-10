const // std modules 
  childp = require('child_process'),
  // 3P modules 
  { app, BrowserWindow, Menu } = require('electron'),
  IoClient = require('socket.io-client'),
  // custom modules
  constants = require('./constants'),
  util = require('./util')

win = null

function createWindow () {
  Menu.setApplicationMenu(false)

  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
}

let SocketIoBaseUrl = constants.RemoteServer.HOST + ':' + constants.RemoteServer.PORT
console.log('Connecting to server at %s...', SocketIoBaseUrl)
let socket = IoClient(SocketIoBaseUrl)
socket.on('connect', () => {
    console.log('Connected')

    socket.on('restart', () => {
    })

    socket.on('app', (data) => {
      console.log('[socketio] %s event received', data.cmd)
      switch (data.cmd) {
        case 'ToggleFullScreen':
          win.setFullScreen(!win.isFullScreen())
          break
        case 'update':
          console.log('[socketio] update received')
          util.doCli('git',['pull'])
          break
        case 'restart':
          util.launchNForget('node',['src/restartme.js'])
          process.exit(0)
          break
        }
    })
})

app.whenReady().then(createWindow)
