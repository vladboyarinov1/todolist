import axios from 'axios';
import {FilterValueType} from '../reducers/todolist-reducer/todolists-reducer';

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
//T - Type, прилетает динамически
type ResponseType<T = {}> = {
    resultCode: number
    fieldsErrors: []
    messages: string[],
    data: T
}

export enum TaskStatuses {
    New,
    InProgress,
    Completed,
    Draft
}

export enum TaskPriorities {
    Low,
    Middle,
    Hi,
    Urgently,
    Later
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}


//все тот же axios.method просто с значениями по умолчанию
const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true
})
//первая точка входа данных
export const TodolistApi = {

    getTodolists() {
        // return axios.get(`${baseUrl}todo-lists`, settings) //сразу в состоянии pending
        return instance.get<TodolistType[]>(`todo-lists`)// типизируем данные с бэка
        //возвращает Promise
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>(`todo-lists`, {title: title})
    },
    deleteTodolist(id: string) {
        return instance.delete<ResponseType>(`todo-lists/${id}`)
    },
    updateTodolistTitle(id: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${id}`, {title})
    },
    getTasks(todolistId: string) {
        return instance.get<TaskType[]>(`/todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<TaskType>>(`/todo-lists/${todolistId}/tasks`, {title: title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, title: string) {
        return instance.put<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`, {title: title})
    }

}
