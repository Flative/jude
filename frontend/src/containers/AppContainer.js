import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { removeItemFromPlaylist, updateActiveItemInPlaylist } from '../reducers/playlistReducer'
import { Navbar, Playlist, ModeSelector } from '../components'
import { SearchContainer, PlayerContainer } from './'
import { APP_MODES } from '../reducers/appReducer'

class AppContainer extends React.Component {
  constructor(props) {
    super(props)
    this.handlePlaylistRemoveButtonClick = this.handlePlaylistRemoveButtonClick.bind(this)
    this.handlePlaylistItemClick = this.handlePlaylistItemClick.bind(this)
  }

  handlePlaylistRemoveButtonClick(item) {
    const { dispatch, app } = this.props
    dispatch(removeItemFromPlaylist(item))
  }

  handlePlaylistItemClick(item) {
    const { dispatch, app } = this.props

    if (app.mode === APP_MODES.STANDALONE) {
      dispatch(updateActiveItemInPlaylist(item))
      return
    }


  }

  render() {
    const { dispatch, auth, playlist } = this.props

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
          onRemoveButtonClick={this.handlePlaylistRemoveButtonClick}
        />
      </div>
    )
  }
}

AppContainer.propTypes = {
  children: PropTypes.node,
  dispatch: PropTypes.func,
  auth: PropTypes.object,
  playlist: PropTypes.object,
  app: PropTypes.object,
  removeItemFromPlaylist: PropTypes.func,
  updateActiveItemInPlaylist: PropTypes.func,
}
AppContainer.defaultProps = {}

export default connect(state => ({
  auth: state.auth,
  playlist: state.playlist,
  app: state.app,
}))(AppContainer)
