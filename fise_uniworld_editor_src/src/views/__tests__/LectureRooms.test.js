import React from "react";
import { shallow } from "enzyme";
import LectureRooms from "../LectureRooms";
import BlobService from "../../services/BlobService";
import LectureRoomService from "../../services/LectureRoomService";
import { mockLectureRoom, mockLectureRoomUpdate } from "../../mockData/lectureRoomMock";
import { useReducerState } from "../../utils/customHooks";
import Snackbar from "@material-ui/core/Snackbar";
import { platformURL } from "../../config";
import { getFileName } from "../../utils/blobs";

jest.mock("../../services/LectureRoomService");
jest.mock("../../services/BlobService");
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

describe("Lecturerooms view test", () => {
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
    LectureRoomService.get.mockImplementation(() =>
      Promise.resolve([{ ...mockLectureRoom, _id: "mockId" }])
    );
  });

  it("should match snapshot", () => {
    const component = shallow(<LectureRooms location={location} match={match} />);
    expect(component).toMatchSnapshot();
  });

  it("should match snapshot with lecture rooms", async () => {
    const component = shallow(<LectureRooms location={location} match={match} />);
    await flushPromises();
    expect(component).toMatchSnapshot();
  });

  it("should fetch lecture rooms from LectureRoomService on load", async () => {
    shallow(<LectureRooms location={location} match={match} />);
    await flushPromises();
    expect(LectureRoomService.get).toBeCalled();
  });

  it("should handle errors while fetching lecture rooms from LectureRoomService on load", async () => {
    LectureRoomService.get.mockImplementationOnce(() => Promise.reject("error"));
    shallow(<LectureRooms location={location} match={match} />);
    await flushPromises();
    expect(LectureRoomService.get).toBeCalled();
    expect(console.log).toBeCalledWith("error");
  });

  it("should show alert if location state created is true", async () => {
    shallow(<LectureRooms location={{ state: { created: true } }} match={match} />);
    await flushPromises();
    expect(setAlert).toBeCalledWith({
      open: true,
      message: "Successfully created lecture room.",
      type: "success",
    });
  });

  it("should not show alert if location state is undefined", async () => {
    shallow(<LectureRooms location={{}} match={match} />);
    await flushPromises();
    expect(setAlert).not.toBeCalled();
  });

  it("should correctly handle remove lecture room button click", async () => {
    const component = shallow(<LectureRooms location={location} match={match} />);
    await flushPromises();
    expect(component.exists("#createLectureRoomButton")).toEqual(false);
    component.find('[aria-label="removeLectureRoomButton"]').first().simulate("click");
    await flushPromises();
    expect(component.exists("#createLectureRoomButton")).toEqual(true);
    expect(window.confirm).toBeCalled();
    expect(BlobService.deleteSlides).toBeCalledWith(
      getFileName(mockLectureRoom.firstSlideUrl),
      mockLectureRoom.numSlides
    );
    expect(LectureRoomService.delete).toBeCalledWith("mockId");
  });

  it("should correctly handle errors during remove lecture room button click", async () => {
    LectureRoomService.delete.mockImplementationOnce(() => Promise.reject("error"));
    const component = shallow(<LectureRooms location={location} match={match} />);
    await flushPromises();
    component.find('[aria-label="removeLectureRoomButton"]').first().simulate("click");
    await flushPromises();
    expect(component.exists("#createLectureRoomButton")).toEqual(false);
    expect(window.confirm).toBeCalled();
    expect(LectureRoomService.delete).toBeCalledWith("mockId");
    expect(console.log).toBeCalledWith("error");
  });

  it("should correctly handle edit lecture room button click", async () => {
    const component = shallow(<LectureRooms history={history} location={location} match={match} />);
    await flushPromises();
    expect(component.exists("#createLectureRoomButton")).toEqual(false);
    component.find('[aria-label="editLectureRoomButton"]').first().simulate("click");
    await flushPromises();
    expect(history.push).toBeCalledWith({
      pathname: "/editlectureroom",
      state: { lectureRoom: { ...mockLectureRoom, _id: "mockId" } },
    });
  });

  it("should correctly handle close alert dialog", () => {
    const component = shallow(<LectureRooms location={location} match={match} />);
    component.find(Snackbar).first().prop("onClose")();
    expect(setAlert).toBeCalledWith({ open: false });
  });

  it("should correctly select lecture room from list", async () => {
    LectureRoomService.get.mockImplementationOnce(() =>
      Promise.resolve([
        { ...mockLectureRoom, _id: "mockId" },
        { ...mockLectureRoomUpdate, _id: "mockId2" },
      ])
    );
    const component = shallow(<LectureRooms location={location} match={match} />);
    await flushPromises();
    expect(component.find("#currentLectureRoomTitle").first().text()).toEqual(
      mockLectureRoom.title
    );
    expect(component.exists("#listItem0")).toEqual(true);
    expect(component.exists("#listItem1")).toEqual(true);
    expect(component.find("#listItem1").first().prop("selected")).toEqual(false);
    component.find("#listItem1").first().simulate("click");
    expect(component.find("#listItem1").first().prop("selected")).toEqual(true);
    expect(component.find("#currentLectureRoomTitle").first().text()).toEqual(
      mockLectureRoomUpdate.title
    );
  });

  it("should correctly handle copying url", async () => {
    jest.spyOn(navigator.clipboard, "writeText");
    const component = shallow(<LectureRooms location={location} match={match} />);
    await flushPromises();
    expect(component.exists('[aria-label="copyUrl"]')).toEqual(true);
    component.find('[aria-label="copyUrl"]').first().simulate("click");
    expect(navigator.clipboard.writeText).toBeCalledWith(`${platformURL}?lid=mockId`);
  });
});
