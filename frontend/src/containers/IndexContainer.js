import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.handleTitleClick = this.handleTitleClick.bind(this);
  }

  handleTitleClick() {
    this.props.router.push({ pathname: '/' });
  }

  render() {
    const { router, dispatch, children, information } = this.props;
    const childProps = { router, dispatch, information };

    return (
      <div className="page-main">
        <div className="wrapper">
          <h1 className="title" onClick={this.handleTitleClick}>
            Jude
          </h1>
          {children}
        </div>
      </div>
    );
  }
}

Main.propTypes = {
  children: React.PropTypes.node,
  router: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  information: React.PropTypes.shape({
    email: React.PropTypes.string,
    password: React.PropTypes.string,
  }),
};
Main.defaultProps = {};

export default withRouter(connect(
  (state) => {
    return {
      information: state.main.information,
    };
  }
)(Main));
