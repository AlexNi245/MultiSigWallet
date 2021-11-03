import React, {useContext, useEffect, useState} from "react";
import {ContractContext} from "../../context/ContractContext";
import {SelectAccount} from "./SelectAccount";
import {WalletContext} from "../../context/WalletContext";
import {Web3Context} from "../../context/Web3Context";
import {Deposit} from "./Deposit";
import {Funds} from "./Funds";
import {RequestTransaction} from "./RequestTransaction";
import {Transactions} from "./Transactions";
import {WalletSection} from "./WalletSection";
import {Owners} from "./Owners";
import {Approvals} from "./Approvals";
import {ContractBalance} from "./ContractBalance";

export const Wallet = ({}) => {
    const {contract} = useContext(ContractContext);
    const {web3} = useContext(Web3Context);


    const [currentAccount, setCurrentAccount] = useState(null);
    const [currentAccountsBalance, setCurrentAccountsBalance] = useState("0")
    const [walletBalance, setWalletBalance] = useState("0")

    const [] = useState(null);


    useEffect(() => {
        updateWalletBalance()
    }, [])

    useEffect(() => {
        updateCurrentAccountsBalance(currentAccount)
    }, [walletBalance])

    const updateWalletBalance = async () => {
        console.log(contract)
        const balance = await web3.eth.getBalance(contract.options.address);
        setWalletBalance(balance);
    }

    const handleSetCurrentAccount = async account => {
        setCurrentAccount(account);
        updateCurrentAccountsBalance(account)
    }
    const updateCurrentAccountsBalance = async account => {
        if (currentAccount === null) {
            return
        }
        const balance = await web3.eth.getBalance(account);
        setCurrentAccountsBalance(balance)
    }


    return <WalletContext.Provider value={{
        currentAccount,
        handleSetCurrentAccount,
        walletBalance,
        updateWalletBalance,

        currentAccountsBalance
    }}>

        <div className="px-12 py-8 h-full bg-gray-900 text-white space-y-12">
            <div className="flex justify-between mb-64">
                <Owners/>
                <Approvals/>
                <ContractBalance/>
                <SelectAccount/>
            </div>


            <WalletSection
                headline="Funds"
                description="Deposit funds to the wallet"
                children={[<Deposit/>, <Funds/>]}
            />
            <WalletSection
                headline="Transactions"
                description="Request a Transaction"
                children={[<RequestTransaction/>]}
            />
            <WalletSection
                headline="Transactions"
                description="Below you can see all Transactions of the wallet"
                children={[<Transactions/>]}
            />

        </div>
    </WalletContext.Provider>
}
