import React from 'react';
import { shallow } from 'enzyme';
import Navbar from '../Navbar';

describe('Navbar test', () => {
  it('Navbar should match snapshot', () => {
    const component = shallow(<Navbar />);
    expect(component).toMatchSnapshot();
  });
});
