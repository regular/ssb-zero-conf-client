const pull = require('pull-stream')
//const Abortable = require('pull-abortable')
const discovery = require('ssb-discover-lan-peers')
const debug = require('debug')('ssb-zero-conf-client')
const createClient = require('ssb-client/client')

module.exports = function(netKey, keys, cb) {
  //const abortable = Abortable()
  pull(
    discovery(netKey, {legacy: false}),
    //abortable(),
    pull.asyncMap( ({address, verified}, cb) =>{
      if (!verified) return cb(null) 
      debug('Attempting to connect to %s', address)

      const options = {
        keys,
        manifest: {manifest: 'async'},
        config: {caps: {shs: netKey}},
        remote: address
      }
      createClient(options, (err, ssb) => {
        if (err) {
          debug('Failed to connect to %s: %s', address, err.message)
          return cb(null)
        }
        debug('connected to %s - requesting manifest', address)
        ssb.manifest( (err, manifest) =>{
          if (err) {
            ssb.close( ()=>{
              debug('connection closed')
              cb(null)
            })
            return debug('failed to request manifest: %s', err.message)
          }
          options.manifest = manifest
          createClient(options, (err, ssb2) => {
            ssb.close() // close temporary connection
            delete options.keys
            options.ssb = ssb2
            cb(null, options)
          })
        })
      })
    }),
    pull.filter(),
    pull.take(1),
    pull.collect( (err, [opts]) =>{
      if (err) return cb(err)
      const {ssb} = opts
      delete opts.ssb
      cb(null, ssb, opts)
    })
  )
}

