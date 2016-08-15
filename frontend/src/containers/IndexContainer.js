import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import qs from 'query-string';
import { search } from '../utils/youtube';
import { SearchResult, Navbar } from '../components';
import { CLIENT_ID } from '../appInfo';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.handleTitleClick = this.handleTitleClick.bind(this);
    this.handleAuthButtonClick = this.handleAuthButtonClick.bind(this);
    this.handleSearchInputKeyPress = this.handleSearchInputKeyPress.bind(this);

    this.state = {
      query: 'No result found',
      searchResult: [],
    }
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

  handleTitleClick() {
    this.props.router.push({ pathname: '/' });
  }

  componentDidMount() {
    search('beenzino');
  }

  render() {
    const { router, dispatch, children, auth } = this.props;
    const { query, searchResult } = this.state;

    return (
      <div>
        <Navbar />
        <input type="text" onKeyPress={this.handleSearchInputKeyPress} />
        <SearchResult query={query} items={searchResult} />
        {auth.isLoggedIn
          ? (
            <div>
              <h2>I'm logged in</h2>
            </div>
          )
          : (
            <div>
              <h1>Need to login</h1>
              <button onClick={this.handleAuthButtonClick}>Auth</button>
            </div>
          )
        }
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
  })
)(Main));
