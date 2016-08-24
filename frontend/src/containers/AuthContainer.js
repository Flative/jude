import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import qs from 'query-string';
import axios from 'axios';
import { updateToken } from '../actions/authAction';

class AuthContainer extends React.Component {
  componentDidMount() {
    const { dispatch, router } = this.props;
    const accessToken = qs.parse(window.location.hash).access_token;

    axios.get('https://www.googleapis.com/oauth2/v1/tokeninfo', {
      params: {
        access_token: accessToken,
      },
    }).then(res => {
      if (res.status === 200) {
        dispatch(updateToken({
          ...res.data,
          accessToken,
        }));
        router.push({ pathname: '/' });
      } else {
        // TODO: Need to do something
      }
    });
  }

  render() {
    return (
      <div>
        <h1>Logging in...</h1>
      </div>
    );
  }
}

AuthContainer.propTypes = {
  router: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};
AuthContainer.defaultProps = {};

export default withRouter(connect(
  (state) => state.auth
)(AuthContainer));
