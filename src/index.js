const // std modules
    childp = require('child_process'),
    // 3P modules
    restify = require('restify'),
    server = restify.createServer(),
    IoServer = require('socket.io'),
    io = IoServer.listen(server.server),
    IoClient = require('socket.io-client'),
    // custom modules
    constants = require('./constants')


let app = initApp()

initSocket()

server.listen(constants.LocalServer.PORT, function () {
    console.log('socket.io server listening at %s', server.url)
})

process.on('SIGTERM', onSignal)

async function onSignal(signal) {
    console.log('Received %s', signal)
    switch (signal) {
        case 'SIGTERM':
            console.log('Killing app...')
            app.kill(signal)
            await new Promise((resolve, reject) => {
                function wait4End() {
                    if (app) {
                        console.log('Waiting for app to close...')
                        setTimeout(() => wait4End(), 200)
                    } else {
                        console.log('App terminated')
                        resolve()
                    }
                }
                wait4End()
            })
            console.log('Stopping service...')
            server.close(() => {
                console.log('Service stopped')
                // TODO: confirm if there is a way to avoid forcing process.exit()
                process.exit(0)
            })
            break
    }
}

function initApp() {
    let child = childp.spawn('node_modules/.bin/electron', ['src/app.js'], {
        stdio: 'inherit',
        // detached: true
    })
    child.on('error', (err) => {
        console.error(err)
    })
    child.on('close', (code) => {
        console.log('App closed with code %d', code)
    })
    
    child.on('exit', (code) => {
        console.log('App exited with code %d', code)
        app = null
    })

    return child
}

function initSocket() {
    let RemoteServerBaseUrl = constants.RemoteServer.HOST + ':' + constants.RemoteServer.PORT
    console.log('Connecting to server at %s...', RemoteServerBaseUrl)
    let socket = IoClient(RemoteServerBaseUrl)
    socket.on('connect', () => {
        console.log('Connected')
    })
}