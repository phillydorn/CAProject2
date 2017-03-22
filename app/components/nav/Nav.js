
import React from 'react';
import { Link } from 'react-router';

class Nav extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
        return (
      <nav>
      <div className="site-header">
        <h1>Bracket Draft</h1>
      </div>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/signup'>Sign Up</Link></li>
        <li><Link to='/login'>Log In</Link></li>
        <li><Link to='/#'>Bracket</Link></li>
        <li><Link to='/create'>Create League</Link></li>
        <li><Link to='/join'>Join League</Link></li>
        <li><Link to='/leagues'>Your Leagues</Link></li>
        <li><Link to='/logout'>Log Out</Link></li>
      </ul>
      </nav>
      );
  }
}

export default Nav;

