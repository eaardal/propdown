/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import { shape, otherShape, moreShape } from './shape';
import { foo, bar } from './shape/asd/meg/gdf';

const BarComp = () => <h1>Foo</h1>;

BarComp.propTypes = {
  theobj: shape,
};

export default BarComp;
