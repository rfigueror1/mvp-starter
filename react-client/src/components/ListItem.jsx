import React from 'react';

const ListItem = (props) => (
  <div>
    { props.item.name }
    { props.item.average} 
  </div>
)

export default ListItem;