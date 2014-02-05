var txLib = require('../lib/tx'),
  errorHandler = require('./errorHandler');

// TODO validate all options

module.exports = function (opts) {

  var remote = opts.remote,
    OutgoingTx = opts.OutgoingTx;
  
  return {

    getTx: function(req, res) {

      var address = req.param('address'),
        tx_hash = req.param('tx_hash'),
        ledger_index = req.query.ledger_index || req.query.ledger || req.query.in_ledger;

      txLib.getTx({
        remote: remote, 
        address: address,
        hash: tx_hash,
        ledger_index: ledger_index
      }, function(err, tx){
        if (err) {
          errorHandler(res, err);
          return;
        }

        res.send({
          success: true,
          tx: tx
        });

      });
    },

    submitTx: function(req, res) {

      var src_address = req.param('address'),
        secret = req.body.secret,
        tx_json = req.body.tx || req.body.tx_json || req.body;

      txLib.submitTx({
        remote: remote,
        OutgoingTx: OutgoingTx,
        src_address: src_address,
        secret: secret,
        tx_json: tx_json
      }, function(err, initial_hash){
        if (err) {
          errorHandler(res, err);
          return;
        }

        res.send({
          success: true,
          confirmation_token: initial_hash
        });

      });
    }

  };
};
