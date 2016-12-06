import React from 'react'
import { connect } from 'react-redux'
import { searchVideos } from '../utils/youtube'
import { SearchResult } from '../components'
import { addItemToPlaylist, removeItemFromPlaylist } from '../reducers/playlistReducer'
import { APP_MODES } from '../reducers/appReducer'
import SearchIcon from 'react-icons/lib/md/search'

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
    const { app } = this.props;

    if (app.mode === APP_MODES.STANDALONE) {
      dispatch(addItemToPlaylist(id, title))
      return
    }

    // TODO
  }

  // TODO: Need to display some interaction stuff while fetching
  search(query) {
    searchVideos(query)
      .then(data => {
        this.setState({
          query,
          searchResult: data,
        })
      })
  }

  render() {
    const { query, searchResult } = this.state
    const { dispatch, playlist, app } = this.props

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
          items={searchResult}
          handleItemClick={this.handleSearchResultItemClick}
        />
      </div>
    )
  }
}

Search.propTypes = {}
Search.defaultProps = {}

export default connect(
  state => state
)(Search)