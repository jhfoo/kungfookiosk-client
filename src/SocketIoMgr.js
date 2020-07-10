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
  socket.on('connect', () => {
      console.log('Connected')
  
      socket.on('app', (data) => {
        console.log('[socketio] %s event received', data.cmd)
        switch (data.cmd) {
          case 'ToggleFullScreen':
            win.setFullScreen(!win.isFullScreen())
            break
          case 'LoadUrl':
            onLoadUrl(win, data)
            break
          case 'reboot':
            console.log('[socketio] reboot received')
            util.doCli('sudo',['reboot'])
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

      console.log(`[SocketIOMgr] registering id ${ConfigMgr.attr('id')}`)
      socket.emit('register', {
        id: ConfigMgr.attr('id')
      }, (resp) => {
        console.log(`[SocketIoMgr] register.callback: ${resp}`)
      })
  })

  return socket
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