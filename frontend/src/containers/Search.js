import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import UUID from 'node-uuid'
import SearchIcon from 'react-icons/lib/md/search'
import { searchVideos } from '../utils/youtube'
import { SearchResult } from '../components'
import { addSong } from '../reducers/playlistReducer'
import { APP_MODES } from '../reducers/appReducer'

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.handleSearchInputKeyPress = this.handleSearchInputKeyPress.bind(this)
    this.handleSearchIconClick = this.handleSearchIconClick.bind(this)
    this.handleSearchResultItemClick = this.handleSearchResultItemClick.bind(this)

    this.state = {
      query: null,
      searchResult: [],
    }
  }

  componentDidMount() {
    // For development
    // this.search('3초를')
  }

  handleSearchInputKeyPress(e) {
    if (e.key === 'Enter') {
      this.search(e.target.value)
    }
  }

  handleSearchIconClick() {
    this.search(this.refs.searchInput.value)
  }

  handleSearchResultItemClick(id, title) {
    const { app, playlist, player, dispatch } = this.props
    const { activeSong, songs } = playlist

    // TODO
    if (!player.youtubePlayer) {
      return
    }

    const uuid = UUID.v4()
    const index = activeSong ? songs[songs.length - 1].index + 1 : 0

    if (app.mode === APP_MODES.STANDALONE) {
      dispatch(addSong(id, title, uuid, index))
      return
    }

    app.wsConnection.send(JSON.stringify({
      action: 'add',
      body: { id, title, uuid, index },
    }))
    // TODO
  }

  // TODO: Need to display some interaction stuff while fetching
  search(query) {
    searchVideos(query)
      .then((searchResult) => {
        this.setState({ query, searchResult })
      })
  }

  render() {
    const { query, searchResult } = this.state

    return (
      <div className="search">
        <div className="search__header">
          <h2 className="search__title">Search</h2>
          <div className="search__input__container">
            <SearchIcon
              className="search__input__icon"
              onClick={this.handleSearchIconClick}
            />
            <input
              className="search__input"
              ref="searchInput"
              placeholder="Well, what do you want to listen?"
              type="text"
              onKeyPress={this.handleSearchInputKeyPress}
            />
          </div>
        </div>
        <SearchResult
          query={query}
          songs={searchResult}
          handleItemClick={this.handleSearchResultItemClick}
        />
      </div>
    )
  }
}

Search.propTypes = {
  dispatch: PropTypes.func,
  playlist: PropTypes.object,
  player: PropTypes.object,
  app: PropTypes.object,
}
Search.defaultProps = {}

export default connect(
  state => state,
)(Search)
