import {useForm} from "./useForm";
import {React, useState,useEffect} from 'react';
import {useFetch} from "./useFFetch";

export  function Form() {
    const [count,setCount]=useState(() => JSON.parse(localStorage.getItem('count')));
    const {data,loading}=useFetch(`http://numbersapi.com/${count}/trivia`);
    const [values, handleChange] = useForm({email: '', password: ''});
    useEffect(()=>{
        localStorage.setItem('count',JSON.stringify(count))
    },[count]);
    return (
        <div>
            <div>{loading?'loading ...':data} {count}</div>
            <button onClick={()=>setCount(c=>c+1)}>count</button>
            <>
                <input name='email' value={values.email} placeholder="email" onChange={handleChange}/>
                <input name='password' type="password" value={values.password} placeholder='password' onChange={handleChange}/>
            </>
        </div>
    );
};
// 'https://api.adviceslip.com/advice'
