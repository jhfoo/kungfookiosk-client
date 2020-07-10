const // std modules 
  childp = require('child_process'),
  // custom modules
  util = require('./util')

setTimeout(() => util.launchNForget('npm',['run','prod']), 2 * 1000)
        