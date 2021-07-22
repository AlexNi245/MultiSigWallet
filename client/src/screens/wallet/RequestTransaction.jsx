import React, {useState, useEffect, useContext} from "react";
import Select from "react-select";

import {WalletContext} from "../../context/WalletContext";
import {Web3Context} from "../../context/Web3Context";
import ethIcon from "../../eth-icon.png";
import {fromWei, toWei} from "web3-utils";
import {ContractContext} from "../../context/ContractContext";

export const RequestTransaction = () => {

    const {currentAccount, walletBalance} = useContext(WalletContext)
    const {web3} = useContext(Web3Context);
    const {contract} = useContext(ContractContext)

    useEffect(() => {
        getAddresses()
    }, [currentAccount])

    const [accountOptions, setAccountsOptions] = useState([])
    const [targetAccount, setTargetAccount] = useState(null);

    const [amount, setAmmount] = useState(0);

    const setNewAmount = ({target}) => {
        const walletBalanceInEth = Number.parseInt(fromWei(walletBalance, "ether"));
        setAmmount(target.value >= walletBalanceInEth ? walletBalanceInEth : target.value.toString())
    }


    const getAddresses = async () => {
        const accounts = (await web3.eth.getAccounts()).filter(a => a !== currentAccount);
        setAccountsOptions(accounts.map(account => ({
            "label": account,
            "value": account
        })))

    }

    const onChangeTargetAccount = ({value}) => {
        setTargetAccount(value)
    }

    const requestTransaction =async (

    ) => {
        await contract.methods.addTransaction(targetAccount,toWei(amount, "ether")).send({
            gasLimit: 1000000,
            from: currentAccount,


        })
    }
    return <div className="text-white flex-col flex bg-gray-800 w-9/12 max-w-lg rounded-2xl p-2 ">

        <p className=" pb-2 text-xl  px-4  ">Request Transaction</p>
        <div className="flex justify-between bg-gray-800 mb-2 pl-4 pr-2 "><p
            className="self-center">To</p>
            <div className=" w-full pl-2">
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
                        label: targetAccount, "value": targetAccount
                    }} options={accountOptions} onChange={onChangeTargetAccount}/>
            </div>
        </div>
        <div className="flex justify-between bg-gray-700 rounded-2xl  mx-2 px-2 pt-4 my-4 pb-4 ">
            <div className="flex bg-gray-900 rounded-2xl  p-2">
                <div
                    style={{
                        "height": "30px",
                        "width": "30px"
                    }}>
                    <img src={ethIcon} alt="Eth-icon"/>
                </div>
                <div className="mx-2"></div>
                <p className="self-center">ETH</p>
            </div>
            <input
                className="bg-gray-700 focus:outline-none text-right w-full block "
                type="number"
                value={amount}
                min="0"
                onChange={setNewAmount}/>
        </div>
        <button className="bg-yellow-600 rounded-2xl mx-2 px-2 p-2 mb-2 " onClick={requestTransaction}>RequestTransaction</button>


    </div>
}