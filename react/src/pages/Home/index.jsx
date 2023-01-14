import React from 'react'

import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "../../redux/actions/counter";

export const index = () => {
    const counter = useSelector((state) => state.counter);
    const dispatch = useDispatch();
    return (
        <div>
            <h1>Counter {counter}</h1>
            <button onClick={() => dispatch(increment(5))}>Increment</button>
            <button onClick={() => dispatch(decrement(5))}>Decrement</button>
        </div>
    )
}
