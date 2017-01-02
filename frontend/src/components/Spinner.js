import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

class Spinner extends Component {
  render() {
    const { active } = this.props
    const spinnerClass = classNames(['spinner', { 'spinner--active': active }])

    return (
      <div className={spinnerClass}>
        <div className="spinner__wrapper">
          <div className="spinner__element" />
        </div>
      </div>
    );
  }
}

Spinner.propTypes = {
  active: PropTypes.bool,
}
Spinner.defaultProps = {}

export default Spinner
