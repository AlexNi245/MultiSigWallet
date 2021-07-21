import React, {useContext, useState,} from "react"
import {Web3Context} from "../../context/Web3Context";
import {WalletContext} from "../../context/WalletContext";
import {ContractContext} from "../../context/ContractContext";
import {toWei} from "web3-utils";
import ethIcon from "./../../eth-icon.png"

export const Deposit = () => {

    const [amount, setAmount] = useState(0);

    const {web3} = useContext(Web3Context);
    const {currentAccount, updateWalletBalance} = useContext(WalletContext)
    const {contract} = useContext(ContractContext)

    const onChangeAmount = e => {
        setAmount(e.target.value)
    }

    const deposit = async () => {
        console.log(currentAccount)
        await contract.methods.addFund().send({
            //Todo adjust gas limit
            gasLimit: 1000000,
            from: currentAccount,
            value: toWei(amount, "ether")
        })
        updateWalletBalance()

    }


    return <div className="text-white flex-col flex bg-gray-800 w-6/12 max-w-md rounded-2xl p-2">
        <p className="px-4 pb-2 text-lg ">Deposit Ether</p>
        <div className="flex justify-between bg-gray-700 rounded-2xl  mx-2 px-2 pt-4 pb-6 ">
            <div className="flex bg-gray-900 rounded-2xl  p-2">
                <div
                    style={{
                        "height": "30px",
                        "width": "30px"
                    }}>
                    <img src={ethIcon} alt="Eth-icon"/>
                </div>
                <div className="mx-2"></div>
                <p className="self-center">ETH</p>
            </div>
            <input
                className="bg-gray-700 focus:outline-none text-right w-full block "
                type="number"
                value={amount}
                min="0"
                onChange={onChangeAmount}/>
        </div>
        <div className="m-2"></div>
        <button className="bg-green-500 rounded-2xl mx-2 px-2 p-2 mb-2 " onClick={deposit}>Deposit</button>
    </div>
}