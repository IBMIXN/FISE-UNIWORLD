import React from "react";
import { shallow } from "enzyme";
import Snackbar from "@material-ui/core/Snackbar";
import CreateEventRoom from "../CreateEventRoom";
import EventRoomService from "../../services/EventRoomService";
import { mockEventRoom } from "../../mockData/eventRoomMock";
import { useReducerState } from "../../utils/customHooks";
import { validateEventRoom } from "../../utils/validate";

jest.mock("../../services/EventRoomService");
jest.mock("../../utils/validate");
jest.mock("../../utils/customHooks", () => {
  return {
    useReducerState: jest.fn(),
  };
});

describe("Create Event Room view test", () => {
  const history = { push: jest.fn() };

  const flushPromises = () => new Promise(setImmediate);
  const alert = {
    open: false,
    message: "",
    type: "success",
  };
  const setAlert = jest.fn();
  beforeEach(() => {
    useReducerState.mockImplementation(() => [alert, setAlert]);
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("should match snapshot", () => {
    const component = shallow(<CreateEventRoom history={history} />);
    expect(component).toMatchSnapshot();
  });

  it("should correctly handle submit event room form event", async () => {
    validateEventRoom.mockImplementationOnce(() => true);
    EventRoomService.create.mockImplementationOnce(() =>
      Promise.resolve({ ...mockEventRoom, _id: "mockId" })
    );
    const component = shallow(<CreateEventRoom history={history} />);
    component.find("EventRoomForm").first().prop("onSubmit")(mockEventRoom);
    await flushPromises();
    expect(validateEventRoom).toBeCalledWith(mockEventRoom);
    expect(EventRoomService.create).toBeCalledWith(mockEventRoom);
    expect(history.push).toBeCalledWith({
      pathname: "/eventrooms/mockId",
      state: { created: true },
    });
    expect(setAlert).not.toBeCalled();
  });

  it("should correctly handle submit event room form event when validation fails", async () => {
    validateEventRoom.mockImplementationOnce(() => false);
    const component = shallow(<CreateEventRoom history={history} />);
    component.find("EventRoomForm").first().prop("onSubmit")(mockEventRoom);
    await flushPromises();
    expect(validateEventRoom).toBeCalledWith(mockEventRoom);
    expect(setAlert).toBeCalledWith({
      open: true,
      message: "Please make sure you have entered all the fields",
      type: "warning",
    });
    expect(EventRoomService.create).not.toBeCalled();
    expect(history.push).not.toBeCalled();
  });

  it("should correctly handle submit event room form event when an error is thrown", async () => {
    validateEventRoom.mockImplementationOnce(() => true);
    EventRoomService.create.mockImplementationOnce(() => Promise.reject());
    const component = shallow(<CreateEventRoom history={history} />);
    component.find("EventRoomForm").first().prop("onSubmit")(mockEventRoom);
    await flushPromises();
    expect(validateEventRoom).toBeCalledWith(mockEventRoom);
    expect(EventRoomService.create).toBeCalledWith(mockEventRoom);
    expect(setAlert).toBeCalledWith({
      open: true,
      message: "Failed to create event room. Please try again later.",
      type: "error",
    });
    expect(history.push).not.toBeCalled();
  });

  it("should correctly handle close alert dialog", () => {
    const component = shallow(<CreateEventRoom history={history} />);
    component.find(Snackbar).first().prop("onClose")();
    expect(setAlert).toBeCalledWith({ open: false });
  });
});
