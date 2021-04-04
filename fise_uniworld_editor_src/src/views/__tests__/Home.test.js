import React from "react";
import { shallow } from "enzyme";
import Home from "../Home";

describe("Home view test", () => {
  it("should match snapshot", () => {
    const component = shallow(<Home />);
    expect(component).toMatchSnapshot();
  });
});
