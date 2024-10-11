// src/app/store.ts

import { useRef } from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  Provider,
} from "react-redux";
import globalReducer from "@/state";
import { api } from "@/state/api"; // Ensure this is imported correctly
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { cartSlice } from "@/state/features/cartSlice";

// Fallback storage for SSR environment
const createNoopStorage = () => ({
  getItem(): Promise<string | null> {
    return Promise.resolve(null);
  },
  setItem(): Promise<void> {
    return Promise.resolve();
  },
  removeItem(): Promise<void> {
    return Promise.resolve();
  },
});

const storage =
  typeof window === "undefined"
    ? createNoopStorage()
    : createWebStorage("local");

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["global", "cart"],
};

const rootReducer = combineReducers({
  global: globalReducer,
  cart: cartSlice.reducer, // add cart reducer to store
  [api.reducerPath]: api.reducer,
});

export type RootState = ReturnType<typeof rootReducer>; // Explicitly define RootState

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api.middleware),
  });
};
// Typed hooks for using dispatch and selector with Redux
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = () => useDispatch<AppDispatch>(); // used for sending an action to our Redux store
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // used for selecting part of our store data inside our component

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch);
  }
  const persistor = persistStore(storeRef.current);

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
