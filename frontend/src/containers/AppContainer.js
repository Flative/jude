import React from 'react';
import { connect } from 'react-redux';
import { removePlaylist, updateActiveItem } from '../reducers/playlistReducer';
import { Navbar, Playlist, Player } from '../components';
import { SearchContainer } from './';

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleTitleClick = this.handleTitleClick.bind(this);
    this.handlePlaylistClearButtonClick = this.handlePlaylistClearButtonClick.bind(this);
    this.handlePlaylistItemClick = this.handlePlaylistItemClick.bind(this);
  }

  componentDidMount() {
    // const sock = new WebSocket('ws://192.168.0.79:8080/api/v1/ws');
    // sock.onopen = function() {
    //   console.log('open');
    //   window.sock = sock;
    // };
    // sock.onmessage = function(e) {
    //   console.log('message', e.data);
    // };
    // sock.onclose = function() {
    //   console.log('close');
    // };
  }

  handleTitleClick() {
    this.props.router.push({ pathname: '/' });
  }

  handlePlaylistClearButtonClick(uuid) {
    this.props.dispatch(removePlaylist(uuid));
  }

  handlePlaylistItemClick(uuid) {
    this.props.dispatch(updateActiveItem(uuid));
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
          items={playlist.items}
          activeItemUUID={playlist.activeItemUUID}
          onItemClick={this.handlePlaylistItemClick}
          onClearButtonClick={this.handlePlaylistClearButtonClick}
        />
        {children}
      </div>
    );
  }
}

AppContainer.propTypes = {
  children: React.PropTypes.node,
  router: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};
AppContainer.defaultProps = {};

export default connect(
  (state) => ({
    auth: state.auth,
    playlist: state.playlist,
  })
)(AppContainer);
