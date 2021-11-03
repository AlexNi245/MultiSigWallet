import React, {useContext, useEffect, useState} from "react"
import {WalletContext} from "../../context/WalletContext";
import {ContractContext} from "../../context/ContractContext";
import {Web3Context} from "../../context/Web3Context";
import {fromWei} from "web3-utils";

export const ContractBalance = () => {
    const {walletBalance, currentAccount} = useContext(WalletContext)
    const {web3} = useContext(Web3Context);
    const {contract} = useContext(ContractContext);
    const [balance, setBalance] = useState("")

    const fetchContractBalance = async () => {

        const _balance = await web3.eth.getBalance(contract._address)


        console.log("got balance");
        console.log(_balance)

        setBalance(_balance);
    }

    useEffect(() => {
        fetchContractBalance();
    }, [walletBalance])

    return <div className="text-white flex-col flex bg-yellow-600  w-2/12 ml-6  rounded-lg p-2">
        <p className="px-4 pb-2 text-lg text-center"> Contract Balance </p>
        <div className="flex flex-col justify-center h-full">
            <p className="text-6xl	font-bold text-center">{fromWei(balance, "ether")}</p>
        </div>
    </div>
}
