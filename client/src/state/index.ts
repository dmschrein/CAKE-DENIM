import { createSlice, PayloadAction } from "@reduxjs/toolkit";

{
  /* 
  * Redux slice that manages two pieces of state: whether the sidebar is 
  * collapsed and whether dark mode is active. It includes a reducer to toggle the sidebar's state
  * A slice in Redux Toolkit represents a single "slice" or portion of the global Redux state. 
  * It includes the following key parts:
  * State: This defines the initial state of the slice. For example, in the globalSlice.ts file, 
  * the initial state contains isSidebarCollapsed and isDarkMode, which track the state of the sidebar and dark mode.
  * Reducers: These are functions that define how the state will change in response to actions. For example:
  
  Defines the structure of the state managed by the slice 
  */
}
export interface InitialStateTypes {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
}

const initialState: InitialStateTypes = {
  isSidebarCollapsed: false,
  isDarkMode: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  /* This reducer function listens for an action of type setIsSidebarCollapsed and updates the isSidebarCollapsed value based on the action's payload. */
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
  },
});

export const { setIsSidebarCollapsed } = globalSlice.actions;

export default globalSlice.reducer;
