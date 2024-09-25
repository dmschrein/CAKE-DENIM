// import {
//   TypedUseSelectorHook,
//   useDispatch,
//   useSelector,
//   Provider,
// } from "react-redux";

// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// /* REDUX STORE
//  * makeStore: a function to configure the Redux store using the persistedReducer and some middleware
//  * getDefaultMiddleware: retrieves the default middleware and disables serialization checks for Redux-Persist actions
//  * api.middleware: adds middleware from the api slice for handling asynchronous requests and caching
//  */
// export const makeStore = () => {
//   return configureStore({
//     reducer: persistedReducer,
//     middleware: (getDefaultMiddleware) =>
//       getDefaultMiddleware({
//         serializableCheck: {
//           ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//         },
//       }).concat(api.middleware),
//   });
// };

// /* REDUX TYPES
//  * AppStore: type of the Redux store created by makeStore
//  * RootState: type of the state in store.
//  * AppDispatch: type for dispatching actions to the store
//  * useAppDispatch & useAppSelector: Custom hooks that give you typed access to the dispatch function and Redux state in React components
//  */
// export type AppStore = ReturnType<typeof makeStore>;
// export type RootState = ReturnType<AppStore["getState"]>;
// export type AppDispatch = AppStore["dispatch"];
// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// /* PROVIDER
//  * StoreProvider: A React component that provides the Redux store and persistence to the app.
//  * storeRef: A useRef hook used to create the store only once (ensuring the store doesn't get recreated on every render)
//  * persistor: created using persistStore, manages persisting the store
//  * Provider: wraps the children with Redux's Provider which gives access to the Redux store in the app
//  * PersistGate: Ensures that the app's UI isn't rendered until the persisted state has been rehydrated
//  */
// export default function StoreProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const storeRef = useRef<AppStore>();
//   if (!storeRef.current) {
//     storeRef.current = makeStore();
//     setupListeners(storeRef.current.dispatch);
//   }
//   const persistor = persistStore(storeRef.current);

//   return (
//     <Provider store={storeRef.current}>
//       <PersistGate loading={null} persistor={persistor}>
//         {children}
//       </PersistGate>
//     </Provider>
//   );
// }
