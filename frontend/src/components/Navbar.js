import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { APP_MODES } from '../reducers/appReducer'

class NavBar extends React.Component {
  static MODE_MAPPER = {
    [APP_MODES.STANDALONE]: 'Standalone',
    [APP_MODES.CLIENT]: 'Remote Control',
    [APP_MODES.HOST_CLIENT]: 'Speaker',
  }

  constructor(props) {
    super(props)
    this.state = {
      isSelectorOpened: false,
      modeSelectorTypeVal: null,
      isCheckboxChecked: false,
    }
    this.toggleModeSelector = this.toggleModeSelector.bind(this)
    this.handleModeSelectorApplyButton = this.handleModeSelectorApplyButton.bind(this)
    this.handleModeTypeChange = this.handleModeTypeChange.bind(this)
    this.handleModeButtonClick = this.handleModeButtonClick.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isCheckboxChecked: nextProps.mode !== APP_MODES.STANDALONE })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isModeChanging && !this.props.isModeChanging) {
      this.setState({ isSelectorOpened: false })
    }
  }

  // TODO: Animation on mode selector
  toggleModeSelector(v) {
    this.setState({ isSelectorOpened: v || !this.state.isSelectorOpened })
  }

  handleModeButtonClick(e) {
    this.toggleModeSelector();
  }

  // TODO: Should be implemented
  handleModeSelectorApplyButton() {
    const { isModeChanging } = this.props
    const { modeSelectorTypeVal } = this.state

    if (isModeChanging || !modeSelectorTypeVal.length) {
      alert('nop')
    }

    this.props.establishConnection(modeSelectorTypeVal, `${location.hostname}:8000`)
  }

  handleModeTypeChange(e) {
    this.setState({ modeSelectorTypeVal: e.target.value })
  }

  render() {
    const { isSelectorOpened, isCheckboxChecked } = this.state
    const { isModeChanging, mode } = this.props

    const renderButton = (modeType) => {
      return (
        <button
          key={modeType}
          className={classNames({
            'navbar__mode-btn': true,
            'navbar__mode-btn--active': mode === modeType,
          })}
          onClick={this.props.changeAppMode(modeType)}
        >
          {NavBar.MODE_MAPPER[modeType]}
        </button>
      )
    }

    return (
      <div className="navbar">
        <h1 className="navbar__title">Jude</h1>
        {/*<div className="navbar__btn-group">*/}
          {/*{renderButton(APP_MODES.STANDALONE)}*/}
          {/*{renderButton(APP_MODES.CLIENT)}*/}
          {/*{renderButton(APP_MODES.HOST_CLIENT)}*/}
        {/*</div>*/}
      </div>
    )
  }
}

NavBar.propTypes = {}
NavBar.defaultProps = {
  disconnectConnection: PropTypes.func,
}

export default NavBar
