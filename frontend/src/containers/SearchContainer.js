import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { search } from '../utils/youtube';
import { SearchResult, Playlist } from '../components';
import { addPlaylist, removePlaylist } from '../actions/playlistAction';

class SearchContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearchInputKeyPress = this.handleSearchInputKeyPress.bind(this);

    this.state = {
      query: null,
      searchResult: [],
    };
  }

  handleSearchInputKeyPress(e) {
    if (e.key === 'Enter') {
      const query = e.target.value;
      search(query)
        .then(data => {
          this.setState({
            query,
            searchResult: data.items,
          });
        });
    }
  }

  render() {
    const { query, searchResult } = this.state;
    const { dispatch, playlist } = this.props;

    return (
      <div className="search">
        <h2 className="search__title">Search</h2>
        <input
          className="search__input"
          type="text"
          onKeyPress={this.handleSearchInputKeyPress}
        />
        <SearchResult
          query={query}
          items={searchResult}
          handleOnClick={(id, title) => dispatch(addPlaylist(id, title))}
        />
      </div>
    );
  }
}

SearchContainer.propTypes = {};
SearchContainer.defaultProps = {};

export default withRouter(connect(
  state => state
)(SearchContainer));
