const client = require('.')
const ssbKeys = require('ssb-keys')

const netKey = 'FZ0EmZO8NAhI8BLk5F1gxdBOTOO42BV9V6R4+KZS77c='
const keys = ssbKeys.loadOrCreateSync(__dirname + '/keyfile')

client(netKey, keys, (err, ssb, opts) =>{
  if (err) return console.error(err.message)
  console.log('Connected to', opts.remote)
  console.log('options: %o', opts)
  ssb.whoami( (err, feed) =>{
    if (err) return console.error(err.message)
    console.log(feed.id)
    ssb.close()
  })
})
