import React, {useContext, useEffect, useState} from "react";
import Select from 'react-select'
import {Web3Context} from "../../context/Web3Context";
import {WalletContext} from "../../context/WalletContext";

export const SelectAccount = () => {


    const [accountOptions, setAccountsOptions] = useState([])
    const {web3} = useContext(Web3Context);
    const{handleSetCurrentAccount} =  useContext(WalletContext)

    useEffect(() => {
        getAddresses()
    },[])

    const getAddresses = async () => {
        const accounts = await web3.eth.getAccounts();
        setAccountsOptions(accounts.map(account => ({"label": account, "value": account})))
    }

    const onSelectAccount = ({value}) => handleSetCurrentAccount(value)

    return <>
        <h1 className="mb-2">Choose Account</h1>
        <div className="w-3/5">

        <Select options={accountOptions} onChange = {onSelectAccount}/>
        </div>

    </>
}