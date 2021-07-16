
import axios from 'axios';
import config from "../config";
import { useEffect } from "react";
import {Auth} from '../context'
 
const Main = ()=>{
    
    const {user} = Auth()
    
    const ENDPOINT = config + '/api/users/logout';

    useEffect(()=>{
        document.title = "Direct";
    },[]);
    const Logout = async ()=>{
        try {
            await axios({
                method: "GET",
                withCredentials: true,
                url: ENDPOINT
            });
            window.location.reload();
            // setUser(null);
        } catch (error) {
            
        }
    }

    return (
        <div>
            <pre> {JSON.stringify(user,null,2)} </pre>
            <button onClick = {Logout}> Logout </button>
        </div>
    );
}


export default Main;