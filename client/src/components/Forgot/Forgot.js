
import {Button} from 'react-bootstrap';
import './Login.css';
import axios from 'axios';
import {Redirect, Link, useParams} from 'react-router-dom'
import { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import config from '../../config';
const Forgot = ()=>{
    useEffect( ()=>{
        document.title = "Confirm new password";
    },[] );
    
    

    const {email, token} = useParams();

    const [password, setPassword] = useState('');
    const [pblur, setPblur] = useState(false);
    const [pfocus, setPfocus] = useState(false);
    
    
    const [password1, setPassword1] = useState('');
    const [pblur1, setPblur1] = useState(false);
    const [pfocus1, setPfocus1] = useState(false);

    const confirmPassword = (s) =>{
        if( s.length < 6 ) return false;
        let bo = false;
        for( let i=0; i<s.length;i++ ){
            if( '0' <= s[i] && s[i]<='9' ) bo = true;
        }
        if( !bo ) return false;
        bo = false;
        for( let i=0; i<s.length;i++ ){
            if( ('a' <= s[i] && s[i]<='z') || ('A' <= s[i] && s[i]<='Z') ) bo = true;
        }
        if(!bo) return false;
        return true;
    }    

    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const ENDPOINT = config +'/api/users/forgot_confirm';

    const handleSubmit = async ()=>{
        if( !confirmPassword(password)  || password!==password1 ) {
            setPblur(true);setPblur1(true);
            setPfocus(true);setPfocus1(true);
            return;
        }
        setLoading(true);
        try {
            await axios({
                method: "POST",
                url: ENDPOINT,
                data:{
                    email: email, 
                    token: token,
                    newPassword: password
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
        setPassword("");setPassword1("");
        setPblur(false); setPblur1(false); 
        setPfocus(false); setPfocus1(false);
    }

    return (
        <div id="login-page">
            <div id="login">
            <div id="card">
                    <h1> Confirm new Password  </h1>
                    {
                        success && <Alert variant="success" > 
                        Successfully confirm. You can <Alert.Link href="/login" > login </Alert.Link>  
                        </Alert>
                    }
                    {
                        error && <Alert variant="danger"  > {error} </Alert>
                    } 
                    <div className="input">
                        <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} 
                            value={password}
                        onBlur={()=>setPblur(!pblur)} 
                        onFocus={()=>setPfocus(true)}
                        />
                    
                    </div>
                    
                    {
                        pblur && pfocus && !confirmPassword(password) &&
                        <Alert variant="danger"  > 
                            Password must be 6 character or greater than and password must be have characters and numbers.
                        </Alert>
                    }
                    
                    <div className="input">
                        <input type="password" placeholder="Confirm Password" onChange={e=>setPassword1(e.target.value)} 
                            value={password1}
                        onBlur={()=>setPblur1(!pblur1)} 
                        onFocus={()=>setPfocus1(true)}
                        />
                    
                    </div>
                    
                    {
                        pblur1 && pfocus1 && password !==password1 && <Alert variant="danger">
                            Passwords cannot match!
                        </Alert> 
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

                        >   Reset password { loading && <> ... </> } </Button>
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
export default Forgot;