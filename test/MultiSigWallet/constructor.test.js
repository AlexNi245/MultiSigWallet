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

  


});
