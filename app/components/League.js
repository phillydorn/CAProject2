import React from 'react';
import { Link } from 'react-router';


const League = (props) => {

  const { league } = props;
  const { name, id } = league;
  
    return (
        <li  className = {`league${name}`}>
          <Link to={`/league/${id}`}>{name}</Link>
        </li>
      )
};

export default League;