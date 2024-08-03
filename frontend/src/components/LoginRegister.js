import React from "react";
import "./LoginRegister.css";

function LoginRegister() {
    function SwitchContent() {
        const content = document.getElementById('content');
        const registerBtn = document.getElementById('register');
        const loginbtn = document.getElementById('login');

        registerBtn.addEventListener('click', () => {
            content.classList.add("active");
        });
        loginbtn.addEventListener('click', () => {
            content.classList.remove("active");
        });
    }

    return (
        <div className="content justify-content-center align-items-center d-flex shadow-lg" id="content">
            {/* Sign up */}
            <div className="left-box col-md-6 justify-content-center">
                <form>
                    <div className="header-text mb-4">
                        <h1>Create Account</h1>
                    </div>
                    <div className="input-group mb-3">
                        <input type="text" placeholder="Name" className="form-control form-control-lg bg-light fs-6" />
                    </div>
                    <div className="input-group mb-3">
                        <input type="email" placeholder="Email" className="form-control form-control-lg bg-light fs-6" />
                    </div>
                    <div className="input-group mb-3">
                        <input type="password" placeholder="Password" className="form-control form-control-lg bg-light fs-6" />
                    </div>
                    <div className="input-group mb-3 justify-content-center">
                        <button className="btn border-white text-white w-50 fs-6">Sign Up</button>
                    </div>
                </form>
            </div>
            {/* Sign in */}
            <div className="col-md-6 right-box">
                <form>
                    <div className="header-text mb-4">
                        <h1>Sign In</h1>
                    </div>
                    <div className="input-group mb-3">
                        <input type="email" placeholder="Email" className="form-control form-control-lg bg-light fs-6" />
                    </div>
                    <div className="input-group mb-3">
                        <input type="password" placeholder="Password" className="form-control form-control-lg bg-light fs-6" />
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
            {/* Switch panel */}
            <div className="switch-content">
                <div className="switch">
                    <div className="switch-panel switch-left">
                        <h1>Hello, Again</h1>
                        <p>We are happy to see you back</p>
                        <button className="hidden btn text-white w-50 fs-6" id="login" onClick={SwitchContent}>Login</button>
                    </div>
                    <div className="switch-panel switch-right">
                        <h1>Welcome</h1>
                        <p>Join Our Unique Platform, Explore a New Experience</p>
                        <button className="hidden btn text-white w-50 fs-6" id="register" onClick={SwitchContent}>Register</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginRegister;
