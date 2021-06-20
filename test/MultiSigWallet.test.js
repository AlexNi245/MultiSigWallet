
const MultiSigWallet = artifacts.require("./MultiSigWallet.sol");

contract("MultiSigWallet", accounts => {

  it("constructor -- should reject invalid arguments", async () => {

    const txParams = {
      from: accounts[0]
    };

    try {
      const instance = await MultiSigWallet.new([], 1, txParams);
    } catch (e) {
      return true;
    }

    throw new Error("Contract was created despite wrong arguments!")
  });

  it("constructor -- number of owners are equal to approvals", async () => {

    const txParams = {
      from: accounts[0]
    };

    try {
      const instance = await MultiSigWallet.new(["0x782C65D3721a49818CADaaF19869f00841103B52"], 1, txParams);
    } catch (e) {
      console.log(e)
      assert.fail("Invalid arguments")
    }
  });

  it("constructor -- number of owners are greater as approvals", async () => {

    const txParams = {
      from: accounts[0]
    };

    try {
      const instance = await MultiSigWallet.new(["0x782C65D3721a49818CADaaF19869f00841103B52", "0x7761e957cc858F63be3B8A6f13e77c1295049513"], 1, txParams);
    } catch (e) {
      assert.fail("Invalid arguments")
    }
  });



  it("constructor -- store owners properly", async () => {


    const txParams = {
      from: accounts[0]
    };


    const firstOwner = accounts[0];
    const secondOwner = accounts[1];



    const instance = await MultiSigWallet.new([firstOwner, secondOwner], 1, txParams);



    assert.equal(await instance.owners(0), firstOwner)
    assert.equal(await instance.owners(1), secondOwner)

  })

  it("approveTransaction -- fails if  not called by one of the owners", async () => {

    const txParams = {
      from: accounts[0]
    };

    const firstOwner = accounts[0];
    const secondOwner = accounts[1];
    const foreignAddress = accounts[2];
    const dummyTransactionId = 0


    const instance = await MultiSigWallet.new([firstOwner, secondOwner], 1, txParams);

    try {
      await instance.approveTransaction(dummyTransactionId, { from: foreignAddress });

    } catch (e) {
      return true;

    }
    throw new Error("Function should reject if called by anyone else excepts the owners")
  })


  it("addTranaction -- fails if transaction ammount exceeds contract balance ", async () => {
    const txParams = {
      from: accounts[0]
    };


    const firstOwner = accounts[0];
    const secondOwner = accounts[1];
    const foreignAddress = accounts[2];



    const instance = await MultiSigWallet.new([firstOwner, secondOwner], 1, txParams);
    await instance.send(1000, { from: firstOwner })



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
    await instance.send(1000, { from: firstOwner })



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
    await instance.send(1000, { from: firstOwner })
    await instance.addTransaction(firstOwner, 100, { from: foreignAddress });

    const currentTransactionId = await instance.currentTransactionId();

    assert.equal(currentTransactionId, 1);


  });

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





  it("execute Transaction -- fails if sender is not one of the owners ", async () => {
    const txParams = {
      from: accounts[0]
    };


    const firstOwner = accounts[0];
    const secondOwner = accounts[1];
    const foreignAddress = accounts[2];

    const instance = await MultiSigWallet.new([firstOwner, secondOwner], 1, txParams);

    try {
      await instance.executeTransaction(0, { from: foreignAddress });

    } catch (e) {
      return true;
    }

    throw new Error("Contract should reject if sender is not the owner");

  });



});
