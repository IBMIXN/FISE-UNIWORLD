import { validateEventRoom, validateLectureRoom } from "../validate";
import { mockEventRoom } from "../../mockData/eventRoomMock";
import { mockLectureRoom } from "../../mockData/lectureRoomMock";

describe("validate utils test", () => {
  it("validateEventRoom should work correctly", () => {
    expect(validateEventRoom(mockEventRoom)).toEqual(true);
  });

  it("validateLectureRoom should work correctly", () => {
    expect(validateLectureRoom(mockLectureRoom)).toEqual(true);
  });
});
