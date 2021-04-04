import React from 'react';
import { shallow } from 'enzyme';
import FileUpload from '../FileUpload';

describe('FileUpload test', () => {
  it('FileUpload should match snapshot', () => {
    const component = shallow(
      <FileUpload
        name='mockName'
        onChange={() => {}}
        width='100px'
        accept='mockAccept'
      />
    );
    expect(component).toMatchSnapshot();
  });
});
