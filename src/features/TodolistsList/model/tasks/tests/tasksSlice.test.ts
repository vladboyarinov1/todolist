import { InitialState, tasksSlice } from "features/TodolistsList/model/tasks/tasksSlice";
import { asyncActions as tasksAsyncActions } from "features/TodolistsList/model/tasks/tasksSlice";
import { asyncActions as todolistsAsyncActions } from "features/TodolistsList/model/todolists/todolistsSlice";
import { TaskEntityStatus, TaskPriorities, TaskStatuses } from "common/enums/enums";

describe("todolistReducer", () => {
    let startState: InitialState;
    beforeEach(() => {
        startState = {
            todolistId1: [
                {
                    id: "1",
                    title: "CSS",
                    status: TaskStatuses.New,
                    startDate: "",
                    deadline: "",
                    addedDate: "",
                    order: 0,
                    priority: TaskPriorities.Low,
                    todoListId: "todolistId1",
                    description: "",
                    entityStatus: TaskEntityStatus.Expectation,
                },
            ],
            todolistId2: [
                {
                    id: "1",
                    title: "bread",
                    status: TaskStatuses.New,
                    startDate: "",
                    deadline: "",
                    addedDate: "",
                    order: 0,
                    priority: TaskPriorities.Low,
                    todoListId: "todolistId2",
                    description: "",
                    entityStatus: TaskEntityStatus.Expectation,
                },
            ],
        };
    });

    test("correct task should be deleted from correct array", () => {
        let param = { taskId: "1", todolistId: "todolistId2" };

        const action = tasksAsyncActions.removeTask.fulfilled(
            param,
            "",
            { taskId: "1", todolistId: "todolistId2" },
            "",
        );

        const endState = tasksSlice(startState, action);

        expect(endState["todolistId2"].length).toBeFalsy();
    });
    test("correct task should be added to correct array", () => {
        const action = tasksAsyncActions.addTask.fulfilled(
            {
                task: {
                    id: "4",
                    title: "juce",
                    status: TaskStatuses.New,
                    startDate: "",
                    deadline: "",
                    addedDate: "",
                    order: 0,
                    priority: TaskPriorities.Low,
                    todoListId: "todolistId1",
                    description: "",
                    entityStatus: TaskEntityStatus.Expectation,
                },
            },
            "requestId",
            {
                todolistId: "todolistId1",
                title: "juce",
            },
        );
        const endState = tasksSlice(startState, action);

        expect(endState["todolistId1"][0].title).toBe("juce");
        expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
    });
    test("status of specified task should be changed", () => {
        const data = {
            taskId: "2",
            model: { status: TaskStatuses.New },
            todolistId: "todolistId2",
        };
        const action = tasksAsyncActions.updateTask.fulfilled(data, "requestId", data);

        const endState = tasksSlice(startState, action);

        expect(endState["todolistId2"][0].status).toBeFalsy();
        expect(endState["todolistId1"][0].status).toBeFalsy();
    });

    test("title of specified task should be changed", () => {
        const data = {
            taskId: "1",
            model: { title: "newTitle" },
            todolistId: "todolistId1",
        };
        const action = tasksAsyncActions.updateTask.fulfilled(data, "", data);

        const endState = tasksSlice(startState, action);

        expect(endState["todolistId1"][0].title).toBe("newTitle");
        expect(endState["todolistId2"][0].title).toBe("bread");
    });
    test("new array should be added when new todolist is added", () => {
        const payload = {
            todolist: {
                id: "1",
                title: "T1",
                addedDate: "",
                order: 0,
            },
        };
        const action = todolistsAsyncActions.addTodolist.fulfilled(payload, "", "newTL");

        const endState = tasksSlice({}, action);

        const keys = Object.keys(endState);
        const newKey = keys.find((k) => k != "todolistId1" && k != "todolistId2");
        if (!newKey) {
            throw Error("new key should be added");
        }

        expect(keys.length).toBe(1);
        expect(endState[newKey]).toEqual([]);
    });

    test("property with todolistId should be deleted", () => {
        const action = todolistsAsyncActions.deleteTodolist.fulfilled({ id: "todolistId2" }, "", "todolistId2");

        const endState = tasksSlice(startState, action);
        const keys = Object.keys(endState);
        expect(keys.length).toBe(1);
        expect(endState["todolistId2"]).not.toBeDefined();
    });
    test("empty arrays should be added when we set todolist", () => {
        const payload = {
            todolist: {
                id: "1",
                title: "T1",
                addedDate: "",
                order: 0,
            },
        };
        const action = todolistsAsyncActions.addTodolist.fulfilled(payload, "", payload.todolist.title);

        const endState = tasksSlice(startState, action);
        const keys = Object.keys(endState);

        expect(keys.length).toBe(3);
        expect(endState["1"]).toStrictEqual([]);
        expect(endState["1"]).toStrictEqual([]);
    });
});
