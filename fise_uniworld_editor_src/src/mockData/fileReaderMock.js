export default class FileReaderMock {
  onerror = jest.fn();
  onload = jest.fn();
  addEventListener = (_, fn) => fn({ target: { result: {} } });
  readAsDataURL = jest.fn();
}
