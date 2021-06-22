import React, {useState,useContext} from "react";
import Web3 from "web3";
import MultiSigWallet from "../contracts/MultiSigWallet.json";
import {RouterContext} from "../context/RouterContext";
import {ROUTES} from "../components/SimpleRouter";

export const SetupGanache = () => {

    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);
    const [ganacheProviderUrl, setGanacheProviderUrl] = useState("http://localhost:7545");

    const {setCurrentRoute} = useContext(RouterContext);

    const initGanache = async () => {
        try {

            setCurrentRoute(ROUTES.SETUP_CONTRACT);
            const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

            const accounts = await web3.eth.getAccounts();

            const contract = new web3.eth.Contract(MultiSigWallet.abi);
            const incrementerTx = contract.deploy({
                data: MultiSigWallet.bytecode,
                arguments: [[accounts[0]], 1]
            });


            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.


            setAccounts(accounts);
            setContract(incrementerTx);



        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    }


    return <div>
        <div className="space-y-4">
            <h1 className="text-6xl">Welcome </h1>
            <div>
                <p>This is an example Implementation of a Multi Signature Wallet made with Solidity</p>
                <p>You can connect it with you local Ganache Provider and play around</p>

            </div>
        </div>

        <div className="flex flex-col space-y-4 mt-12">
            <div className="mb-3 pt-0 w-48">
                <input
                    value={ganacheProviderUrl}
                    onChange={(e) => setGanacheProviderUrl(e.target.value)}
                    type="text"
                    placeholder="http://localhost:7545"
                    className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
            </div>
            <button onClick={initGanache} className="bg-green-500 br-4 px-2 py-4 text-white rounded-sm w-48">
                Connect with Ganache
            </button>
        </div>
    </div>
}