import { appActions } from "features/CommonActions/App";

import { ResponseType } from "common/types/commonTypes";

type ThunkAPIType = {
    dispatch: (action: any) => any;
    rejectWithValue: Function;
};
// generic function
export const handleServerAppError = <D>(
    data: ResponseType<D>,
    thunkAPI: ThunkAPIType,
) => {
    if (data.messages.length) {
        thunkAPI.dispatch(appActions.setError({ error: data.messages[0] }));
    } else {
        thunkAPI.dispatch(
            appActions.setError({ error: "Some error occurred" }),
        );
    }
    thunkAPI.dispatch(appActions.setLoadingStatus({ status: "failed" }));
};
