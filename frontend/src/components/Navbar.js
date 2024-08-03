import { Component } from "react";
import "./NavbarStyles.css";
import { MenuItems } from "./MenuItems";
import { Link } from "react-router-dom";
import LoginRegister from "./LoginRegister";

class Navbar extends Component {
  state = { clicked: false, showPopup: false, isAuthenticated: false };

  handleClick = () => {
    this.setState({ clicked: !this.state.clicked });
  };

  togglePopup = () => {
    this.setState({ showPopup: !this.state.showPopup });
  };

  handleLogout = () => {
    // Implement logout logic here
    this.setState({ isAuthenticated: false });
  };

  render() {
    return (
      <nav className="NavbarItems">
        <h1 className="navbar-logo">Trippy</h1>

        <div className="menu-icons" onClick={this.handleClick}>
          <i className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}></i>
        </div>

        <ul className={this.state.clicked ? "nav-menu active" : "nav-menu"}>
          {MenuItems.map((item, index) => {
            return (
              <li key={index}>
                <Link className={item.cName} to={item.url}>
                  <i className={item.icon}></i>
                  {item.title}
                </Link>
              </li>
            );
          })}
          {!this.state.isAuthenticated ? (
            <button onClick={this.togglePopup}>Sign In</button>
          ) : (
            <button onClick={this.handleLogout}>Log Out</button>
          )}
        </ul>
        {this.state.showPopup && <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={this.togglePopup}>×</button>
            <LoginRegister closePopup={this.togglePopup} />
          </div>
        </div>}
      </nav>
    );
  }
}

export default Navbar;
