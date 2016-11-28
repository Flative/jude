import React, { Component, PropTypes } from 'react'
import ProgressBarPlus from 'react-progress-bar-plus'

class ProgressBar extends Component {
  constructor(props) {
    super(props)
    this.state = { percentage: 0 }
    this.updatePercentage = this.updatePercentage.bind(this)
  }

  componentDidMount() {
    this.props.onProgressBarReady(this.updatePercentage)
  }

  updatePercentage(v) {
    this.setState({ percentage: v })
  }

  render() {
    return (
      <ProgressBarPlus
        className="player__progressbar"
        percent={this.state.percentage}
        spinner={false}
        onTop={false}
      />
    )
  }
}

ProgressBar.propTypes = {}
ProgressBar.defaultProps = {}

export default ProgressBar
