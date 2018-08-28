import React from 'react';
import ListItem from './ListItem.jsx';

const List = (props) => {
  
  const listItems = props.items.map((element) =>
    <li key={element.name}>
      {element.name} {element.average}
    </li>
  );

  return(
  	<div>
    	<h4> List Component </h4>
    	There are { props.items.length } items.
    	<ul>{listItems}</ul>
  	</div>
  );
  
}

export default List;