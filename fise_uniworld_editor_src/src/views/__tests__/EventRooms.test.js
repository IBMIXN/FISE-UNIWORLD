import React from "react";
import { shallow } from "enzyme";
import EventRooms from "../EventRooms";
import EventRoomService from "../../services/EventRoomService";
import { mockEventRoom, mockEventRoomUpdate } from "../../mockData/eventRoomMock";
import { useReducerState } from "../../utils/customHooks";
import Snackbar from "@material-ui/core/Snackbar";
import { platformURL } from "../../config";

jest.mock("../../services/EventRoomService");
jest.mock("../../utils/validate");
jest.mock("../../utils/customHooks", () => {
  return {
    useReducerState: jest.fn(),
  };
});

Object.assign(navigator, {
  clipboard: {
    writeText: () => {},
  },
});

describe("Eventrooms view test", () => {
  const location = { state: { created: false } };
  const match = { params: { id: "mockId" } };
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
    jest.spyOn(console, "warn").mockImplementation(() => {});
    window.confirm = jest.fn().mockImplementation(() => true);
    EventRoomService.getAll.mockImplementation(() =>
      Promise.resolve([{ ...mockEventRoom, _id: "mockId" }])
    );
  });

  it("should match snapshot", () => {
    const component = shallow(<EventRooms location={location} match={match} />);
    expect(component).toMatchSnapshot();
  });

  it("should match snapshot with event rooms", async () => {
    const component = shallow(<EventRooms location={location} match={match} />);
    await flushPromises();
    expect(component).toMatchSnapshot();
  });

  it("should fetch event rooms from EventRoomService on load", async () => {
    shallow(<EventRooms location={location} match={match} />);
    await flushPromises();
    expect(EventRoomService.getAll).toBeCalled();
  });

  it("should handle errors while fetching event rooms from EventRoomService on load", async () => {
    EventRoomService.getAll.mockImplementationOnce(() => Promise.reject("error"));
    shallow(<EventRooms location={location} match={match} />);
    await flushPromises();
    expect(EventRoomService.getAll).toBeCalled();
    expect(console.log).toBeCalledWith("error");
  });

  it("should show alert if location state created is true", async () => {
    shallow(<EventRooms location={{ state: { created: true } }} match={match} />);
    await flushPromises();
    expect(setAlert).toBeCalledWith({
      open: true,
      message: "Successfully created event room.",
      type: "success",
    });
  });

  it("should not show alert if location state is undefined", async () => {
    shallow(<EventRooms location={{}} match={match} />);
    await flushPromises();
    expect(setAlert).not.toBeCalled();
  });

  it("should correctly handle remove event room button click", async () => {
    const component = shallow(<EventRooms location={location} match={match} />);
    await flushPromises();
    expect(component.exists("#createEventRoomButton")).toEqual(false);
    component.find('[aria-label="removeEventRoomButton"]').first().simulate("click");
    await flushPromises();
    expect(component.exists("#createEventRoomButton")).toEqual(true);
    expect(window.confirm).toBeCalled();
    expect(EventRoomService.delete).toBeCalledWith("mockId");
  });

  it("should correctly handle errors during remove event room button click", async () => {
    EventRoomService.delete.mockImplementationOnce(() => Promise.reject("error"));
    const component = shallow(<EventRooms location={location} match={match} />);
    await flushPromises();
    component.find('[aria-label="removeEventRoomButton"]').first().simulate("click");
    await flushPromises();
    expect(component.exists("#createEventRoomButton")).toEqual(false);
    expect(window.confirm).toBeCalled();
    expect(EventRoomService.delete).toBeCalledWith("mockId");
    expect(console.log).toBeCalledWith("error");
  });

  it("should correctly handle edit event room button click", async () => {
    const component = shallow(<EventRooms history={history} location={location} match={match} />);
    await flushPromises();
    expect(component.exists("#createEventRoomButton")).toEqual(false);
    component.find('[aria-label="editEventRoomButton"]').first().simulate("click");
    await flushPromises();
    expect(history.push).toBeCalledWith({
      pathname: "/edit",
      state: { eventRoom: { ...mockEventRoom, _id: "mockId" } },
    });
  });

  it("should correctly handle close alert dialog", () => {
    const component = shallow(<EventRooms location={location} match={match} />);
    component.find(Snackbar).first().prop("onClose")();
    expect(setAlert).toBeCalledWith({ open: false });
  });

  it("should correctly select event room from list", async () => {
    EventRoomService.getAll.mockImplementationOnce(() =>
      Promise.resolve([
        { ...mockEventRoom, _id: "mockId" },
        { ...mockEventRoomUpdate, _id: "mockId2" },
      ])
    );
    const component = shallow(<EventRooms location={location} match={match} />);
    await flushPromises();
    expect(component.find("#currentEventRoomTitle").first().text()).toEqual(mockEventRoom.title);
    expect(component.exists("#listItem0")).toEqual(true);
    expect(component.exists("#listItem1")).toEqual(true);
    expect(component.find("#listItem1").first().prop("selected")).toEqual(false);
    component.find("#listItem1").first().simulate("click");
    expect(component.find("#listItem1").first().prop("selected")).toEqual(true);
    expect(component.find("#currentEventRoomTitle").first().text()).toEqual(
      mockEventRoomUpdate.title
    );
  });

  it("should correctly handle copying url", async () => {
    jest.spyOn(navigator.clipboard, "writeText");
    const component = shallow(<EventRooms location={location} match={match} />);
    await flushPromises();
    expect(component.exists('[aria-label="copyUrl"]')).toEqual(true);
    component.find('[aria-label="copyUrl"]').first().simulate("click");
    expect(navigator.clipboard.writeText).toBeCalledWith(`${platformURL}?id=mockId`);
  });
});
