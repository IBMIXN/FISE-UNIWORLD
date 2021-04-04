import React from "react";
import { shallow } from "enzyme";
import Snackbar from "@material-ui/core/Snackbar";
import EditLectureRoom from "../EditLectureRoom";
import LectureRoomService from "../../services/LectureRoomService";
import { mockLectureRoom } from "../../mockData/lectureRoomMock";
import { useReducerState } from "../../utils/customHooks";
import { validateLectureRoom } from "../../utils/validate";

jest.mock("../../services/LectureRoomService");
jest.mock("../../utils/validate");
jest.mock("../../utils/customHooks", () => {
  return {
    useReducerState: jest.fn(),
  };
});

describe("Edit Lecture Room view test", () => {
  const history = { push: jest.fn() };
  const location = { state: { created: true, lectureRoom: { ...mockLectureRoom, _id: "mockId" } } };

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
    const component = shallow(<EditLectureRoom history={history} location={location} />);
    expect(component).toMatchSnapshot();
  });

  it("should correctly handle submit edit lecture room form event", async () => {
    validateLectureRoom.mockImplementationOnce(() => true);
    LectureRoomService.update.mockImplementationOnce(() =>
      Promise.resolve({ ...mockLectureRoom, _id: "mockId" })
    );
    const component = shallow(<EditLectureRoom history={history} location={location} />);
    component.find("LectureRoomForm").first().prop("onSubmit")(mockLectureRoom);
    await flushPromises();
    expect(validateLectureRoom).toBeCalledWith(mockLectureRoom);
    expect(LectureRoomService.update).toBeCalledWith("mockId", mockLectureRoom);
    expect(history.push).toBeCalledWith({
      pathname: "/lecturerooms/mockId",
      state: { created: true },
    });
    expect(setAlert).not.toBeCalled();
  });

  it("should correctly handle submit edit lecture room form event when validation fails", async () => {
    validateLectureRoom.mockImplementationOnce(() => false);
    const component = shallow(<EditLectureRoom history={history} location={location} />);
    component.find("LectureRoomForm").first().prop("onSubmit")(mockLectureRoom);
    await flushPromises();
    expect(validateLectureRoom).toBeCalledWith(mockLectureRoom);
    expect(setAlert).toBeCalledWith({
      open: true,
      message: "Please make sure you have entered all the fields",
      type: "warning",
    });
    expect(LectureRoomService.update).not.toBeCalled();
    expect(history.push).not.toBeCalled();
  });

  it("should correctly handle submit edit lecture room form event when an error is thrown", async () => {
    validateLectureRoom.mockImplementationOnce(() => true);
    LectureRoomService.update.mockImplementationOnce(() => Promise.reject());
    const component = shallow(<EditLectureRoom history={history} location={location} />);
    component.find("LectureRoomForm").first().prop("onSubmit")(mockLectureRoom);
    await flushPromises();
    expect(validateLectureRoom).toBeCalledWith(mockLectureRoom);
    expect(LectureRoomService.update).toBeCalledWith("mockId", mockLectureRoom);
    expect(setAlert).toBeCalledWith({
      open: true,
      message: "Failed to edit lecture room. Please try again later.",
      type: "error",
    });
    expect(history.push).not.toBeCalled();
  });

  it("should correctly handle close alert dialog", () => {
    const component = shallow(<EditLectureRoom history={history} location={location} />);
    component.find(Snackbar).first().prop("onClose")();
    expect(setAlert).toBeCalledWith({ open: false });
  });
});
