import React, {FC, memo, useCallback, useEffect, useState} from 'react';
import {AddItemForm} from '../../AddItemForm/AddItemForm';
import {EditableSpan} from '../../EditableSpan/EditableSpan';
import s from './TodoList.module.css'
import {IconButton, Typography} from '@mui/material';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import {useAppDispatch, useAppSelector} from '../../../state/store/store';
import {
    FilterValueType,
} from '../todolists-reducer/todolists-reducer';
import {ButtonWithMemo} from '../../ButtonWithMemo/ButtonWithMemo';
import {Task} from './Task/Task';
import {TaskStatuses, TaskType, TodolistType} from '../../../api/todolist-api';
import {RequestStatusType} from '../../../App/app-reducer/app-reducer';

import {useActions} from '../../../hooks/useActions/useActions';
import {tasksActions, todolistsActions} from '../index';


type TodoListPropsType = {
    todolist: TodolistType
    entityStatus: RequestStatusType
}

export const TodoList: FC<TodoListPropsType> = memo(
    ({todolist, entityStatus}) => {
        const dispatch = useAppDispatch()
        const {id, title} = todolist
        const [filter, setFilter] = useState<FilterValueType>('all')
        let tasks = useAppSelector<TaskType[]>(state => state.tasks[id])
        const {fetchTasks, addTaskTC,} = useActions(tasksActions)

        const {deleteTodolistTC, changeTodolistFilter, updateTodolistTC} = useActions(todolistsActions)

        useEffect(() => {
            fetchTasks(id)
        }, [dispatch, id])

        const removeTodolist = () => deleteTodolistTC(id)

        const onClickChangeFilter = useCallback((filter: FilterValueType) => {
            changeTodolistFilter({filter, id})
            setFilter(filter)
        }, [dispatch, id])

        const addTask = useCallback((title: string) => addTaskTC({todolistId: id, title}), [id])

        const changeTodoListTitle = useCallback((title: string) => {
            updateTodolistTC({id, title})
        }, [id])

        const getFilterValues = useCallback((tasksList: Array<TaskType>, filterValue: FilterValueType) => {
            switch (filterValue) {
                case 'active':
                    return tasksList?.filter(t => t.status === TaskStatuses.New)
                case 'complete':
                    return tasksList?.filter(t => t.status === TaskStatuses.Completed)
                default:
                    return tasksList
            }
        }, [])

        const renderFilterButton = (title: string, currenFilter: FilterValueType,) => {
            return (<ButtonWithMemo title={title} variant={'contained'} size={'small'}
                                    color={filter === currenFilter ? 'secondary' : 'primary'}
                                    onClick={() => onClickChangeFilter(currenFilter)}/>)
        }

        let tasksForRender: TaskType[] = getFilterValues(tasks, filter)
        const tasksList = tasksForRender?.length ? tasksForRender?.map(t => <Task key={t.id} todolistId={id}
                                                                                  entityStatus={t.entityStatus}
                                                                                  task={t}/>) :
            <div className={s.emptyTasksText}>Task list is empty</div>

        return (
            <div className={entityStatus === 'loading' ? `${s.todolist} ${s.disabledTodos}` : s.todolist}>
                <Typography variant="h5" align="center" fontWeight="bold" padding="10px 0"
                            style={{width: '300px', wordWrap: 'break-word'}}>
                    <EditableSpan title={title} changeTitle={changeTodoListTitle}/>
                    <IconButton onClick={removeTodolist}
                                size={'small'}
                    ><RestoreFromTrashIcon/></IconButton>
                </Typography>
               <div className={s.addItemFormWrapper}>
                   <AddItemForm addItem={addTask} label={'task name'} disabled={entityStatus === 'loading'}/>
               </div>

                <div className={s.tasksListContainer}>
                    {tasksList}
                </div>

                <div className={s.btnFilterContainer}>
                    {renderFilterButton('All', 'all')}
                    {renderFilterButton('Active', 'active')}
                    {renderFilterButton('Complete', 'complete')}
                </div>
            </div>
        );
    });
