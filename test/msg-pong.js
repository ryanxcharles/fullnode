/* global describe,it */
'use strict'
let MsgPing = require('../lib/msg-ping')
let MsgPong = require('../lib/msg-pong')
let Random = require('../lib/random')
let should = require('chai').should()

describe('MsgPong', function () {
  it('should satisfy this basic API', function () {
    let msgping = new MsgPong()
    should.exist(msgping)
    msgping = new MsgPong()
    should.exist(msgping)
    should.exist(MsgPong.Mainnet)
    should.exist(MsgPong.Testnet)
  })

  describe('#fromMsgPing', function () {
    it('should find a msgpong from a msgping', function () {
      let msgping = new MsgPing().fromRandom()
      let msgpong = new MsgPong().fromMsgPing(msgping)
      Buffer.compare(msgping.dataBuf, msgpong.dataBuf).should.equal(0)
      msgpong.getCmd().should.equal('pong')
    })
  })

  describe('@fromMsgPing', function () {
    it('should find a msgpong from a msgping', function () {
      let msgping = MsgPing.fromRandom()
      let msgpong = MsgPong.fromMsgPing(msgping)
      Buffer.compare(msgping.dataBuf, msgpong.dataBuf).should.equal(0)
      msgpong.getCmd().should.equal('pong')
    })
  })

  describe('#isValid', function () {
    it('should know this is a valid pong', function () {
      let msgping = new MsgPing().fromRandom()
      let msgpong = new MsgPong().fromMsgPing(msgping)
      msgpong.isValid().should.equal(true)
    })

    it('should know this is an invalid ping', function () {
      let msgping = new MsgPing().fromRandom()
      let msgpong = new MsgPong().fromMsgPing(msgping)
      msgpong.setCmd('pongo')
      msgpong.isValid().should.equal(false)
    })

    it('should know this is an invalid ping', function () {
      let msgping = new MsgPing().fromRandom()
      let msgpong = new MsgPong().fromMsgPing(msgping)
      msgpong.setData(Random.getRandomBuffer(9))
      msgpong.isValid().should.equal(false)
    })
  })
})
