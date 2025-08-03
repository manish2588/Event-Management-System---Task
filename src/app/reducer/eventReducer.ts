
import { Event,Action } from "../utils/types";
export function eventReducer(state: Event[], action: Action): Event[] {
  switch (action.type) {
    case "INIT":
      return action.payload;
    case "ADD":
      return [...state, action.payload];
    case "UPDATE":
      return state.map((e) =>
        e.id === action.payload.id ? action.payload : e
      );
    case "DELETE":
      return state.filter((e) => e.id !== action.payload);
    default:
      return state;
  }
}
