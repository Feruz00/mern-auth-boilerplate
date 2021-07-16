import React, { useCallback, useContext,useEffect,useMemo,useState} from 'react';

import axios from 'axios';
import config from './config';

const AuthContext = React.createContext();

export const Auth = ()=>useContext(AuthContext);

export const AuthProvider = ({children})=>{

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
       
    const getData = useCallback( async ()=>{
        const ENDPOINT = config+"/api/users/auth";
        await axios({
            url: ENDPOINT,
            method: "GET",
            withCredentials: true
        }).then(res=>{
            if(res.data.isAuth === false) setUser(null);
            else setUser(res.data);
        }).catch(err=>{
            console.log(err);
        });
        setLoading(false);
    },[] );
    
    useEffect( ()=>{
        getData();
        return  ()=>{}
    },[]);

    const providerValue = useMemo( ()=>({user,setUser}), [user,setUser] );    
    
    return (
    <AuthContext.Provider value={providerValue}>
        { !loading && children}
    </AuthContext.Provider>
    );
}
