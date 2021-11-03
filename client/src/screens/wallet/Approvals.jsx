import React, {useContext, useEffect, useState} from "react";
import {WalletContext} from "../../context/WalletContext";
import {ContractContext} from "../../context/ContractContext";

export const Approvals = () => {
    const {walletBalance, currentAccount} = useContext(WalletContext)
    const {contract} = useContext(ContractContext);
    const [approvals, setApprovals] = useState([])

    const fetchApprovals = async () => {

        const _approvals = await contract.methods.necessaryApprovals().call()

        setApprovals(_approvals);
    }

    useEffect(() => {
        fetchApprovals();
    }, [])

    return <div className="text-white flex-col flex bg-blue-500 w-2/12 ml-6  rounded-lg p-2">
        <p className="px-4 pb-2 text-lg text-center"> Necessary Approvals </p>
        <div className="flex flex-col justify-center h-full">
            <p className="text-7xl	font-bold text-center">{approvals}</p>
        </div>
    </div>
}
