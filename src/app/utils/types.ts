export interface Event {
  id: string;
  title: string;
  description?: string;
  venue: string;
  date: string; 
  startTime: string; 
  endTime: string;
}

export type Action =
  | { type: "INIT"; payload: Event[] }
  | { type: "ADD"; payload: Event }
  | { type: "UPDATE"; payload: Event }
  | { type: "DELETE"; payload: string };
