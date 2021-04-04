import React from "react";
import { shallow } from "enzyme";
import EventRoomForm from "../EventRoomForm";
import { mockEventRoomUpdate } from "../../mockData/eventRoomMock";
import BlobService from "../../services/BlobService";
import { useReducerState } from "../../utils/customHooks";

jest.mock("../../services/BlobService");
jest.mock("../../utils/customHooks", () => {
  return {
    useReducerState: jest.fn(),
  };
});

describe("EventRoomForm test", () => {
  const eventRoom = {
    title: "",
    scene: "Default",
    background: "Default",
    eventDate: "",
    meetingTables: [],
  };
  const setEventRoom = jest.fn();

  const flushPromises = () => new Promise(setImmediate);
  beforeEach(() => {
    useReducerState.mockImplementation(() => [eventRoom, setEventRoom]);
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("should match snapshot", () => {
    const component = shallow(
      <EventRoomForm
        onSubmit={() => {}}
        submitText="mockText"
        updateEventRoom={mockEventRoomUpdate}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it("should render not background autocomplete component if non-default scene is selected", () => {
    useReducerState.mockImplementationOnce(() => [
      { ...eventRoom, scene: "mockScene" },
      setEventRoom,
    ]);
    const component = shallow(
      <EventRoomForm onSubmit={() => {}} submitText="mockText" updateEventRoom={{}} />
    );
    expect(component).toMatchSnapshot();
  });

  it("should fetch backgrounds from blob service on load", () => {
    shallow(<EventRoomForm onSubmit={() => {}} submitText="mockText" />);
    expect(BlobService.get).toBeCalledWith("backgrounds");
  });

  it("should set eventRoom if updateEventRoom prop exists", () => {
    shallow(
      <EventRoomForm
        onSubmit={() => {}}
        submitText="mockText"
        updateEventRoom={mockEventRoomUpdate}
      />
    );
    expect(setEventRoom).toBeCalledWith(mockEventRoomUpdate);
  });

  it("should not set eventRoom if updateEventRoom prop does not exists", () => {
    shallow(<EventRoomForm onSubmit={() => {}} submitText="mockText" />);
    expect(setEventRoom).not.toBeCalledWith(mockEventRoomUpdate);
  });

  it("should select background correctly from autocomplete", () => {
    const component = shallow(<EventRoomForm onSubmit={() => {}} submitText="mockText" />);
    const mockBackground = "mockBackground";
    component.find("#selectBackground").first().simulate("change", null, mockBackground);
    expect(setEventRoom).toBeCalledWith({ background: mockBackground });
  });

  it("should select scene correctly from autocomplete", () => {
    const component = shallow(<EventRoomForm onSubmit={() => {}} submitText="mockText" />);
    const mockScene = "Default";
    component.find("#selectScene").first().simulate("change", null, mockScene);
    expect(setEventRoom).toBeCalledWith({ scene: mockScene });
  });

  it("should set background to default if non-default scene is selected from autocomplete", () => {
    const component = shallow(<EventRoomForm onSubmit={() => {}} submitText="mockText" />);
    const mockScene = "mockScene";
    component.find("#selectScene").first().simulate("change", null, mockScene);
    expect(setEventRoom).toBeCalledWith({ scene: mockScene, background: "Default" });
  });

  it("should correctly handle title text change event", () => {
    const component = shallow(<EventRoomForm onSubmit={() => {}} submitText="mockText" />);
    const mockEvent = { target: { name: "title", value: "mockTitle" } };
    component.find("#title").first().simulate("change", mockEvent);
    expect(setEventRoom).toBeCalledWith({ title: mockEvent.target.value });
  });

  it("should correctly handle date change event", () => {
    const component = shallow(<EventRoomForm onSubmit={() => {}} submitText="mockText" />);
    const mockDate = new Date().toISOString();
    component.find("#eventDate").first().simulate("change", mockDate);
    expect(setEventRoom).toBeCalledWith({ eventDate: mockDate });
  });

  it("should correctly handle upload background", async () => {
    BlobService.upload.mockImplementationOnce(() => Promise.resolve("mockBackground"));

    const component = shallow(<EventRoomForm onSubmit={() => {}} submitText="mockText" />);
    const mockEvent = { target: { files: [{ name: "mockImage.jpg" }] }, preventDefault: () => {} };
    component.find("#backgroundUpload").first().simulate("change", mockEvent);
    await flushPromises();
    expect(BlobService.upload.mock.calls[0][1]).toBe("backgrounds");
    expect(setEventRoom).toBeCalledWith({ background: "mockBackground" });
  });

  it("should correctly handle submit form", async () => {
    const mockSubmit = jest.fn();
    const component = shallow(
      <EventRoomForm onSubmit={mockSubmit} submitText="mockText" updateEventRoom={{}} />
    );
    component.find("#submitButton").first().simulate("click");
    await flushPromises();
    expect(mockSubmit).toBeCalledWith(eventRoom);
    expect(setEventRoom).toBeCalled();
  });

  it("should correctly handle submit form when background set to none", async () => {
    useReducerState.mockImplementationOnce(() => [
      { ...eventRoom, background: "none" },
      setEventRoom,
    ]);
    const mockSubmit = jest.fn();
    const component = shallow(
      <EventRoomForm onSubmit={mockSubmit} submitText="mockText" updateEventRoom={{}} />
    );
    component.find("#submitButton").first().simulate("click");
    await flushPromises();
    expect(mockSubmit).toBeCalledWith({ ...eventRoom, background: undefined });
    expect(setEventRoom).toBeCalled();
  });
});
