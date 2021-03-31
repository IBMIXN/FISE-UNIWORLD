const mongoose = require("mongoose");
const { loadDatabase } = require("./database");

jest.mock("mongoose");

describe("Database", () => {
  const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
  const processExit = jest.spyOn(process, "exit").mockImplementation(() => {});

  it("should successfully connect to database in test env", async () => {
    const connect = jest
      .spyOn(mongoose, "connect")
      .mockImplementationOnce((uris, options, callback) => {
        return Promise.resolve(mongoose);
      });
    await loadDatabase();
    expect(connect).toBeCalled();
  });

  it("should log error and exit if it fails to connect to database in test env", async () => {
    const connect = jest
      .spyOn(mongoose, "connect")
      .mockImplementationOnce((uris, options, callback) => {
        if (callback) {
          callback("mockError");
        }
        return Promise.resolve(mongoose);
      });
    await loadDatabase();
    expect(connect).toBeCalled();
    expect(consoleError).toBeCalledWith("mockError");
    expect(processExit).toBeCalledWith(1);
  });

  it("should successfully connect to database in dev env", async () => {
    process.env.NODE_ENV = "dev";
    const connect = jest
      .spyOn(mongoose, "connect")
      .mockImplementationOnce((uris, options, callback) => {
        return Promise.resolve(mongoose);
      });
    await loadDatabase();
    expect(connect).toBeCalled();
    process.env.NODE_ENV = "test";
  });
});
