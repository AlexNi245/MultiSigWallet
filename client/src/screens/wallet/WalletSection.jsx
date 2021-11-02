import React from "react";

export const WalletSection = ({headline, description, children}) => {
    return <div>
        <div className="ml-6 mb-4">
            <h1 className="text-2xl">{headline}</h1>
            <p>{description}</p>
        </div>
        <div className="flex justify-between w-full space-x-12">
            {children}
        </div>
    </div>
}
