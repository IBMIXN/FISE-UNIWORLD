import React from "react";
import { shallow } from "enzyme";
import TableDialog from "../TableDialog";
import { mockMeetingTable } from "../../mockData/eventRoomMock";
import BlobService from "../../services/BlobService";
import { useReducerState } from "../../utils/customHooks";

jest.mock("../../services/BlobService");
jest.mock("../../utils/customHooks", () => {
  return {
    useReducerState: jest.fn(),
  };
});

describe("TableDialog test", () => {
  const table = {
    title: "",
    type: "RoundMeetingTable",
    zoomUrl: "",
    logoUrl: "",
  };
  const setTable = jest.fn();

  const flushPromises = () => new Promise(setImmediate);
  beforeEach(() => {
    useReducerState.mockImplementation(() => [table, setTable]);
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("should match snapshot", () => {
    const component = shallow(
      <TableDialog
        open={false}
        onClose={() => {}}
        onSubmit={() => {}}
        updateTable={mockMeetingTable}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it("should set table if updateTable prop exists", () => {
    shallow(
      <TableDialog
        open={false}
        onClose={() => {}}
        onSubmit={() => {}}
        updateTable={mockMeetingTable}
      />
    );
    expect(setTable).toBeCalledWith(mockMeetingTable);
  });

  it("should not set lectureRoom if updateLectureRoom prop is undefined", () => {
    shallow(<TableDialog open={false} onClose={() => {}} onSubmit={() => {}} />);
    expect(setTable).not.toBeCalled();
  });

  it("should fetch logos from blob service on load", async () => {
    shallow(<TableDialog open={false} onClose={() => {}} onSubmit={() => {}} />);
    await flushPromises();
    expect(BlobService.get).toBeCalledWith("logos");
  });

  it("should correctly set table logoUrl to fetched logo", async () => {
    BlobService.get.mockImplementationOnce(() => Promise.resolve(["mockLogoUrl"]));
    shallow(<TableDialog open={false} onClose={() => {}} onSubmit={() => {}} />);
    await flushPromises();
    expect(BlobService.get).toBeCalledWith("logos");
    expect(setTable).toBeCalledWith({ logoUrl: "mockLogoUrl" });
  });

  it("should correctly handle meeting title text change event", () => {
    const component = shallow(<TableDialog open={false} onClose={() => {}} onSubmit={() => {}} />);
    const mockEvent = { target: { name: "title", value: "mockMeetingTitle" } };
    component.find("#meetingTitle").first().simulate("change", mockEvent);
    expect(setTable).toBeCalledWith({ title: mockEvent.target.value });
  });

  it("should correctly handle table type change event", () => {
    const component = shallow(<TableDialog open={false} onClose={() => {}} onSubmit={() => {}} />);
    const mockEvent = { target: { name: "type", value: "mockTableType" } };
    component.find("#tableType").first().simulate("change", mockEvent);
    expect(setTable).toBeCalledWith({ type: mockEvent.target.value });
  });

  it("should correctly handle zoom url change event", () => {
    const component = shallow(<TableDialog open={false} onClose={() => {}} onSubmit={() => {}} />);
    const mockEvent = { target: { name: "zoomUrl", value: "mockUrl" } };
    component.find("#zoomUrl").first().simulate("change", mockEvent);
    expect(setTable).toBeCalledWith({ zoomUrl: mockEvent.target.value });
  });

  it("should correctly handle logo select autocomplete change event", () => {
    const component = shallow(<TableDialog open={false} onClose={() => {}} onSubmit={() => {}} />);
    const mockLogo = "mockLogo";
    component.find("#selectLogo").first().simulate("change", null, mockLogo);
    expect(setTable).toBeCalledWith({ logoUrl: mockLogo });
  });

  it("should correctly upload logo", async () => {
    BlobService.upload.mockImplementationOnce(() => Promise.resolve("mockLogoUrl"));
    const component = shallow(<TableDialog open={false} onClose={() => {}} onSubmit={() => {}} />);
    const mockEvent = { target: { files: [{ name: "mockLogo.jpg" }] }, preventDefault: () => {} };
    component.find("#uploadLogo").first().simulate("change", mockEvent);
    await flushPromises();
    expect(BlobService.upload.mock.calls[0][1]).toBe("logos");
    expect(setTable).toBeCalledWith({ logoUrl: "mockLogoUrl" });
  });

  it("should not upload logo if file format is not an image", async () => {
    const component = shallow(<TableDialog open={false} onClose={() => {}} onSubmit={() => {}} />);
    const mockEvent = {
      target: { files: [{ name: "invalidFile.txt" }] },
      preventDefault: () => {},
    };
    component.find("#uploadLogo").first().simulate("change", mockEvent);
    await flushPromises();
    expect(BlobService.upload).not.toBeCalled();
    expect(setTable).not.toBeCalled();
  });

  it("should correctly handle close dialog event", async () => {
    const mockClose = jest.fn();
    const component = shallow(<TableDialog open={false} onClose={mockClose} onSubmit={() => {}} />);
    component.find("#dialog").first().simulate("close");
    await flushPromises();
    expect(setTable).toBeCalledTimes(1);
    expect(mockClose).toBeCalled();
  });

  it("should correctly handle close button", async () => {
    const mockClose = jest.fn();
    const component = shallow(<TableDialog open={false} onClose={mockClose} onSubmit={() => {}} />);
    component.find("#closeButton").first().simulate("click");
    await flushPromises();
    expect(setTable).toBeCalledTimes(1);
    expect(mockClose).toBeCalled();
  });

  it("should correctly handle submit dialog event", async () => {
    useReducerState.mockImplementationOnce(() => [
      { ...table, type: "RectangularMeetingTable" },
      setTable,
    ]);
    const mockClose = jest.fn();
    const mockSubmit = jest.fn();
    const component = shallow(
      <TableDialog open={false} onClose={mockClose} onSubmit={mockSubmit} />
    );
    component.find("#submitButton").first().simulate("click");
    await flushPromises();
    expect(setTable).toBeCalledTimes(1);
    expect(mockSubmit).toBeCalledWith({
      ...table,
      type: "RectangularMeetingTable",
      logoUrl: undefined,
      zoomUrl: undefined,
    });
    expect(mockClose).toBeCalled();
  });
});
