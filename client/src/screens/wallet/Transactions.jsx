import React, {useContext, useEffect, useState} from "react";
import {WalletContext} from "../../context/WalletContext";
import {ContractContext} from "../../context/ContractContext";
import {formatDate} from "../../utils/formatDate";

export const Transactions = () => {

    const {walletBalance, currentAccount} = useContext(WalletContext)
    const {contract} = useContext(ContractContext);

    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        getTransactions();
    }, [walletBalance])

    const getTransactions = async (offset = 0) => {

        const PAGE_SIZE = 10;

        const latestTransactionsId = await contract.methods.currentTransactionId().call(
            {from: currentAccount}
        )//lenght of the transaction mapping


        const transactionsPromises = []


        for (const i in [...Array(PAGE_SIZE).keys()]) {
            //prevent index out of bounds exception...
            const idxWithOffset = Number.parseInt(i) + offset

            if (idxWithOffset >= Number.parseInt(latestTransactionsId)) {
                break;
            }
            transactionsPromises.push(contract.methods.transactions(idxWithOffset).call({
                from: currentAccount
            }))
        }

        const resolvedTransactions = await Promise.all(transactionsPromises)
        console.log(resolvedTransactions)
        setTransactions(resolvedTransactions)

    }


    return <div className="text-white flex-col flex bg-gray-800   rounded-2xl p-2 divide-y-2">
        <p className=" pb-2 text-xl  px-4  ">Transactions</p>
        <div className="">
            <div className="text-lg flex flex-row justify-between px-4 mt-4 mb-2">
                <p className="w-3/12">Sender</p>
                <p className="w-3/12">Receiver</p>
                <p className="w-1/12">Value</p>
                <p className="w-2/12">Added</p>
            </div>
            {transactions.map(({from, to, ammount, timestamp, approved}) =>
                <div className="flex flex-row justify-between px-4 space-y-1 ">
                    <p className="w-3/12">{from}</p>
                    <p className="w-3/12">{to}</p>
                    <p className="w-1/12">{ammount}</p>
                    <p className="w-2/12">{formatDate( new Date(timestamp*1000))}</p>
                </div>
            )}
        </div>

    </div>
}
