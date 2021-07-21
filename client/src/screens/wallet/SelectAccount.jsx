import React, {useContext, useEffect, useState} from "react";
import Select from 'react-select'
import {Web3Context} from "../../context/Web3Context";
import {WalletContext} from "../../context/WalletContext";
import {fromWei} from "web3-utils";

export const SelectAccount = () => {


    const [accountOptions, setAccountsOptions] = useState([])
    const {web3} = useContext(Web3Context);
    const {
        handleSetCurrentAccount,
        currentAccount,
        currentAccountsBalance
    } = useContext(WalletContext)

    useEffect(() => {
        getAddresses()
    }, [])

    const getAddresses = async () => {
        const accounts = await web3.eth.getAccounts();
        setAccountsOptions(accounts.map(account => ({"label": account, "value": account})))
        handleSetCurrentAccount(accounts[0])
    }

    const onSelectAccount = ({value}) => handleSetCurrentAccount(value)

    return <div className="text-white flex-col flex bg-gray-800 w-9/12 max-w-lg rounded-2xl p-2">
        <div className="px-4 pb-2 text-lg flex flex-row justify-between">
        <p >Choose Account</p>
        <p>{`${fromWei(currentAccountsBalance)} ETH`}</p>
        </div>
        <div className="bg-gray-800 mb-2 px-2">
            <Select
                styles={{
                    singleValue: (provided, state) => ({
                        ...provided,
                        backgroundColor: "#374151",
                        color: "white",

                    }),
                    control: (provided) => ({
                        ...provided,
                        backgroundColor: "#374151",
                        color: "white",
                        borderRadius: "1rem",
                        borderColor: "#374151"
                    }),
                    option: (provided, state) => ({
                        ...provided,
                        backgroundColor: "#374151",
                        color: "white",
                    }),
                }}
                value={{
                    label: currentAccount, "value": currentAccount
                }} options={accountOptions} onChange={onSelectAccount}/>
        </div>
    </div>
}