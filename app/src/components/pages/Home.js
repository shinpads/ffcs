import React, { Component } from 'react';
import Teams from './Teams';
import Header from '../Header';

class Home extends Component {
  render() {
    return (
      <>
        <Header />
        <div>
          <Teams />
        </div>
      </>
    );
  }
}

export default Home;
