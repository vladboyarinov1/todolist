import React, {FC, useCallback, useEffect} from 'react';
import Grid from '@mui/material/Grid';
import {AddItemForm} from '../AddItemForm/AddItemForm';
import Paper from '@mui/material/Paper';
import {TodoList} from './TodoList/TodoList';
import {AppDispatchType, useAppDispatch, useAppSelector} from '../../state/store/store';
import {TodolistDomainType} from './todolists-reducer/todolists-reducer';
import {Navigate} from 'react-router-dom';
import {Box, CircularProgress} from '@mui/material';
import {RequestStatusType} from '../../App/app-reducer/app-reducer';
import {authSelectors} from '../../features/Auth';
import {todoListsSelector} from './selectors';
import {useActions} from '../../hooks/useActions/useActions';
import {tasksActions, todolistsActions} from './index';

export const TodoListsList: FC = () => {
    const { fetchTodolists} = useActions(todolistsActions)
    let todoLists = useAppSelector<TodolistDomainType[]>(todoListsSelector)
    let isLoggedIn = useAppSelector<any>(authSelectors.selectIsLoggedIn)
    let status = useAppSelector<RequestStatusType>(state => state.app.status)

    const dispatch = useAppDispatch()



    useEffect(() => {
        if (!isLoggedIn) return
        fetchTodolists()
    }, [])

    const addNewTodoList = useCallback(async (title: string) => {
        let thunk = todolistsActions.addTodolistTC(title)
        const resultActions = await dispatch(thunk)

        if (todolistsActions.addTodolistTC.rejected.match(resultActions)) {
            if (resultActions.payload?.errors?.length) {
                const errorMessage = resultActions.payload?.errors[0];
                throw new Error(errorMessage)
            } else {
                throw new Error('Some error occured')
            }
        }
        else {

        }
    }, [])

    const todoListsComponents = todoLists.map(tl => {
        return (
            <Grid key={tl.id} item>
                <Paper elevation={12}>
                    <TodoList todolist={tl} entityStatus={tl.entityStatus}/>
                </Paper>
            </Grid>
        )
    })

    if (!isLoggedIn) {
        return <Navigate to={'/auth'}/>
    }

    return (
        <>
            {status === 'loading' ? <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        minHeight: `calc(100vh - ${65}px)`,
                        alignItems: 'center',
                    }}>
                    <CircularProgress sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}/>
                </Box> :
                <div style={{paddingBottom: '20px'}}>
                    <Grid container sx={{p: '15px 0'}} style={{width: '300px'}}>
                        <AddItemForm addItem={addNewTodoList} label="todolist name"/>
                    </Grid>
                    <Grid container spacing={4}>{todoListsComponents}</Grid>
                </div>}
        </>
    );
};