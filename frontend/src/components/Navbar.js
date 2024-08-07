import { Component, useContext } from "react";
import "./NavbarStyles.css";
// import { MenuItems } from "./MenuItems";
import { Link } from "react-router-dom";
import LoginRegister from "./LoginRegister";
import AuthContext from "../AuthContext";
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

export default Navbar;
