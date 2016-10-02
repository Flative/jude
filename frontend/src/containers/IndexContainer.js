import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import qs from 'query-string';
import SockJS from 'sockjs-client';
import { Navbar, Playlist, Player } from '../components';
import { SearchContainer } from './';
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

  componentDidMount() {
    const sock = new WebSocket('ws://192.168.0.79:8080/api/v1/ws');
    sock.onopen = function() {
      console.log('open');
      window.sock = sock;
    };
    sock.onmessage = function(e) {
      console.log('message', e.data);
    };
    sock.onclose = function() {
      console.log('close');
    };
  }

  render() {
    const { router, dispatch, children, auth, playlist } = this.props;

    return (
      <div className="main">
        <Navbar />
        <Player />
        <SearchContainer />
        <Playlist
          className={"playlist"}
          data={playlist.data}
        />
        {/*{auth.isLoggedIn*/}
          {/*? (*/}
            {/*<div>*/}
              {/*<h2>I'm logged in</h2>*/}
            {/*</div>*/}
          {/*)*/}
          {/*: (*/}
            {/*<div>*/}
              {/*<h1>Need to login</h1>*/}
              {/*<button onClick={this.handleAuthButtonClick}>Auth</button>*/}
            {/*</div>*/}
          {/*)*/}
        {/*}*/}
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
    playlist: state.playlist,
  })
)(Main));
