import React, {useContext, useEffect, useState} from "react";
import {WalletContext} from "../../context/WalletContext";
import {fromWei} from "web3-utils";
import {ContractContext} from "../../context/ContractContext";

export const Funds = () => {

    const {walletBalance, currentAccount} = useContext(WalletContext)
    const {contract} = useContext(ContractContext);

    const [funds, setFunds] = useState([])

    useEffect(() => {
        getLatestFunds();
    }, [walletBalance,])


    const getLatestFunds = async () => {

        if (currentAccount == null) {
            return;
        }

        const latestFundId = await contract.methods.currentFundId().call(
            {from: currentAccount}
        )


        const fundPromises = [];


        for (const i in [...Array(Number.parseInt(latestFundId)).keys()]) {
            fundPromises.push(contract.methods.funds(i).call({
                from: currentAccount
            }))
        }

        const resolvedFunds = await Promise.all(fundPromises);

        setFunds(resolvedFunds.map(({from, value}) => ({
            from,
            value: fromWei(value, "ether")
        })))

    }

    return <div className="text-white flex-col flex bg-gray-800 w-8/12 h-80 rounded-2xl p-2 divide-y-2 ">

        <p className=" pb-2 text-xl  px-4  ">Funds</p>



        <div className="overflow-scroll">
            <div className="text-lg flex flex-row justify-between px-4 mt-6 mb-2">
                <p>Sender</p>
                <p>Value</p>
            </div>
            {funds.map(({from, value}) =>
                <div className="flex flex-row justify-between px-4 space-y-1 ">
                    <p>{from}</p>
                    <p>{value}</p>
                </div>)}

        </div>

    </div>
}
