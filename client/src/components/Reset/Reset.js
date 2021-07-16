
import {Button} from 'react-bootstrap';
import './Login.css';
import axios from 'axios';
import {Link} from 'react-router-dom'
import { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import config from '../../config';

const Reset = ()=>{
    
    useEffect( ()=>{
        document.title = "Forgot password?";
    },[] );
    
    const [email, setEmail] = useState('');
    const [eblur, setEblur] = useState(false);
    const [efocus, setEfocus] = useState(false);
    
    const confirmEmail = (mail) =>{
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) return true;
        return false;
    }
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const ENDPOINT = config +'/api/users/forgot_send';

    const handleSubmit = async ()=>{
        if( !confirmEmail(email)  ) {
            setEblur(true); 
            setEfocus(true); 
            return;
        }
        setLoading(true);
        try {
            await axios({
                method: "POST",
                url: ENDPOINT,
                data:{
                    email: email, 
                },
                withCredentials: true
            });
            setLoading(false);
            setSuccess(true);    
        } catch (error) {
            setLoading(false);
            if( error.response ) setError(error.response.data.message);
            else setError("Please try again! We have server error");
            
        }
        setEmail("");
        setEblur(false); 
        setEfocus(false);
    }

    return (
        <div id="login-page">
            <div id="login">
            <div id="card">
                    <h1> Reset password  </h1>
                    {
                        success && <Alert variant="success" > 
                        We send link for reset password your email.
                        </Alert>
                    }
                    {
                        error && <Alert variant="danger"  > {error} </Alert>
                    }
                    
                    <div className="input">
                        <input type="text" placeholder="Email" onChange={e=>setEmail(e.target.value)} 
                        value={email}   
                        onBlur={()=>setEblur(!eblur)} 
                        onFocus={()=>setEfocus(true)}
                        />
                    </div>
                    
                    {
                        eblur && efocus && !confirmEmail(email) &&
                        <Alert variant="danger"  > You have entered invalid email address!  </Alert>
                    }
                    
                    
                    <div className="buttons" >
                        <Button
                            variant="primary"
                            disabled={loading}
                            onClick={ handleSubmit }
                            style = {{
                                width: '50%',
                                marginLeft: 'auto'
                            }}

                        >   Reset { loading && <> ... </> } </Button>
                    </div>
                    <div className="buttons">
                        <div>
                        <Link to="/login">
                            Sign In
                        </Link>
                        </div>
                        <div>
                        <Link to="/register">
                            Sign Up
                        </Link>
                        </div>
                    </div>
                    
                </div>
                
            </div>
        </div>
    );
}
export default Reset;