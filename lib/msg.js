/**
 * Network Message
 * ===============
 *
 * A message on the bitcoin p2p network.
 */
"use strict";
let dependencies = {
  BW: require('./bw'),
  Constants: require('./constants').Default.Msg,
  Struct: require('./struct')
};

function inject(deps) {
  let BW = deps.BW;
  let Constants = deps.Constants;
  let Struct = deps.Struct;

  function Msg(magicnum, cmdbuf, datasize, checksumbuf, databuf) {
    if (!(this instanceof Msg))
      return new Msg(magicnum, cmdbuf, datasize, checksumbuf, databuf);
    this.fromObject({
      magicnum: magicnum,
      cmdbuf: cmdbuf,
      datasize: datasize,
      checksumbuf: checksumbuf,
      databuf: databuf
    });
  };

  Msg.prototype = Object.create(Struct.prototype);
  Msg.prototype.constructor = Msg;

  Msg.prototype.fromBR = function(br) {
    this.magicnum = br.readUInt32BE();
    this.cmdbuf = br.read(12);
    this.datasize = br.readUInt32BE();
    this.checksumbuf = br.read(4);
    this.databuf = br.read();
    return this;
  };

  Msg.prototype.toBW = function(bw) {
    if (!bw)
      bw = BW();
    bw.writeUInt32BE(this.magicnum);
    bw.write(this.cmdbuf);
    bw.writeUInt32BE(this.datasize);
    bw.write(this.checksumbuf);
    bw.write(this.databuf);
    return bw;
  };

  Msg.prototype.fromJSON = function(json) {
    this.magicnum = json.magicnum;
    this.cmdbuf = new Buffer(json.cmdbuf, 'hex');
    this.datasize = json.datasize;
    this.checksumbuf = new Buffer(json.checksumbuf, 'hex');
    this.databuf = new Buffer(json.databuf, 'hex');
    return this;
  };

  Msg.prototype.toJSON = function() {
    return {
      magicnum: this.magicnum,
      cmdbuf: this.cmdbuf.toString('hex'),
      datasize: this.datasize,
      checksumbuf: this.checksumbuf.toString('hex'),
      databuf: this.databuf.toString('hex')
    };
  };

  return Msg;
};

let injector = require('./injector');
let Msg = injector(inject, dependencies);
Msg.Mainnet = injector(inject, dependencies, {
  Constants: require('./constants').Mainnet.Msg
});
Msg.Testnet = injector(inject, dependencies, {
  Constants: require('./constants').Testnet.Msg
});
module.exports = Msg;