const fs = require('fs')

let isAutoSave = true,
  _attr = null,
  FullFname = null

function init(ThisFullFname) {
  console.log(`[ConfigMgr] Reading config ${ThisFullFname}`)
  FullFname = ThisFullFname
  if (fs.existsSync(FullFname)) {
    // file exists: consume as-is
    _attr = JSON.parse(fs.readFileSync(FullFname))
  } else {
    // no file: create defaults
    _attr = {
      id: generateId(8)
    }
    save()
  }
}

function generateId(IdLength) {
  const ValidChars = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('')
  let id = ''

  for (let i = 0; i < IdLength; i++) {
    id += ValidChars[Math.floor(Math.random() * ValidChars.length)]
  }
  return id
}

function save() {
  console.log(`[ConfigMgr] Saving to ${FullFname}`)
  fs.writeFileSync(FullFname, JSON.stringify(_attr, null, 2))
}

function setAttribute(key, value) {
  _attr[key] = value
  if (isAutoSave)
    save()
}

function attr(key) {
  if (!_attr) {
    throw new Error('[ConfigMgr] Call init() before using')
  }

  return _attr[key]
}

module.exports = {
  init,
  setAttribute,
  attr
}