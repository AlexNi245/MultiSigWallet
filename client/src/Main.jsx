import React, {useEffect, useState} from "react";
import MultiSigWallet from "./contracts/MultiSigWallet.json";
import Web3 from "web3";
import {SetupGanache} from "./screens/SetupGanache";
import {RouterContext} from "./context/RouterContext";
import {SimpleRouter} from "./components/SimpleRouter";

export const Main = ({}) => {


    const [mounted, setMounted] = useState(false);


    return <>
        <SimpleRouter/>
    </>
}