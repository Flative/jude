import React from 'react';
import Tab from '../components/Tab';

class Articles extends React.Component {
  render() {
    const tabItems = [{
      id: 100,
      name: '테스트',
    }, {
      id: 1000,
      name: '테스트2',
    }];

    return (
      <div className="page-articles">
        <div className="wrapper">
          <Tab items={tabItems} />
        </div>
      </div>
    );
  }
}

Articles.propTypes = {};
Articles.defaultProps = {};

export default Articles;
