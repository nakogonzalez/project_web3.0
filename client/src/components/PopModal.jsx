import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import OnRamp from './OnRamp'

const PopModal = () => (
  <Popup trigger={<button> OnRamp</button>} position="bottom center">
        <OnRamp></OnRamp>
  </Popup>
);

export default PopModal