import React from "react";
import { shallow } from "enzyme";
import TableGridEditor from "../TableGridEditor";
import { mockMeetingTable } from "../../mockData/eventRoomMock";
import { getTableIndex, toTablePos } from "../../utils/tableUtils";
import BlobService from "../../services/BlobService";
import { useReducerState } from "../../utils/customHooks";

jest.mock("../../services/BlobService");
jest.mock("../../utils/customHooks", () => {
  return {
    useReducerState: jest.fn(),
  };
});

describe("TableGridEditor test", () => {
  const dialog = { open: false, posX: 0, posY: 0 };
  const setDialog = jest.fn();
  const editDialog = {
    open: false,
    index: 0,
    table: undefined,
  };
  const setEditDialog = jest.fn();

  beforeEach(() => {
    useReducerState
      .mockImplementationOnce(() => [dialog, setDialog])
      .mockImplementationOnce(() => [editDialog, setEditDialog]);
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("should match snapshot", () => {
    const component = shallow(
      <TableGridEditor tables={[mockMeetingTable]} updateMeetingTables={() => {}} />
    );
    expect(component).toMatchSnapshot();
  });

  it("should match snapshot with empty tables array", () => {
    const component = shallow(<TableGridEditor tables={[]} updateMeetingTables={() => {}} />);
    expect(component).toMatchSnapshot();
  });

  it("should handle close event correctly for table dialog", () => {
    const component = shallow(
      <TableGridEditor tables={[mockMeetingTable]} updateMeetingTables={() => {}} />
    );
    component.find("#tableDialog").first().simulate("close");
    expect(setDialog).toBeCalledWith({ open: false });
  });

  it("should handle submit event correctly for table dialog", () => {
    const mockUpdateMeetingTables = jest.fn();
    const component = shallow(
      <TableGridEditor tables={[mockMeetingTable]} updateMeetingTables={mockUpdateMeetingTables} />
    );
    component.find("#tableDialog").first().simulate("submit", {});
    expect(setDialog).toBeCalledWith(dialog);
    const table = { posX: dialog.posX, posY: dialog.posY };
    expect(mockUpdateMeetingTables).toBeCalledWith([mockMeetingTable, table]);
  });

  it("should handle close event correctly for edit table dialog", () => {
    const component = shallow(
      <TableGridEditor tables={[mockMeetingTable]} updateMeetingTables={() => {}} />
    );
    component.find("#editDialog").first().simulate("close");
    expect(setEditDialog).toBeCalledWith({ open: false });
  });

  it("should handle submit event correctly for edit table dialog", () => {
    const mockUpdateMeetingTables = jest.fn();
    const component = shallow(
      <TableGridEditor tables={[mockMeetingTable]} updateMeetingTables={mockUpdateMeetingTables} />
    );
    const table = { posX: dialog.posX, posY: dialog.posY };
    component.find("#editDialog").first().simulate("submit", table);
    expect(setEditDialog).toBeCalledWith(editDialog);
    expect(mockUpdateMeetingTables).toBeCalledWith([table]);
  });

  it("should handle click event correctly for grid edit table button", () => {
    const mockUpdateMeetingTables = jest.fn();
    const row = 2,
      col = 4;
    const table = { ...mockMeetingTable, posX: toTablePos(row), posY: toTablePos(col) };
    const component = shallow(
      <TableGridEditor tables={[table]} updateMeetingTables={mockUpdateMeetingTables} />
    );
    component.find(`#gridEditButton${row}-${col}`).first().simulate("click");
    const index = getTableIndex(row, col, [table]);
    expect(setEditDialog).toBeCalledWith({ open: true, index: index, table: table });
  });

  it("should handle click event correctly for grid add table button", () => {
    const mockUpdateMeetingTables = jest.fn();
    const component = shallow(
      <TableGridEditor tables={[]} updateMeetingTables={mockUpdateMeetingTables} />
    );
    const row = 3,
      col = 6;
    component.find(`#gridAddButton${row}-${col}`).first().simulate("click");
    expect(setDialog).toBeCalledWith({
      open: true,
      posX: toTablePos(row),
      posY: toTablePos(col),
    });
  });
});
