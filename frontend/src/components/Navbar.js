import React from 'react'
import classNames from 'classnames'
import { Spinner } from './'
import { APP_MODES } from '../reducers/appReducer'

class NavBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSelectorOpened: false,
      modeSelectorAddressVal: '',
      modeSelectorTypeVal: null,
      isCheckboxChecked: false,
    }
    this.toggleModeSelector = this.toggleModeSelector.bind(this)
    this.handleModeSelectorApplyButton = this.handleModeSelectorApplyButton.bind(this)
    this.handleAddressInputChange = this.handleAddressInputChange.bind(this)
    this.handleModeTypeChange = this.handleModeTypeChange.bind(this)
    this.handleSwitchClick = this.handleSwitchClick.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isSelectorOpened && this.state.isSelectorOpened) {
      this.refs.serverAddressInput.focus()
    }
    if (prevProps.isModeChanging && !this.props.isModeChanging) {
      this.setState({ isSelectorOpened: false })
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isCheckboxChecked: nextProps.mode !== APP_MODES.STANDALONE })
  }

  // TODO: Animation on mode selector
  toggleModeSelector(v) {
    this.switch.checked = v !== undefined ? v : !this.switch.checked
    this.setState({ isSelectorOpened: this.switch.checked })
  }

  handleSwitchClick(e) {
    e.preventDefault()

    if (this.props.mode !== APP_MODES.STANDALONE) {
      this.props.disconnectConnection(() => {
        setTimeout(() => {
          this.toggleModeSelector(!this.switch.checked)
        }, 100)
      })
      return false
    }

    setTimeout(() => {
      this.toggleModeSelector(!this.switch.checked)
    }, 100)
  }

  // TODO: Should be implemented
  handleModeSelectorApplyButton() {
    const { isModeChanging } = this.props
    const { modeSelectorAddressVal, modeSelectorTypeVal } = this.state

    if (isModeChanging || !modeSelectorAddressVal.length || !modeSelectorTypeVal.length) {
      alert('nop')
    }

    this.props.establishConnection(modeSelectorTypeVal, modeSelectorAddressVal)
  }

  handleAddressInputChange(e) {
    this.setState({ modeSelectorAddressVal: e.target.value })
  }

  handleModeTypeChange(e) {
    this.setState({ modeSelectorTypeVal: e.target.value })
  }

  render() {
    const { isSelectorOpened, isCheckboxChecked } = this.state
    const { isModeChanging, mode } = this.props

    const modeSelectorClass = classNames({
      'mode-selector': true,
      'mode-selector--active': isSelectorOpened,
    })
    const appCoverClass = classNames(['app-cover', { 'app-cover--active': isSelectorOpened }])
    const applyButtonClass = classNames({
      'mode-selector__button': true,
      'mode-selector__button-gray': isModeChanging,
    })

    return (
      <div className="navbar">
        <h1 className="navbar__title">Jude</h1>
        <div className="material-switch navbar__switch">
          <input
            id="navbarSwitch"
            ref={(input) => { this.switch = input }}
            type="checkbox"
            onChange={e => e.preventDefault()}
            onClick={this.handleSwitchClick}
          />
          <label htmlFor="navbarSwitch" />
        </div>
        <div className={appCoverClass} onClick={() => this.toggleModeSelector(false)} />
        <div
          className={modeSelectorClass}
          onKeyDown={(e) => {
            if (e.keyCode === 27) {
              this.toggleModeSelector(false)
            }
          }}
        >
          <p className="mode-selector__title">Change Mode</p>

          <div className="mode-selector__spinner">
            <Spinner active={isModeChanging} />
          </div>

          <div className="mode-selector__fg">
            <div className="mode-selector__fg-title">
              Server Address
            </div>
            <div className="mode-selector__fg-body">
              <input
                className="mode-selector__fg-input-text"
                type="text"
                ref="serverAddressInput"
                onChange={this.handleAddressInputChange}
                placeholder="127.0.0.1:5050"
              />
            </div>
          </div>

          <div className="mode-selector__fg">
            <div className="mode-selector__fg-title">
              Type
            </div>
            <div className="mode-selector__fg-body" onChange={this.handleModeTypeChange}>
              <label className="mode-selector__fg-input-radio-wrapper" htmlFor="hostRadio">
                <input className="mode-selector__fg-input-radio" type="radio" value={APP_MODES.HOST_CLIENT} id="hostRadio" name="radio" />
                <span className="mode-selector__fg-input-radio-label">Host</span>
              </label>
              <label className="mode-selector__fg-input-radio-wrapper" htmlFor="clientRadio">
                <input className="mode-selector__fg-input-radio" type="radio" value={APP_MODES.CLIENT} id="clientRadio" name="radio" />
                <span className="mode-selector__fg-input-radio-label">Client</span>
              </label>
              <div className="clearfix"></div>
            </div>
          </div>

          <div className="mode-selector__buttons">
            <button
              className="mode-selector__button mode-selector__button--gray"
              onClick={() => this.toggleModeSelector(false)}
            >
              Cancel
            </button>
            <button
              className={applyButtonClass}
              onClick={this.handleModeSelectorApplyButton}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    )
  }
}

NavBar.propTypes = {}
NavBar.defaultProps = {}

export default NavBar
