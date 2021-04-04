import React from "react";
import { shallow } from "enzyme";
import LectureRoomForm from "../LectureRoomForm";
import { mockLectureRoomUpdate } from "../../mockData/lectureRoomMock";
import BlobService from "../../services/BlobService";
import { useReducerState } from "../../utils/customHooks";
import { convertPdfToImages, convertPreviewImage } from "../../utils/pdfToImageUtils";
jest.mock("../../services/BlobService");
jest.mock("../../utils/customHooks", () => {
  return {
    useReducerState: jest.fn(),
  };
});
jest.mock("../../utils/pdfToImageUtils", () => {
  return {
    convertPdfToImages: jest.fn(),
    convertPreviewImage: jest.fn(),
  };
});

describe("LectureRoomForm test", () => {
  const lectureRoom = {
    title: "",
    module: "",
    lecturer: "",
    startTime: "",
    endTime: "",
    firstSlideUrl: "",
    numSlides: 1,
  };
  const setLectureRoom = jest.fn();
  const flushPromises = () => new Promise(setImmediate);

  beforeAll(() => {
    Date.now = jest.fn(() => new Date("2021-03-01T12:00:00.000Z"));
  });

  let mockAlert;
  beforeEach(() => {
    useReducerState.mockImplementation(() => [lectureRoom, setLectureRoom]);
    jest.spyOn(console, "log").mockImplementation(() => {});
    mockAlert = jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("should match snapshot", () => {
    const component = shallow(
      <LectureRoomForm
        onSubmit={() => {}}
        submitText="mockText"
        updateLectureRoom={mockLectureRoomUpdate}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it("should correctly render preview image for firstSlideUrl", () => {
    useReducerState.mockImplementation(() => [
      { ...lectureRoom, firstSlideUrl: "mockSlideUrl" },
      setLectureRoom,
    ]);
    const component = shallow(<LectureRoomForm onSubmit={() => {}} submitText="mockText" />);
    expect(component).toMatchSnapshot();
  });

  it("should set lectureRoom if updateLectureRoom prop exists", () => {
    shallow(
      <LectureRoomForm
        onSubmit={() => {}}
        submitText="mockText"
        updateLectureRoom={mockLectureRoomUpdate}
      />
    );
    expect(setLectureRoom).toBeCalledWith(mockLectureRoomUpdate);
  });

  it("should not set lectureRoom if updateLectureRoom prop is undefined", () => {
    shallow(<LectureRoomForm onSubmit={() => {}} submitText="mockText" />);
    expect(setLectureRoom).not.toBeCalled();
  });

  it("should correctly handle title text change event", () => {
    const component = shallow(<LectureRoomForm onSubmit={() => {}} submitText="mockText" />);
    const mockEvent = { target: { name: "title", value: "mockTitle" } };
    component.find("#title").first().simulate("change", mockEvent);
    expect(setLectureRoom).toBeCalledWith({ title: mockEvent.target.value });
  });

  it("should correctly handle module text change event", () => {
    const component = shallow(<LectureRoomForm onSubmit={() => {}} submitText="mockText" />);
    const mockEvent = { target: { name: "module", value: "mockModule" } };
    component.find("#module").first().simulate("change", mockEvent);
    expect(setLectureRoom).toBeCalledWith({ module: mockEvent.target.value });
  });

  it("should correctly handle lecturer text change event", () => {
    const component = shallow(<LectureRoomForm onSubmit={() => {}} submitText="mockText" />);
    const mockEvent = { target: { name: "lecturer", value: "mockLecturer" } };
    component.find("#lecturer").first().simulate("change", mockEvent);
    expect(setLectureRoom).toBeCalledWith({ lecturer: mockEvent.target.value });
  });

  it("should correctly handle start time change event", () => {
    const component = shallow(<LectureRoomForm onSubmit={() => {}} submitText="mockText" />);
    const mockStartTime = new Date().toISOString();
    component.find("#startTime").first().simulate("change", mockStartTime);
    expect(setLectureRoom).toBeCalledWith({ startTime: mockStartTime });
  });

  it("should correctly handle end time change event", () => {
    const component = shallow(<LectureRoomForm onSubmit={() => {}} submitText="mockText" />);
    const mockEndTime = new Date().toISOString();
    component.find("#endTime").first().simulate("change", mockEndTime);
    expect(setLectureRoom).toBeCalledWith({ endTime: mockEndTime });
  });

  it("should correctly handle upload lecture slide", async () => {
    const component = shallow(<LectureRoomForm onSubmit={() => {}} submitText="mockText" />);
    const mockEvent = { target: { files: [{ name: "mockSlide.pdf" }] }, preventDefault: () => {} };
    component.find("#lectureSlideUpload").first().simulate("change", mockEvent);
    await flushPromises();
    expect(convertPreviewImage).toBeCalledWith(mockEvent.target.files[0]);
  });

  it("should alert user if invalid (non-pdf) file is uploaded", async () => {
    const component = shallow(<LectureRoomForm onSubmit={() => {}} submitText="mockText" />);
    const mockEvent = {
      target: { files: [{ name: "invalidFile.jpg" }] },
      preventDefault: () => {},
    };
    component.find("#lectureSlideUpload").first().simulate("change", mockEvent);
    await flushPromises();
    expect(convertPreviewImage).not.toBeCalled();
    expect(mockAlert).toBeCalledWith("Please select a valid PDF document.");
  });

  it("should correctly handle submit form", async () => {
    convertPdfToImages.mockImplementationOnce(() =>
      Promise.resolve({ numSlides: 0, formData: null })
    );
    BlobService.upload.mockImplementationOnce(() => Promise.resolve("mockSlide"));
    const mockSubmit = jest.fn();
    const component = shallow(
      <LectureRoomForm onSubmit={mockSubmit} submitText="mockText" updateLectureRoom={{}} />
    );
    const mockEvent = { target: { files: [{ name: "mockSlide.pdf" }] }, preventDefault: () => {} };
    component.find("#lectureSlideUpload").first().simulate("change", mockEvent);
    await flushPromises();
    component.find("#submitButton").first().simulate("click");
    await flushPromises();
    expect(convertPdfToImages).toBeCalledWith(mockEvent.target.files[0]);
    expect(BlobService.upload.mock.calls[0][1]).toBe("slides");
    expect(mockSubmit).toBeCalledWith({ ...lectureRoom, numSlides: 0, firstSlideUrl: "mockSlide" });
    expect(setLectureRoom).toBeCalled();
  });

  it("should correctly handle submit form when no files are uploaded", async () => {
    const mockSubmit = jest.fn();
    const component = shallow(
      <LectureRoomForm onSubmit={mockSubmit} submitText="mockText" updateLectureRoom={{}} />
    );
    component.find("#submitButton").first().simulate("click");
    await flushPromises();
    expect(convertPdfToImages).not.toBeCalled();
    expect(BlobService.upload).not.toBeCalled();
    expect(mockSubmit).toBeCalled();
    expect(setLectureRoom).toBeCalled();
  });
});
