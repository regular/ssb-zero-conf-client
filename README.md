ssb-zero-conf-client
---

Bring a netKey (caps.shs) and an ssb keypair and you get a working ssb client!

This works by scanning the lan for broadcasts of ssb-servers with ssb-lan installed. I then connects to any server that broadcasts the correct netKey and tries to request its manifest. This will only work when the provided public key (keys.public) is allowed to do this, for example because it is listed in the server's `config.master`.

I build this for connecting to ssb-servers started by Bay Of Plenty. Run `bay-of-plenty -- --authenticate keyfile` to authorize your public key with the ssb-servers spawned by Bay Of Plenty.

``` js
const client = require('ssb-zero-conf-client')
const ssbKeys = require('ssb-keys')

const netKey = 'FZ0EmZO8NAhI8BLk5F1gxdBOTOO42BV9V6R4+KZS77c='
const keys = ssbKeys.loadOrCreateSync(__dirname + '/keyfile')

client(netKey, keys, (err, ssb, opts) =>{
  if (err) return console.error(err.message)
  console.log('Connected to', opts.remote)
  ssb.whoami( (err, feed) =>{
    if (err) return console.error(err.message)
    console.log(feed.id)
    ssb.close()
  })
})
```

License: MIT
