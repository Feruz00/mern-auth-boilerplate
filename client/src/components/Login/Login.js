
import {  GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import {Button} from 'react-bootstrap';
import './Login.css';
import axios from 'axios';
import {Link } from 'react-router-dom'
import { useState,useEffect } from 'react';
import { Alert } from 'react-bootstrap';
// <Skeleton animation="wave" />
import config from '../../config';
import { Github, Google } from '../Oauth/Oauth';


const Login = ()=>{
    
    

    const [email, setEmail] = useState('');
    const [eblur, setEblur] = useState(false);
    const [efocus, setEfocus] = useState(false);
    
    const [password, setPassword] = useState('');
    const [pblur, setPblur] = useState(false);
    const [pfocus, setPfocus] = useState(false);
    
    useEffect( ()=>{
        document.title = "Login";
        if( localStorage.getItem('remember_me') ){
            const { em, pass } = JSON.parse(localStorage.getItem("remember_me"));
            setEmail(em);
           setPassword(pass); 
        }
    },[] );

    const [checked, setChecked] = useState(false);


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

    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const ENDPOINT = config + '/api/users/login';

    const handleSubmit = async ()=>{
        let bo = true;
        
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
        if(!bo) return;
        
        setLoading(true);
        
        await axios({
            method: "POST",
            url: ENDPOINT,
            data:{
                email: email, 
                password: password
            },
            withCredentials: true
        }).then( res=>{
            // setUser(res.data);

            if(checked){
                if( localStorage.getItem('remember_me') ) localStorage.removeItem('remember_me');
                localStorage.setItem('remember_me', JSON.stringify({ em: email, pass: password }, null, 2));
            }

            window.location.reload();
            setLoading(false);
        }).catch(err=>{
            setLoading(false);
            if( err.response ) setError(err.response.data.message);
            else setError("Please try again! We have server error");
        
        });
        
        setPassword("");setEmail("");
        setEblur(false); setPblur(false);
        setEfocus(false); setPfocus(false);
    }

    return (
        <div id="login-page">
            <div id="login">
            <div id="card">
                    <h1> Sign In  </h1>
                    
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
                    
                    <div className="buttons" >
                        <div>
                        <input type="checkbox" checked={checked} onChange={()=>setChecked(!checked)} /> Remember me
                        </div>
                        <Button
                            variant="primary"
                            disabled={loading}
                            onClick={ handleSubmit }
                        >  Login { loading && <> ... </> } </Button>
                    </div>
                    <div className="buttons">
                        <div>
                        <Link to="/register">
                            Sign Up
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
export default Login;