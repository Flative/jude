import React, { Component, PropTypes } from 'react';
import ProgressBarPlus from 'react-progress-bar-plus';

class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = { percentage: 0 };
    this.onPercentageChange = this.onPercentageChange.bind(this);
  }

  componentDidMount() {
    this.props.registerProgressBar(this.onPercentageChange);
  }

  onPercentageChange(v) {
    this.setState({ percentage: v });
  }

  render() {
    return (
      <ProgressBarPlus
        className="player__progressbar"
        percent={this.state.percentage}
        spinner={false}
        onTop={false}
      />
    );
  }
}

ProgressBar.propTypes = {};
ProgressBar.defaultProps = {};

export default ProgressBar;
