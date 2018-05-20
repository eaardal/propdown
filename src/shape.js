/* eslint-disable */

import PropTypes from 'prop-types';

export const fooShape = PropTypes.shape({
  hei: PropTypes.string.isRequired,
  tall: PropTypes.number,
});

export const otherShape = PropTypes.shape({
  neida: PropTypes.string.isRequired,
  jada: PropTypes.number,
});

export const moreShape = PropTypes.shape({
  lol: PropTypes.string.isRequired,
  fail: PropTypes.number,
});
