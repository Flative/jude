import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import qs from 'query-string';
import { CLIENT_ID } from '../appInfo';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.handleTitleClick = this.handleTitleClick.bind(this);
    this.handleAuthButtonClick = this.handleAuthButtonClick.bind(this);
  }

  handleAuthButtonClick() {
    const queryString = qs.stringify({
      client_id: CLIENT_ID,
      response_type: 'token',
      redirect_uri: 'http://localhost:1111/auth', // TODO
      scope: 'https://www.googleapis.com/auth/youtube',
    });

    location.replace(`https://accounts.google.com/o/oauth2/auth?${queryString}`);
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
              <button onClick={this.handleAuthButtonClick}>Auth</button>
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
