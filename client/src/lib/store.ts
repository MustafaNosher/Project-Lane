import { configureStore } from '@reduxjs/toolkit';
import {useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from "react-redux";


import authReducer from './slices/authSlice';
import workspaceReducer from './slices/workspaceSlice';
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
    projects: projectReducer,
    tasks: taskReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;