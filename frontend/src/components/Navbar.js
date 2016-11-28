import React from 'react';

class NavBar extends React.Component {
  render() {
    return (
      <div className="navbar">
        <h1 className="navbar__title">Jude</h1>
        <div className="material-switch navbar__switch">
          <input id="navbarSwitch" type="checkbox" />
          <label htmlFor="navbarSwitch" />
        </div>
      </div>
    );
  }
}

NavBar.propTypes = {};
NavBar.defaultProps = {};

export default NavBar;
