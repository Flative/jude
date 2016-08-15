import React from 'react';
import { search } from '../utils/youtube';
import { SearchResult } from '../components';

class SearchContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearchInputKeyPress = this.handleSearchInputKeyPress.bind(this);

    this.state = {
      query: 'No result found',
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

    return (
      <div className="search">
        <input
          className="search__input"
          type="text"
          onKeyPress={this.handleSearchInputKeyPress}
        />
        <SearchResult query={query} items={searchResult} />
      </div>
    );
  }
}

SearchContainer.propTypes = {};
SearchContainer.defaultProps = {};

export default SearchContainer;
