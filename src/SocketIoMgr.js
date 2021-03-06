const // std modules 
  childp = require('child_process'),
  // 3P modules 
  IoClient = require('socket.io-client'),
  // custom modules
  constants = require('./constants'),
  util = require('./util'),
  ConfigMgr = require('./ConfigMgr')

function init(win) {
  let SocketIoBaseUrl = constants.RemoteServer.HOST + ':' + constants.RemoteServer.PORT
  console.log('Connecting to server at %s...', SocketIoBaseUrl)
  let socket = IoClient(SocketIoBaseUrl)
  socket.on('connect', async () => {
      console.log('Connected')
  
      socket.on('app', async (data) => {
        console.log('[socketio] %s event received', data.cmd)
        switch (data.cmd) {
          case 'ResetConfig':
            ConfigMgr.reset()
            break
          case 'ToggleFullScreen':
            let isFullScreen = !win.isFullScreen() 
            win.setFullScreen(isFullScreen)
            ConfigMgr.setAttribute('IsFullscreen', isFullScreen)
            break
          case 'SetAttribute':
            if (data.AttrName && data.AttrValue) {
              ConfigMgr.setAttribute(data.AttrName, data.AttrValue)
            } else {
              console.log('[socketio] ERROR: Missing AttrName and/ or AttrValue params')
            }
            break
          case 'LoadUrl':
            onLoadUrl(win, data)
            break
          case 'reboot':
            console.log('[socketio] reboot received')
            await util.doCliAsync('sudo',['reboot'])
            break
          case 'update':
            console.log('[socketio] update received')
            await util.doCliAsync('git',['pull'])
            onRestart()
            break
          case 'restart':
            onRestart()
            break
        }
      })

      console.log(`[SocketIOMgr] registering id ${ConfigMgr.attr('id')}`)
      socket.emit('register', {
        id: ConfigMgr.attr('id')
      }, (resp) => {
        console.log(`[SocketIoMgr] register.callback: ${resp}`)
      })
  })

  return socket
}

function onRestart() {
  util.launchNForget('node',['src/restartme.js'])
  process.exit(0)
}

function onLoadUrl(win, data) {
  if (data.url) {
    console.log('[SocketioMgr] onLoadUrl.ConfigMgr: ' + ConfigMgr)
    ConfigMgr.setAttribute('LastUrl', data.url)
    win.loadURL(data.url)
  } else {
    console.log('[socketio] LoadUrl: missing parameter data.url')
  }
}

module.exports = {
    init
}