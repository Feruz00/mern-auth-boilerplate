
import axios from 'axios';
import { useEffect, useState } from 'react';
import {useParams , useHistory } from 'react-router-dom';
import config from '../../config';

const Confirm = ()=>{
    
    const {id, token} = useParams();

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const history = useHistory()
    
    useEffect(()=>{
        const ENDPOINT = config+'/api/users/verify';

        try {
            axios({
                method: "PATCH",
                url: ENDPOINT,
                params:{
                    id: id,
                    token: token
                },
                withCredentials: true
            });
            setLoading(false);
            setSuccess(true);    
        } catch (error) {
            setSuccess(false);
        }
            
    },[id,token]);

    if( !loading && success ){
        setTimeout( ()=>{
            history.push('/login');
        }, 700 );
    }
    
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            { loading && <h2> Loading... </h2> }
            { !loading && !success && <h2> Something was error. Please try again </h2> }
            {  !loading && success && 
                <h3 style={{
                    fontSize:'1rem'
                }}> Successfully confirmed your  </h3>
            }
        </div>
    )
}
export default Confirm;