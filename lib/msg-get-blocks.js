/**
 * MsgGetBlocks
 * ============
 *
 * Gets what blocks are available from a given peer.
 */
'use strict'
let dependencies = {
  GetBlocks: require('./get-blocks'),
  Msg: require('./msg'),
  asink: require('asink')
}

let inject = function (deps) {
  let GetBlocks = deps.GetBlocks
  let Msg = deps.Msg
  let asink = deps.asink

  class MsgGetBlocks extends Msg {
    initialize () {
      Msg.prototype.initialize.call(this)
      this.setCmd('getblocks')
      return this
    }

    fromGetBlocks (getblocks) {
      return this.setData(getblocks.toBuffer())
    }

    static fromGetBlocks (getblocks) {
      return new this().fromGetBlocks(getblocks)
    }

    fromHashes (hashes) {
      let getblocks = new GetBlocks().fromHashes(hashes)
      return this.fromGetBlocks(getblocks)
    }

    static fromHashes (hashes) {
      return new this().fromHashes(hashes)
    }

    asyncFromGetBlocks (getblocks) {
      return this.asyncSetData(getblocks.toBuffer())
    }

    static asyncFromGetBlocks (getblocks) {
      return new this().asyncFromGetBlocks(getblocks)
    }

    asyncFromHashes (hashes) {
      return asink(function * () {
        let getblocks = new GetBlocks().fromHashes(hashes)
        return this.asyncFromGetBlocks(getblocks)
      }, this)
    }

    static asyncFromHashes (hashes) {
      return new this().asyncFromHashes(hashes)
    }

    toGetBlocks () {
      return new GetBlocks().fromBuffer(this.databuf)
    }

    toHashes () {
      return new GetBlocks().fromBuffer(this.databuf).toHashes()
    }

    isValid () {
      return this.getCmd() === 'getblocks'
    }
  }

  return MsgGetBlocks
}

inject = require('injecter')(inject, dependencies)
let MsgGetBlocks = inject()
MsgGetBlocks.MainNet = inject({
  Block: require('./block').MainNet,
  Msg: require('./msg').MainNet
})
MsgGetBlocks.TestNet = inject({
  Block: require('./block').TestNet,
  Msg: require('./msg').TestNet
})
module.exports = MsgGetBlocks