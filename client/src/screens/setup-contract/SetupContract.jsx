import React, {useContext, useEffect, useState} from "react";
import MultiSigWallet from "../../contracts/MultiSigWallet.json";
import {Web3Context} from "../../context/Web3Context";
import {AccountTile} from "./AccountTile";
import {NecessaryApprovalsSelect} from "./NecessaryApprovalsSelect";
import {ContractContext} from "../../context/ContractContext";
import {RouterContext} from "../../context/RouterContext";
import {ROUTES} from "../../components/SimpleRouter";

export const SetupContract = () => {


    const {web3} = useContext(Web3Context);
    const {setContract} = useContext(ContractContext);
    const [accounts, setAccounts] = useState([])


    const {setCurrentRoute} = useContext(RouterContext);
    const [selectedAccounts, setSelectedAccounts] = useState([])
    const [necessaryApprovals, setNecessaryApprovals] = useState(1);


    const getAddresses = async () => {
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);
    }

    const deployContract = async () => {
        const contract = new web3.eth.Contract(MultiSigWallet.abi);
        const incrementerTx = await contract.deploy({
            data: MultiSigWallet.bytecode,
            arguments: [selectedAccounts, necessaryApprovals]
        }).send({
            from: accounts[0],
            gas: 4712388,
            gasPrice: 100000000000
        })
        setContract(incrementerTx);
        setCurrentRoute(ROUTES.WALLET)

    }

    const _handleOnClickAccounts = (account) => {
        if (selectedAccounts.includes(account)) {
            setSelectedAccounts(selectedAccounts.filter(e => e !== account))
        } else {
            setSelectedAccounts([...selectedAccounts, account])
        }
    }

    const _isAccountSelected = (a) => selectedAccounts.includes(a);


    useEffect(() => {
        getAddresses();
    }, [])

    return <div className="flex flex-row justify-center bg-gray-700 h-screen">
        <div className="divide-y-2 ">

            {
                accounts.map(a => <AccountTile key={a} address={a} onClick={_handleOnClickAccounts}
                                               isSelected={_isAccountSelected}/>)
            }
            <p>{selectedAccounts.length} Owners</p>
            <NecessaryApprovalsSelect submitCount={(c) => setNecessaryApprovals(c)}/>
            <button onClick={deployContract}>Deploy</button>
        </div>

    </div>

}