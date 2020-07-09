const { app, BrowserWindow, Menu } = require('electron'),
  IoClient = require('socket.io-client'),
  // custom modules
  constants = require('./constants')

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

let SocketIoBaseUrl = 'http://127.0.0.1:' + constants.LocalServer.PORT
console.log('Connecting to server at %s...', SocketIoBaseUrl)
let socket = IoClient(SocketIoBaseUrl)
socket.on('connect', () => {
    console.log('Connected')

    socket.on('app', (data) => {
      console.log('[socketio] %s event received', data.cmd)
      switch (data.cmd) {
        case 'ToggleFullScreen':
          win.setFullScreen(!win.isFullScreen())
      }
    })
})

app.whenReady().then(createWindow)
