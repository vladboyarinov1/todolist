import {AppRootStateType} from '../state/store/store';

export const selectIsInitialized = (state: AppRootStateType) => state.app.isInitialized;
export const selectIsLinearProgress = (state: AppRootStateType) => state.app.isLinearProgress;