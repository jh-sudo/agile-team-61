import React, { Component } from "react";
import "./NavbarStyles.css";
import { Link, useNavigate } from "react-router-dom";
import LoginRegister from "./LoginRegister";
import { AuthContext } from '../AuthContext';
import * as FaIcons from "react-icons/fa";
import styled from "styled-components";
import Sidebar from "../components/Sidebar";

const Nav = styled.div`
    background: #ffffff;
    height: 80px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: fixed;
    z-index: 9999;
`;

const NavIcon = styled(Link)`
    color: #7392a6;
    margin-right: 2rem;
    font-size: 2rem;
    height: 80px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

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
  
    toggleSidebar = () => {
    this.setState({ sidebar: !this.state.sidebar });
  };

  handleLogout = async (logout) => {
    console.log("Log out button clicked");
    try {
      const response = await fetch('http://localhost:3001/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        console.log("Logout successful in navbar.js");
        logout();
        this.props.navigate("/");
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
            <>
          <nav className="NavbarItems">
            <NavIcon to="#">
                <FaIcons.FaBars onClick={this.toggleSidebar} />
              </NavIcon>
              <a className="navbar-logo" href="/"><h1>Trippy</h1></a>
  
            {isLoggedIn ? (
              <button className="auth-button" onClick={() => this.handleLogout(logout)}>
                Log Out
              </button>
            ) : (
              <button className="auth-button" onClick={this.togglePopup}>Sign In</button>
            )}
              {this.state.showPopup && (
                <div className="modal-overlay">
                    <button className="close-btn" onClick={this.togglePopup}>×</button>
                    <LoginRegister closePopup={this.togglePopup} />
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
