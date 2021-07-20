import React, {useContext, useState} from "react"
import {Web3Context} from "../../context/Web3Context";
import {WalletContext} from "../../context/WalletContext";
import {ContractContext} from "../../context/ContractContext";
import {toWei} from "web3-utils";

export const Deposit = () => {

    const [amount, setAmount] = useState(0);

    const {web3} = useContext(Web3Context);
    const {currentAccount} = useContext(WalletContext)
    const {contract} = useContext(ContractContext)

    const onChangeAmount = e => {
        //Todo add some validation
        setAmount(e.target.value)
    }

    const deposit = () => {
        console.log(currentAccount)
        web3.eth.sendTransaction({
            from: currentAccount,
            to: contract.options.address,
            value: toWei(amount, "ether")
        })

    }
    return <>
        <p>Deposit Ether</p>
        <input type="number" value={amount} onChange={onChangeAmount}/>
        <button onClick={deposit}>Deposit</button>
    </>
}