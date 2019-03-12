const SocketActions = require('./constants');

const Transaction = require('./models/transaction');
const TransactionPool = require('./models/transactionPool');
const Blockchain = require('./models/chain');

const socketListeners = (socket, chain) => {
  socket.on(SocketActions.ADD_TRANSACTION, (senderWallet, currTxn, receiver, amount) => {
   console.log('Receiving transaction on node: '+ socket.id);
   console.log('With txn id: '+ currTxn.id);
   chain.newTransaction(senderWallet, currTxn, receiver, amount);	  
  });

	socket.on(SocketActions.TEST, (msg) => {
   console.log('Broadcasting mess to nodes: '+ msg);
   socket.emit('hello', 'can you hear me?', 1, 2, ' abc');
   socket.broadcast.emit('hello');
  });

  socket.on(SocketActions.END_MINING, (newChain) => {
    console.log('End Mining encountered');
    process.env.BREAK = true;
    const blockChain = new Blockchain();
    blockChain.parseChain(newChain);
    if (blockChain.checkValidity() && blockChain.getLength() >= chain.getLength()) {
      chain.blocks = blockChain.blocks;
    }
  });

  return socket;
};

module.exports = socketListeners;
