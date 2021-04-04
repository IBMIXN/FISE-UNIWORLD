import React from 'react';
import { shallow } from 'enzyme';
import TableGrid from '../TableGrid';
import { mockMeetingTable } from '../../mockData/eventRoomMock';

describe('TableGrid test', () => {
  it('TableGrid should match snapshot', () => {
    const component = shallow(<TableGrid tables={[mockMeetingTable]} />);
    expect(component).toMatchSnapshot();
  });

  it('TableGrid should match snapshot with empty tables array', () => {
    const component = shallow(<TableGrid tables={[]} />);
    expect(component).toMatchSnapshot();
  });
});
