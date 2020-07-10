const // std modules 
  childp = require('child_process')

module.exports = {
    launchNForget: (ExecName, ExecParams) => {
        console.log('cwd: %s', process.cwd())
        console.log('Parent pid: %d', process.pid)
        console.log('Launching %s', ExecName)
        let child = childp.spawn(ExecName, ExecParams, {
            stdio: 'ignore',
            detached: true
        })
        child.unref()
        console.log('Child pid: %d', child.pid)
    },
    doCliAsync: (ExecName, ExecParams) => {
        return new Promise((resolve, reject) => {
            console.log('cwd: %s', process.cwd())
            console.log('Parent pid: %d', process.pid)
            console.log('Launching %s', ExecName)
            let child = childp.spawn(ExecName, ExecParams, {
                stdio: 'inherit'
            })
            console.log('Child pid: %d', child.pid)
    
            // child.stdout.on('data', (data) => {
            //     console.log(data.toString())
            // })
    
            // child.stderr.on('data', (data) => {
            //     console.log(data.toString())
            // })
    
            child.on('error', (err) => {
                console.error(err)
                reject(err)
            })
            child.on('exit', (code, signal) => {
                console.log(`Exit with code ${code} on signal ${signal}`)
                resolve({
                    code,
                    signal
                })
            })
        })
    }
}