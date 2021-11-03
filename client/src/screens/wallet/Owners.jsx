import React, {useContext, useEffect, useState} from "react";
import {WalletContext} from "../../context/WalletContext";
import {ContractContext} from "../../context/ContractContext";

export const Owners = () => {
    const {walletBalance, currentAccount} = useContext(WalletContext)
    const {contract} = useContext(ContractContext);
    const [owners, setOwners] = useState([])

    const fetchOwner = async () => {

        console.log(contract.methods);

        const _owners = await contract.methods.getOwners().call()


        setOwners(_owners);
    }

    useEffect(() => {
        fetchOwner();
    }, [])

    return <div className="text-white flex-col flex bg-green-500 w-3/12 ml-6  rounded-lg p-2">
        <p className="px-4 pb-2 text-lg "> Owners</p>
        <div>
            {owners.map(o=><p className="text-center">{o}</p>)}
        </div>
    </div>
}
