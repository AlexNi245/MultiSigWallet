const MultiSigWallet = artifacts.require("./MultiSigWallet.sol");

contract("MultiSigWallet", accounts => {


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
