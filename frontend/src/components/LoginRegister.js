import React, { useState, useContext } from 'react';
import "./LoginRegister.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../AuthContext';

function LoginRegister() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { isLoggedIn, login, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const register = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post("http://localhost:3001/api/signup", { username, email, password });
            if (res.status === 201) {
                navigate("/about");//change to landing page of planning trips
            }
        } catch (err) {
            console.error(err);
        }
    };

    const signIn = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post("http://localhost:3001/api/signin", { email, password });
            if (res.status === 200) {
                login(res.data.token);
                navigate("/about");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const signOut = () => {
        logout();
        navigate("/");
    };

    const switchContent = () => {
        const content = document.getElementById('content');
        const registerBtn = document.getElementById('register');
        const loginBtn = document.getElementById('login');

        registerBtn.addEventListener('click', () => {
            content.classList.add("active");
        });
        loginBtn.addEventListener('click', () => {
            content.classList.remove("active");
        });
    };

    return (
        <div className="content justify-content-center align-items-center d-flex shadow-lg" id="content">
            {isLoggedIn ? (
                <div className="logged-in">
                    <h1>Welcome back!</h1>
                    <button onClick={signOut} className="btn border-white text-white w-50 fs-6">Sign Out</button>
                </div>
            ) : (
                <>
                    <div className="left-box col-md-6 justify-content-center">
                        <form onSubmit={register}>
                            <div className="header-text mb-4">
                                <h1>Create Account</h1>
                            </div>
                            <div className="input-group mb-3">
                                <input type="text" placeholder="Name" className="form-control form-control-lg bg-light fs-6" onChange={e => setUsername(e.target.value)} />
                            </div>
                            <div className="input-group mb-3">
                                <input type="email" placeholder="Email" className="form-control form-control-lg bg-light fs-6" onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="input-group mb-3">
                                <input type="password" placeholder="Password" className="form-control form-control-lg bg-light fs-6" onChange={e => setPassword(e.target.value)} />
                            </div>
                            <div className="input-group mb-3 justify-content-center">
                                <button className="btn border-white text-white w-50 fs-6">Sign Up</button>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-6 right-box">
                        <form onSubmit={signIn}>
                            <div className="header-text mb-4">
                                <h1>Sign In</h1>
                            </div>
                            <div className="input-group mb-3">
                                <input type="email" placeholder="Email" className="form-control form-control-lg bg-light fs-6" onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="input-group mb-3">
                                <input type="password" placeholder="Password" className="form-control form-control-lg bg-light fs-6" onChange={e => setPassword(e.target.value)} />
                            </div>
                            <div className="input-group mb-5 d-flex justify-content-between">
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input" />
                                    <label htmlFor="forcheck" className="form-check-label text-secondary"><small>Remember me</small></label>
                                </div>
                                <div className="forgot">
                                    <small><a href="#">Forgot password?</a></small>
                                </div>
                            </div>
                            <div className="input-group mb-3 justify-content-center">
                                <button className="btn border-white text-white w-50 fs-6">Sign in</button>
                            </div>
                        </form>
                    </div>
                    <div className="switch-content">
                        <div className="switch">
                            <div className="switch-panel switch-left">
                                <h1>Hello, Again</h1>
                                <p>We are happy to see you back</p>
                                <button className="hidden btn text-white w-50 fs-6" id="login" onClick={switchContent}>Login</button>
                            </div>
                            <div className="switch-panel switch-right">
                                <h1>Welcome</h1>
                                <p>Join Our Unique Platform, Explore a New Experience</p>
                                <button className="hidden btn text-white w-50 fs-6" id="register" onClick={switchContent}>Register</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default LoginRegister;
