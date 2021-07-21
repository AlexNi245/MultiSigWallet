import React, {useContext, useEffect, useState} from "react";
import {ContractContext} from "../../context/ContractContext";
import {SelectAccount} from "./SelectAccount";
import {WalletContext} from "../../context/WalletContext";
import {Web3Context} from "../../context/Web3Context";
import {Deposit} from "./Deposit";
import {Funds} from "./Funds";

export const Wallet = ({}) => {
    const {contract} = useContext(ContractContext);
    const {web3} = useContext(Web3Context);


    const [currentAccount, setCurrentAccount] = useState(null);
    const [walletBalance, setWalletBalance] = useState("0")

    const [] = useState(null);


    useEffect(() => {
        updateWalletBalance()
    }, [])

    const updateWalletBalance = async () => {
        console.log(contract)
        const balance = await web3.eth.getBalance(contract.options.address);
        setWalletBalance(balance);
    }

    const handleSetCurrentAccount = account => {
        setCurrentAccount(account);
    }


    return <WalletContext.Provider value={{
        currentAccount, handleSetCurrentAccount, walletBalance, updateWalletBalance, setCurrentAccount
    }}>

        <SelectAccount/>
        <div className="mt-12 ml-12">
            <Deposit/>
        </div>
        <div className="mt-12 ml-12">
            <Funds/>
        </div>

    </WalletContext.Provider>
}
