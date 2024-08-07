import React, { Component, useContext } from "react";
import "./NavbarStyles.css";
import { MenuItems } from "./MenuItems";
import { Link } from "react-router-dom";
import LoginRegister from "./LoginRegister";
import AuthContext from "../AuthContext";

class Navbar extends Component {
  state = { clicked: false, showPopup: false };

  handleClick = () => {
    this.setState({ clicked: !this.state.clicked });
  };

  togglePopup = () => {
    this.setState({ showPopup: !this.state.showPopup });
  };

  render() {
    return (
      <AuthContext.Consumer>
        {({ isLoggedIn, logout }) => (
          <nav className="NavbarItems">
            <h1 className="navbar-logo">Trippy</h1>

            {isLoggedIn ? (
              <button className="auth-button" onClick={logout}>Log Out</button>
            ) : (
              <button className="auth-button" onClick={this.togglePopup}>Sign In</button>
            )}

            <div className="menu-icons" onClick={this.handleClick}>
              <i className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}></i>
            </div>

            <ul className={this.state.clicked ? "nav-menu active" : "nav-menu"}>
              {MenuItems.map((item, index) => (
                <li key={index}>
                  <Link className={item.cName} to={item.url}>
                    <i className={item.icon}></i>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>

            {this.state.showPopup && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <button className="close-btn" onClick={this.togglePopup}>×</button>
                  <LoginRegister closePopup={this.togglePopup} />
                </div>
              </div>
            )}
          </nav>
        )}
      </AuthContext.Consumer>
    );
  }
}

export default Navbar;
