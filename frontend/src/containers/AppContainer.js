import React from 'react';
import { connect } from 'react-redux';
import { removeItemFromPlaylist, updateActiveItemInPlaylist } from '../reducers/playlistReducer';
import { updatePlayerVideo } from '../reducers/playerReducer';
import { Navbar, Playlist } from '../components';
import { SearchContainer, PlayerContainer } from './';

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handlePlaylistClearButtonClick = this.handlePlaylistClearButtonClick.bind(this);
    this.handlePlaylistItemClick = this.handlePlaylistItemClick.bind(this);
  }

  handlePlaylistClearButtonClick(uuid) {
    this.props.removeSong(uuid);
  }

  handlePlaylistItemClick(item) {
    this.props.updateActiveItemInPlaylist(item);
    // this.props.updatePlayerVideo
  }

  render() {
    const { router, dispatch, children, auth, playlist } = this.props;

    return (
      <div className="main">
        <Navbar />
        <PlayerContainer />
        <SearchContainer />
        <Playlist
          className={"playlist"}
          items={playlist.items}
          activeItem={playlist.activeItem}
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
  dispatch: React.PropTypes.func,
};
AppContainer.defaultProps = {};

export default connect(state => ({
  auth: state.auth,
  playlist: state.playlist,
}), {
  updateActiveItemInPlaylist,
  removeItemFromPlaylist,
})(AppContainer);
