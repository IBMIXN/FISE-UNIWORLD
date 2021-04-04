import { act, renderHook } from "@testing-library/react-hooks";
import { useReducerState } from "../customHooks";

describe("customHooks utils test", () => {
  it("useReducerState should work correctly", () => {
    const { result, rerender } = renderHook(() =>
      useReducerState({ mockStateA: true, mockStateB: 0 })
    );
    let [state, setState] = result.current;
    expect(state).toEqual({ mockStateA: true, mockStateB: 0 });
    act(() => {
      setState({ mockStateA: false });
    });
    rerender();
    [state, setState] = result.current;
    expect(state).toEqual({ mockStateA: false, mockStateB: 0 });
  });
});
