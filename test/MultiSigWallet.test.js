
const MultiSigWallet = artifacts.require( "./MultiSigWallet.sol");

contract("MultiSigWallet", accounts => {



  it("constructor -- should reject invalid arguments", async () => {

    const accounts = await web3.eth.getAccounts();
    const txParams = {
      from: accounts[0]
    };

    try{
      const instance = await MultiSigWallet.new([], 0, txParams);
      assert.fail("Invalid arguments")
    }catch(e){}
  });

  it("constructor -- number of owners are equal to approvals", async () => {

    const accounts = await web3.eth.getAccounts();
    const txParams = {
      from: accounts[0]
    };

    try{
      const instance = await MultiSigWallet.new(["0x782C65D3721a49818CADaaF19869f00841103B52"], 1, txParams);
    }catch(e){
      assert.fail("Invalid arguments")
    }
  });

  it("constructor -- number of owners are greater as approvals", async () => {

    const accounts = await web3.eth.getAccounts();
    const txParams = {
      from: accounts[0]
    };

    try{
      const instance = await MultiSigWallet.new(["0x782C65D3721a49818CADaaF19869f00841103B52","0x7761e957cc858F63be3B8A6f13e77c1295049513"], 1, txParams);
    }catch(e){
      assert.fail("Invalid arguments")
    }
  });




});
