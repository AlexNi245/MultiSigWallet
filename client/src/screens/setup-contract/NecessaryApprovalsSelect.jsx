import React, {useState} from "react";

export const NecessaryApprovalsSelect = ({max,submitCount}) => {

    const [count, setCount] = useState(1);

    const _increment = () => setCount(c => c >= max ? max : c + 1);
    const _decrement = () => setCount(c => c <= 1 ? 0 : c - 1);

    console.log(count)

console.log(count)
    return <div>

        <div onClick={_increment}>⬆️</div>
        {count}
        <div onClick={_decrement}>⬇️</div>

    </div>
}