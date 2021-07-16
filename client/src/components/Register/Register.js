
import {  GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import {Button} from 'react-bootstrap';
import './Login.css';
import axios from 'axios';
import {Link} from 'react-router-dom'
import { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import config from '../../config';
import { Github, Google } from '../Oauth/Oauth';
// import {Auth} from '../../context';

// <Skeleton animation="wave" />

const Register = ()=>{
    useEffect( ()=>{
        document.title = "Register";
    },[] );

  
    const [username, setUsername] = useState('');
    const [ublur, setUblur] = useState(false);
    const [ufocus, setUfocus] = useState(false);
    

    const [email, setEmail] = useState('');
    const [eblur, setEblur] = useState(false);
    const [efocus, setEfocus] = useState(false);
    
    const [password, setPassword] = useState('');
    const [pblur, setPblur] = useState(false);
    const [pfocus, setPfocus] = useState(false);
    
    
    const [password1, setPassword1] = useState('');
    const [pblur1, setPblur1] = useState(false);
    const [pfocus1, setPfocus1] = useState(false);


    const confirmEmail = (mail) =>{
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) return true;
        return false;
    }

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

    const confirmUsername = (s)=>{
        return s.length >= 6;
    }
    

    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const ENDPOINT = config +'/api/users/register';

    const handleSubmit = async ()=>{
        let bo = true;
        if(!confirmUsername(username)){
            bo = false;
            setUblur(true); 
            setUfocus(true);
        }

        if(!confirmEmail(email)){
            bo = false;
            setEfocus(true);
            setEblur(true);
        }
        if(!confirmPassword(password)){
            bo = false;
            setPblur(true);
            setPfocus(true);
        }
        if( password!==password1  ) {
            bo = false;
            setPfocus1(true);
            
            setPblur1(true);
        }
        if(!bo) return;
        
        setLoading(true);
        try {
            await axios({
                method: "POST",
                url: ENDPOINT,
                data:{
                    username: username,
                    email: email, 
                    password: password
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
        setUsername(""); setPassword("");setEmail(""); setPassword1("");
        setUblur(false); setEblur(false); setPblur(false); setPblur1(false); 
        setUfocus(false); setEfocus(false); setPfocus(false); setPfocus1(false);
        
    }

    return (
        <div id="login-page">
            <div id="login">
            <div id="card">
                    <h1> Sign Up  </h1>
                    {
                        success && <Alert variant="success" > 
                        We send activation link to your email. Confirm your email last 3 hours. 
                        </Alert>
                    }
                    {
                        error && <Alert variant="danger"  > {error} </Alert>
                    }
                    <div className="input">
                        <input type="text" placeholder="Username" onChange={e=>setUsername(e.target.value)} 
                        value={username}
                        onBlur={()=>setUblur(!eblur)} 
                        onFocus={()=>setUfocus(true)}
                        />
                    </div>
                    
                    {
                        ublur && ufocus && !confirmUsername(username) &&
                        <Alert variant="danger"  > Username must be 6 character or greater than  </Alert>
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

                        >   Register { loading && <> ... </> } </Button>
                    </div>
                    <div className="buttons">
                        <div>
                        <Link to="/login">
                            Sign In
                        </Link>
                        </div>
                        <div>
                        <Link to="/reset">
                            Forgot password?
                        </Link>
                        </div>
                    </div>
                    
                </div>
                <div id="or">
                    <p>or</p>
                </div>
                <div id="social">
                    <a className="button google" href = {Google}  > 
                       <GoogleOutlined /> {' '}Login with Google 
                    </a>
                    <a className="button github" href={Github} > 
                       <GithubOutlined /> {' '} Login with Github 
                    </a>
                    
                </div>
                
            </div>
        </div>
    );
}
export default Register;