import {
    addTodolistAC,
    AddTodolistAT, changeTodolistFilterAC, ChangeTodolistFilterAT, changeTodoListTitleAC,
    removeTodolistAC,
    RemoveTodolistAT, TodolistDomainType, todolistsReducer

} from './todolists-reducer';
import {TodolistType} from '../../api/todolist-api';

describe('todolistReducer', () => {
    let initialState: TodolistDomainType[];
    beforeEach(() => {
        initialState = [
            {id: '1', title: 'First Todo List', filter: 'all', addedDate: '', order: 0},
            {id: '2', title: 'Second Todo List', filter: 'all', addedDate: '', order: 0}
        ];
    });

    test('should remove a todolist from the state', () => {

        const action: RemoveTodolistAT = removeTodolistAC('2');
        const expectedState = [
            {id: '1', title: 'First Todo List', filter: 'all', addedDate: '', order: 0},
        ];

        const newState = todolistsReducer(initialState, action);

        expect(newState).toEqual(expectedState);
    });
    test('should add a new todolist to the state', () => {
        const action: AddTodolistAT = addTodolistAC('New Todo List');

        const expectedState = [
            ...initialState,
            {id: expect.any(String), title: 'New Todo List', filter: 'all', addedDate: '', order: 0}
        ];

        const newState = todolistsReducer(initialState, action);

        expect(newState).toEqual(expectedState);
        expect(newState[2].id).toHaveLength(36);
        expect(newState.length).toBe(3)
    });
    test('todolist should change the title', () => {

        const action = changeTodoListTitleAC('newTitleForTodolistWithID2', '2')
        const expectedState = [
            {id: '1', title: 'First Todo List', filter: 'all', addedDate: '', order: 0},
            {id: '2', title: 'newTitleForTodolistWithID2', filter: 'all', addedDate: '', order: 0}
        ];

        const newState = todolistsReducer(initialState, action);

        expect(newState[1].title).toBe('newTitleForTodolistWithID2')
    })
    test('todolist should change the filter', () => {
        const action: ChangeTodolistFilterAT = changeTodolistFilterAC('active', '2')
        const expectedState = [
            {id: '1', title: 'First Todo List', filter: 'all', addedDate: '', order: 0},
            {id: '2', title: 'Second Todo List', filter: 'active', addedDate: '', order: 0}
        ];

        const newState = todolistsReducer(initialState, action)

        expect(newState[1].filter).toBe('active')

    })
});