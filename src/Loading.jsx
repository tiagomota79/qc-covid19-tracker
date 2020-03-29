import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

// const Image = styled.img`
//   height: 150px;
// `;

class Loading extends Component {
  render() {
    return (
      <Wrapper>
        {/* <Image src='/imgs/spinner.gif' /> */}
        <div>App is loading</div>
      </Wrapper>
    );
  }
}

export default Loading;
