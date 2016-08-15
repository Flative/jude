import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import OAuthContainer from './OAuthContainer';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.handleTitleClick = this.handleTitleClick.bind(this);
  }

  handleTitleClick() {
    this.props.router.push({ pathname: '/' });
  }

  render() {
    const { router, dispatch, children, auth } = this.props;

    return (
      <div className="page-main">
        <h1 onClick={this.handleTitleClick}>
          Jude
        </h1>
        {auth.isLoggedIn
          ? <h2>I'm logged in</h2>
          : (
            <div>
              <h1>Need to login</h1>
              <OAuthContainer />
            </div>
          )
        }
        {children}
      </div>
    );
  }
}

Main.propTypes = {
  children: React.PropTypes.node,
  router: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};
Main.defaultProps = {};

export default withRouter(connect(
  (state) => ({
    auth: state.auth,
  })
)(Main));
