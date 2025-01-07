import { createContext, useReducer } from "react";

interface NotifyProviderProps {
  children: React.ReactNode;
}

interface Notify {
  text: string;
  type: "success" | "error" | "info";
}

interface NotifyAction {
  type: "success" | "error" | "info" | "clear";
  payload: string;
}

interface NotifyContext {
  notify: Notify | null;
  dispatch: React.Dispatch<NotifyAction>;
}

const NotifyContext = createContext<NotifyContext>({} as NotifyContext);

const useReducerNotify = (state: Notify | null, action: NotifyAction): Notify | null => {
  switch (action.type) {
    case "success":
      return { text: action.payload, type: "success" };
    case "error":
      return { text: action.payload, type: "error" };
    case "info":
      return { text: action.payload, type: "info" };
    case "clear":
      return null;
    default:
      return state;
  }
}

const NotifyProvider: React.FC<NotifyProviderProps> = ({ children }) => {

  const [notify, dispatch] = useReducer(useReducerNotify, null);

  return (
    <NotifyContext.Provider value={{ notify, dispatch }}>
      {children}
    </NotifyContext.Provider>
  );

};

export { NotifyProvider, NotifyContext };