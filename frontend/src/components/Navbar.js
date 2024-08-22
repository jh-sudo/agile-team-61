import React, { Component } from "react";
import "./NavbarStyles.css";
import { MenuItems } from "./MenuItems";
import { Link, useNavigate } from "react-router-dom";
import LoginRegister from "./LoginRegister";
import { AuthContext } from '../AuthContext';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      showPopup: false,
      sidebar: false,
    };
  }
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
        {({ isAuthenticated, logout }) => (
          <>
            <nav className="NavbarItems">
              <NavIcon to="#">
                <FaIcons.FaBars onClick={this.toggleSidebar} />
              </NavIcon>
              <a className="navbar-logo" href="/"><h1>Trippy</h1></a>

              <div className="menu-icons" onClick={this.handleClick}>
                <i className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}></i>
  handleLogout = async (logout) => {
    console.log("Log out button clicked");
    try {
      const response = await fetch('http://localhost:3001/api/logout', {
        method: 'POST',
        credentials: 'include', // Include credentials (cookies) in the request
      });
      if (response.ok) {
        console.log("Logout successful in navbar.js");
        logout(); // Call the logout function from AuthContext
        this.props.navigate("/"); // Navigate to the homepage after logout
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };
  
  render() {
    return (
      <AuthContext.Consumer>
        {({ isLoggedIn, logout }) => (
          <nav className="NavbarItems">
            <h1 className="navbar-logo">Trippy</h1>

            {isLoggedIn ? (
              <button className="auth-button" onClick={() => this.handleLogout(logout)}>
                Log Out
              </button>
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

              <ul className={this.state.clicked ? "nav-menu active" : "nav-menu"}>
                {/* {MenuItems.map((item, index) => {
                    return (
                      <li key={index}>
                        <Link className={item.cName} to={item.url}>
                          <i className={item.icon}></i>
                          {item.title}
                        </Link>
                      </li>
                    );
                  })} */}
                {!isAuthenticated ? (
                  <button onClick={this.togglePopup}>Sign In</button>
                ) : (
                  <button onClick={logout}>Log Out</button>
                )}
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
            <Sidebar sidebar={this.state.sidebar} toggleSidebar={this.toggleSidebar} />
          </>
        )
        }
      </AuthContext.Consumer>
    );
  }
}

function NavbarWithNavigate(props) {
  const navigate = useNavigate();
  return <Navbar {...props} navigate={navigate} />;
}

export default NavbarWithNavigate;
