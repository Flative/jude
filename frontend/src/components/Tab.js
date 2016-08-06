import React from 'react';

const Tab = ({ items }) => {
  return (
    <div>
      <ul className="tab">
        {items.map(item => (
          <li className="tab-item" key={item.id} onClick={item.onTabClick}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

Tab.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.number,
    name: React.PropTypes.string,
    onTabClick: React.PropTypes.func,
  })),
};
Tab.defaultProps = {};

export default Tab;
