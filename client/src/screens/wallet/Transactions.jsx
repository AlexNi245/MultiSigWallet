import React, {useContext, useEffect, useState} from "react";
import {WalletContext} from "../../context/WalletContext";
import {ContractContext} from "../../context/ContractContext";
import {formatDate} from "../../utils/formatDate";
import {Web3Context} from "../../context/Web3Context";
import {fromWei} from "web3-utils";

export const Transactions = () => {

    const {walletBalance, currentAccount} = useContext(WalletContext)
    const {contract} = useContext(ContractContext);
    const {web3} = useContext(Web3Context);


    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        getTransactions();
    }, [walletBalance])

    const getTransactions = async (offset = 0) => {


        const latestTransactionsId = Number.parseInt(await (contract.methods.currentTransactionId().call(
            {from: currentAccount}
        )))//lenght of the transaction mapping


        const transactionsPromises = []


        for (const i in [...Array(latestTransactionsId).keys()]) {
            //Fetch Transaction in reverse
            const idxWithOffset = latestTransactionsId - 1 - (Number.parseInt(i) + offset)

            //prevent index out of bounds exception...
            if (idxWithOffset >= (latestTransactionsId) || idxWithOffset < 0) {
                break;
            }

            transactionsPromises.push(contract.methods.transactions(idxWithOffset).call({
                from: currentAccount
            }))
        }

        const resolvedTransactions = await Promise.all(transactionsPromises)


        setTransactions(resolvedTransactions);

    }

    const initialFetchTransactions = () => {
        getTransactions(0);
    }

    contract.events.TransactionAdded().on("data", () => initialFetchTransactions())

    return <div className="text-white flex-col flex bg-gray-800 w-full  rounded-2xl p-2 divide-y-2">
        <p className=" pb-2 text-xl  px-4  ">Transactions</p>
        <div className="">
            <div className="text-lg flex flex-row justify-between px-4 mt-4 mb-2">
                <p className="w-3/12">Sender</p>
                <p className="w-3/12">Receiver</p>
                <p className="w-1/12">Value</p>
                <p className="w-2/12">Added</p>
            </div>
            {transactions.map(({from, to, amount, timestamp, approved}) =>
                <div className="flex flex-row justify-between px-4 space-y-1 ">
                    <p className="w-3/12">{from}</p>
                    <p className="w-3/12">{to}</p>
                    <p className="w-1/12">{fromWei(amount, "ether")}</p>
                    <p className="w-2/12">{formatDate(new Date(timestamp * 1000))}</p>
                </div>
            )}
        </div>
    </div>
}
