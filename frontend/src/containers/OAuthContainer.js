import React from 'react';
import qs from 'query-string';

class OAuthContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleAuthButtonClick = this.handleAuthButtonClick.bind(this);
  }

  handleAuthButtonClick() {
    const queryString = qs.stringify({
      client_id: '309722368639-bqsk908kjug35eb2699edib1cl64sqp8.apps.googleusercontent.com',
      response_type: 'token',
      redirect_uri: 'http://localhost:1111/auth',
      scope: 'https://www.googleapis.com/auth/youtube',
    });

    location.replace(`https://accounts.google.com/o/oauth2/auth?${queryString}`);
  }

  render() {
    return (
      <div>
        <button onClick={this.handleAuthButtonClick}>Auth</button>
      </div>
    );
  }
}

OAuthContainer.propTypes = {};
OAuthContainer.defaultProps = {};

export default OAuthContainer;
