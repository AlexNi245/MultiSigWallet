
const MultiSigWallet = artifacts.require("./MultiSigWallet.sol");

contract("MultiSigWallet", accounts => {

 

  

  it("approveTransaction -- fails if transaction ammount exceeds contract balance ", async () => {
    const txParams = {
      from: accounts[0]
    };


    const firstOwner = accounts[0];
    const secondOwner = accounts[1];
    const foreignAddress = accounts[2];

    const instance = await MultiSigWallet.new([firstOwner, secondOwner], 1, txParams);
    await instance.send(1000, { from: firstOwner })

    await instance.addTransaction(firstOwner, 900, { from: foreignAddress });
    await instance.addTransaction(firstOwner, 900, { from: foreignAddress });

    //Is successfull; 100 Wei are left 
    await instance.approveTransaction(0);

    try {
      await instance.approveTransaction(1);
    } catch (e) {
      return true;
    }


    throw new Error("Contract should reject the second transaction");

  });

  it("approveTransaction -- fails if sender is not one of the owner ", async () => {
    const txParams = {
      from: accounts[0]
    };


    const firstOwner = accounts[0];
    const secondOwner = accounts[1];
    const foreignAddress = accounts[2];

    const instance = await MultiSigWallet.new([firstOwner, secondOwner], 1, txParams);
    await instance.send(1000, { from: firstOwner })

    await instance.addTransaction(firstOwner, 10, { from: foreignAddress });




    try {
      await instance.approveTransaction(0, { from: foreignAddress });

    } catch (e) {
      return true;
    }


    throw new Error("Contract should reject if sender is not the owner");

  });

  it("approveTransaction -- fails if sender tries to approve multiple times ", async () => {
    const txParams = {
      from: accounts[0]
    };


    const firstOwner = accounts[0];
    const secondOwner = accounts[1];
    const foreignAddress = accounts[2];

    const instance = await MultiSigWallet.new([firstOwner, secondOwner], 1, txParams);
    await instance.send(1000, { from: firstOwner })

    await instance.addTransaction(firstOwner, 10, { from: foreignAddress });




    try {
      await instance.approveTransaction(0, { from: firstOwner });
      await instance.approveTransaction(0, { from: firstOwner });

    } catch (e) {
      return true;
    }


    throw new Error("Contract should reject if a owner tries to aprove multiple times");

  });

  it("approveTransaction -- dont submit transaction if necessary votes are not reached ", async () => {
    const txParams = {
      from: accounts[0]
    };


    const firstOwner = accounts[0];
    const secondOwner = accounts[1];
    const foreignAddress = accounts[2];

    const instance = await MultiSigWallet.new([firstOwner, secondOwner], 2, txParams);
    await instance.send(1000, { from: firstOwner })

    await instance.addTransaction(firstOwner, 10, { from: foreignAddress });


    const oldBalance = await web3.eth.getBalance(foreignAddress);


    await instance.approveTransaction(0, { from: firstOwner });

    await instance.transactions(0);

    const transaction = await instance.transactions(0);


    assert.equal(transaction.isApproved, false);

    const newBalance = await web3.eth.getBalance(foreignAddress);

    assert.equal(Number.parseInt(newBalance), Number.parseInt(oldBalance));

  });

  it("approveTransaction -- submit transaction if necessary approvesare reached ", async () => {
    const txParams = {
      from: accounts[0]
    };


    const firstOwner = accounts[0];
    const secondOwner = accounts[1];
    const foreignAddress = accounts[2];

    const instance = await MultiSigWallet.new([firstOwner, secondOwner], 2, txParams);
    await instance.send(1000, { from: firstOwner })

    await instance.addTransaction(firstOwner, 10, { from: foreignAddress });


    const oldBalance = await web3.eth.getBalance(foreignAddress);


    await instance.approveTransaction(0, { from: firstOwner });
    await instance.approveTransaction(0, { from: secondOwner });
    await instance.transactions(0);

    const transaction = await instance.transactions(0);


    assert.equal(transaction.isApproved, true);

    const newBalance = await web3.eth.getBalance(foreignAddress);

    assert.equal(Number.parseInt(newBalance), Number.parseInt(oldBalance) + 10);

  });

  it("approveTransaction -- fails if transaction is already processed ", async () => {
    const txParams = {
      from: accounts[0]
    };


    const firstOwner = accounts[0];
    const secondOwner = accounts[1];
    const foreignAddress = accounts[2];

    const instance = await MultiSigWallet.new([firstOwner, secondOwner], 2, txParams);
    await instance.send(1000, { from: firstOwner })

    await instance.addTransaction(firstOwner, 10, { from: foreignAddress });




    await instance.approveTransaction(0, { from: firstOwner });
    await instance.approveTransaction(0, { from: secondOwner });
    await instance.transactions(0);

    const transaction = await instance.transactions(0);

    assert.equal(transaction.isProccesed, true);

    try {
      await instance.executeTransaction(0, { from: secondOwner });
    } catch (e) {

      return true;
    }

    throw Error("Transaction should not be executed more than once")

  });

  it("approveTransaction -- fails if sender is not one of the owner ", async () => {
    const txParams = {
      from: accounts[0]
    };


    const firstOwner = accounts[0];
    const secondOwner = accounts[1];
    const foreignAddress = accounts[2];

    const instance = await MultiSigWallet.new([firstOwner, secondOwner], 1, txParams);
    await instance.send(1000, { from: firstOwner })

    await instance.addTransaction(firstOwner, 10, { from: foreignAddress });




    try {
      await instance.approveTransaction(0, { from: foreignAddress });

    } catch (e) {
      return true;
    }


    throw new Error("Contract should reject if sender is not the owner");

  });





 


});
