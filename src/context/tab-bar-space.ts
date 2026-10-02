import { createContext, useContext } from "react";

export const TabBarSpaceContext = createContext(false);
export const useTabBarSpace = () => useContext(TabBarSpaceContext);