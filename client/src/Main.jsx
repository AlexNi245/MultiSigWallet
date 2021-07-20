import React, {useEffect, useState} from "react";
import MultiSigWallet from "./contracts/MultiSigWallet.json";
import Web3 from "web3";
import {SetupGanache} from "./screens/SetupGanache";
import {RouterContext} from "./context/RouterContext";
import {SimpleRouter} from "./components/SimpleRouter";
import {Web3Context} from "./context/Web3Context";
import {ContractContext} from "./context/ContractContext";

export const Main = ({}) => {


    const [mounted, setMounted] = useState(false);

    const [web3, setWeb3] = useState(null)
    const [contract, setContract] = useState(null)

    return <>
        <Web3Context.Provider value={{web3, setWeb3}}>
            <ContractContext.Provider value={{contract, setContract}}>
                <SimpleRouter/>
            </ContractContext.Provider>
        </Web3Context.Provider>
    </>
}