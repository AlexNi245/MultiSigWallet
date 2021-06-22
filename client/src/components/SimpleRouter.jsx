import React, {useState} from "react";
import {RouterContext} from "../context/RouterContext";
import {SetupGanache} from "../screens/SetupGanache";
import {SetupContract} from "../screens/SetupContract";

export const ROUTES = Object.freeze({
    "SETUP_GANACHE": "SETUP_GANACHE",
    "SETUP_CONTRACT": "SETUP_CONTRACT"
})

export const SimpleRouter = () => {

    const [currentRoute, setCurrentRoute] = useState(ROUTES.SETUP_GANACHE)

    const getComponentForRoute = () => {

        switch (currentRoute) {
            case ROUTES.SETUP_GANACHE:
                return <SetupGanache/>
            case ROUTES.SETUP_CONTRACT:
                return <SetupContract/>
            default  :
                return <p>404</p>
        }
    }

    return <RouterContext.Provider value={{currentRoute, setCurrentRoute}}>
        {
            getComponentForRoute()
        }
    </RouterContext.Provider>

}