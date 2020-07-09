const { app, BrowserWindow } = require('electron'),
  IoClient = require('socket.io-client'),
  // custom modules
  constants = require('./constants')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
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
})

app.whenReady().then(createWindow)
