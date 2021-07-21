const MultiSigWallet = artifacts.require("./MultiSigWallet.sol");

contract("MultiSigWallet", accounts => {


    it("fundTransaction -- fund was added to funds history. Also it increases the contract balance", async () => {
        const txParams = {
            from: accounts[0]
        };


        const firstOwner = accounts[0];
        const secondOwner = accounts[1];
        const foreignAddress = accounts[2];


        const instance = await MultiSigWallet.new([firstOwner, secondOwner], 1, txParams);
        await instance.addFund({from: firstOwner, value: 1000})


        const fund1 = await instance.funds(0);
        assert.equal(fund1.from, firstOwner)
        assert.equal(fund1.value, 1000)

        const currentBalance = await web3.eth.getBalance(instance.address);
        assert.equal(currentBalance, 1000)


    });

    it.only("fundTransaction -- get all funds", async () => {
        const txParams = {
            from: accounts[0]
        };


        const firstOwner = accounts[0];
        const secondOwner = accounts[1];


        const instance = await MultiSigWallet.new([firstOwner, secondOwner], 1, txParams);
        await instance.addFund({from: firstOwner, value: 1000})
        await instance.addFund({from: secondOwner, value: 1000})
        await instance.addFund({from: firstOwner, value: 1000})

        const id = await instance.currentFundId()

        const currentBalance = await web3.eth.getBalance(instance.address);
        assert.equal(currentBalance, 3000)
        assert.equal(id, 3)

    });


});
