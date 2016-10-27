import React from 'react';
import { connect } from 'react-redux';
import { search } from '../utils/youtube';
import { SearchResult } from '../components';
import { addPlaylist, removePlaylist } from '../reducers/playlistReducer';
import SearchIcon from 'react-icons/lib/md/search';

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
            searchResult: data,
          });
        });
    }
  }

  render() {
    const { query, searchResult } = this.state;
    const { dispatch, playlist } = this.props;

    return (
      <div className="search">
        <div className="search__header">
          <h2 className="search__title">Search</h2>
          <div className="search__input__container">
            <SearchIcon className="search__input__icon" />
            <input
              className="search__input"
              placeholder="Well, what do you want to listen?"
              type="text"
              onKeyPress={this.handleSearchInputKeyPress}
            />
          </div>
        </div>
        {/*<hr className="divider" />*/}
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

export default connect(
  state => state
)(SearchContainer);
