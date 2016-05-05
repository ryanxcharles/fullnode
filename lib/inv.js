/**
 * Inv
 * ===
 *
 * Inventory - used in p2p messages.
 */
'use strict'
let dependencies = {
  Bw: require('./bw'),
  Struct: require('./struct')
}

let inject = function (deps) {
  let Bw = deps.Bw
  let Struct = deps.Struct

  class Inv extends Struct {
    constructor (typenum, hashBuf) {
      super()
      this.fromObject({typenum, hashBuf})
    }

    fromBr (br) {
      this.typenum = br.readUInt32LE()
      this.hashBuf = br.read(32)
      return this
    }

    toBw (bw) {
      if (!bw) {
        bw = new Bw()
      }
      bw.writeUInt32LE(this.typenum)
      bw.write(this.hashBuf)
      return bw
    }

    isTx () {
      return this.typenum === Inv.MSG_TX
    }

    isBlock () {
      return this.typenum === Inv.MSG_BLOCK
    }

    isFilteredBlock () {
      return this.typenum === Inv.MSG_FILTERED_BLOCK
    }
  }

  Inv.MSG_TX = 1
  Inv.MSG_BLOCK = 2
  Inv.MSG_FILTERED_BLOCK = 3

  return Inv
}

inject = require('injecter')(inject, dependencies)
let Inv = inject()
module.exports = Inv