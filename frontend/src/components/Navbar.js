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
          {/*<hr />*/}

          <div className="form-group form-group--text">
            <div className="form-group__title">
              Server Address
            </div>
            <div className="form-group__body">
              <input type="text" tabIndex="1" />
            </div>
          </div>

          <div className="form-group form-group--type">
            <div className="form-group__title">
              Type
            </div>
            <div className="form-group__body">
              <label className="radio-label" htmlFor="hostRadio">
                <input type="radio" name="toggle" value="host" id="hostRadio" tabIndex="2" />
                <span>Host</span>
              </label>
              <label className="radio-label" htmlFor="clientRadio">
                <input type="radio" name="toggle" value="client" id="clientRadio" tabIndex="3" />
                <span>Client</span>
              </label>
              <div className="clearfix"></div>
            </div>
          </div>

          <div className="buttons">
            <button className="button" tabIndex="5">Cancel</button>
            <button className="button button--apply" tabIndex="4">Apply</button>
          </div>
        </div>
      </div>
    )
  }
}

NavBar.propTypes = {}
NavBar.defaultProps = {}

export default NavBar
