import React from 'react';
import { shallow } from 'enzyme';
import Layout from '../Layout';

describe('Layout test', () => {
  it('Layout should match snapshot', () => {
    const component = shallow(<Layout />);
    expect(component).toMatchSnapshot();
  });
});
