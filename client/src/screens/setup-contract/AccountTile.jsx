import React from "react";

export const AccountTile = ({address, isSelected, onClick}) => {
    return <div className="flex space-y-2 flex-row " onClick={()=>onClick(address)}>
        <p className={`py-2 ${ isSelected(address) ? "text-yellow-100" :"text-white" }`} >{address}</p>
    </div>
}