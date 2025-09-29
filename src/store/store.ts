import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import localForage from "localforage";
import interviewReducer from "../features/intervieweeSlice";
import existingInterviewReducer from "../features/existingInterviewSlice";

const persistConfig = {
  key: "root",
  storage: localForage, // IndexedDB instead of localStorage
};

const rootReducer = combineReducers({
  interview: interviewReducer,
  existingInterview: existingInterviewReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;