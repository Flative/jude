import React from 'react';

class Playlist extends React.Component {
  render() {
    const { data = [] } = this.props;

    return (
      <div>
        <h1>Playlist</h1>
        <ul>
          {data.map(item =>
            <li key={item.id}>{item.title}</li>)
          }
        </ul>
      </div>
    );
  }
}

Playlist.propTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string,
    title: React.PropTypes.string,
  })),
};
Playlist.defaultProps = {};

export default Playlist;
