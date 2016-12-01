import React from 'react'

class NavBar extends React.Component {
  render() {
    return (
      <div className="navbar">
        <h1 className="navbar__title">Jude</h1>
        <div className="material-switch navbar__switch">
          <input id="navbarSwitch" type="checkbox" />
          <label htmlFor="navbarSwitch" />
        </div>
        <div className="navbar__mode-selector">
          <p className="title">Change Mode</p>
          <hr />

          <div className="form-group">
            <input type="text" />
          </div>

          <div className="form-group form-group__mode">
            <label className="radio-label" htmlFor="hostRadio">
              <input type="radio" name="toggle" value="host" id="hostRadio" />
              <span>Host</span>
            </label>
            <label className="radio-label" htmlFor="clientRadio">
              <input type="radio" name="toggle" value="client" id="clientRadio" />
              <span>Client</span>
            </label>
          </div>


          <div className="form-group">
            <div className="form-group__title">
              Type
            </div>
            <div className="form-group__body">

            </div>
          </div>
          <div className="form-group">
            <div className="form-group__title">
              Server Address
            </div>
            <div className="form-group__item">
              <input type="text" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

NavBar.propTypes = {}
NavBar.defaultProps = {}

export default NavBar
