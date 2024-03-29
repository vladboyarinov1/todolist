import { RequestStatus } from "features/Application/applicationSlice";
import { createAsyncThunk, createSlice, isPending, PayloadAction } from "@reduxjs/toolkit";
import { handleServerAppError } from "common/utils/handleServerAppError";
import { appActions } from "features/CommonActions/App";
import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { todolistsApi } from "features/TodolistsList/api/todolists/todolistsApi";
import { ResultCode } from "common/enums/enums";
import { Todolist } from "features/TodolistsList/api/todolists/todolistsApi.types";
import { createAppAsyncThunk } from "common/utils";

const { setLinearProgress } = appActions;

const fetchTodolists = createAsyncThunk("todolists/fetchTodolists", async () => {
    const res = await todolistsApi.getTodolists();
    return { todos: res.data };
});

const addTodolist = createAppAsyncThunk<{ todolist: Todolist }, string>(
    "todolists/addTodolist",
    async (title, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        const res = await todolistsApi.createTodolist(title);
        if (res.data.resultCode === ResultCode.OK) {
            return { todolist: res.data.data.item };
        } else {
            return rejectWithValue({
                errors: res.data.messages,
                fieldsErrors: res.data.fieldsErrors,
            });
        }
    },
);

const deleteTodolist = createAsyncThunk("todolists/deleteTodolist", async (id: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(changeTodosEntityStatus({ id, status: "loading" }));
    const res = await todolistsApi.deleteTodolist(id).finally(() => {
        dispatch(changeTodosEntityStatus({ id, status: "succeeded" }));
    });

    if (res.data.resultCode === ResultCode.OK) {
        return { id };
    } else {
        // handleServerAppError(res.data, thunkAPI);
        return rejectWithValue(res.data);
    }
});
const updateTodolist = createAsyncThunk(
    "todolists/updateTodolist",
    async (
        param: {
            id: string;
            title: string;
        },
        { rejectWithValue },
    ) => {
        const res = await todolistsApi.updateTodolistTitle(param.id, param.title);
        if (res.data.resultCode === ResultCode.OK) {
            return { title: param.title, id: param.id };
        } else {
            return rejectWithValue(res.data);
        }
    },
);

export const asyncActions = {
    fetchTodolists,
    addTodolist,
    deleteTodolist,
    updateTodolist,
};

export const slice = createSlice({
    name: "todolists",
    initialState: [] as TodolistDomain[],
    reducers: {
        changeTodolistFilter(
            state,
            action: PayloadAction<{
                filter: FilterValue;
                id: string;
            }>,
        ) {
            const index = state.findIndex((tl) => tl.id === action.payload.id);
            state[index].filter = action.payload.filter;
        },
        changeTodosEntityStatus(
            state,
            action: PayloadAction<{
                id: string;
                status: RequestStatus;
            }>,
        ) {
            const index = state.findIndex((tl) => tl.id === action.payload.id);
            if (index !== -1) {
                state[index].entityStatus = action.payload.status;
            }

            return state;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                return action.payload.todos.map((tl) => ({
                    ...tl,
                    filter: "all",
                    entityStatus: "idle",
                }));
            })
            .addCase(deleteTodolist.fulfilled, (state, action: any) => {
                // console.log(current(state));
                const index = state.findIndex((tl) => tl.id === action.payload.id);
                if (index !== -1) {
                    state.splice(index, 1);
                }
                return state;
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                if (action.payload) {
                    state.unshift({
                        ...action.payload.todolist,
                        filter: "all",
                        entityStatus: "idle",
                    });
                }
            })
            .addCase(updateTodolist.fulfilled, (state, action: any) => {
                const index = state.findIndex((tl) => tl.id === action.payload.id);
                if (index !== -1) {
                    state[index].title = action.payload.title;
                }
            });
    },
});

export const todolistsReducer = slice.reducer;
export const { changeTodolistFilter, changeTodosEntityStatus } = slice.actions;

// types
export type SetTodolistAT = ReturnType<typeof fetchTodolists.fulfilled>;

export type FilterValue = "all" | "active" | "complete";

export type TodolistDomain = Todolist & {
    filter: FilterValue;
    entityStatus: RequestStatus;
};
