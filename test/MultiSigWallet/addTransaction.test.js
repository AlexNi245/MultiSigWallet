
const MultiSigWallet = artifacts.require("./MultiSigWallet.sol");

contract("MultiSigWallet", accounts => {

 

  it("addTranaction -- fails if transaction ammount exceeds contract balance ", async () => {
    const txParams = {
      from: accounts[0]
    };


    const firstOwner = accounts[0];
    const secondOwner = accounts[1];
    const foreignAddress = accounts[2];



    const instance = await MultiSigWallet.new([firstOwner, secondOwner], 1, txParams);
    await instance.addFund( { from: firstOwner ,value:1000})



    try {
      await instance.addTransaction(firstOwner, 10000, { from: foreignAddress });
    } catch (e) {
      return true;
    }

    throw new Error("Function should reject if called by anyone else excepts the owners")

  });

  it("addTranaction -- correct transaction will be added to contracts transactions ", async () => {
    const txParams = {
      from: accounts[0]
    };


    const firstOwner = accounts[0];
    const secondOwner = accounts[1];
    const foreignAddress = accounts[2];



    const instance = await MultiSigWallet.new([firstOwner, secondOwner], 1, txParams);
    await instance.addFund( { from: firstOwner ,value:1000})



    await instance.addTransaction(firstOwner, 100, { from: foreignAddress });

    const transaction = await instance.transactions(0);

    assert.equal(transaction.from, foreignAddress);
    assert.equal(transaction.to, firstOwner);
    assert.equal(transaction.approvalCount, 0);
    assert.equal(transaction.isApproved, false);
    assert.equal(transaction.isProccesed, false);



  });


  it("addTranaction -- current TransactionId will be incremented after a transaction was added ", async () => {
    const txParams = {
      from: accounts[0]
    };


    const firstOwner = accounts[0];
    const secondOwner = accounts[1];
    const foreignAddress = accounts[2];



    const instance = await MultiSigWallet.new([firstOwner, secondOwner], 1, txParams);
    await instance.addFund( { from: firstOwner,value:1000 })
    await instance.addTransaction(firstOwner, 100, { from: foreignAddress });



    const currentTransactionId = await instance.currentTransactionId();

    assert.equal(currentTransactionId, 1);


  });

  
});
