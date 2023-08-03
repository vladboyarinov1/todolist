import React, {useEffect, useState} from 'react';
import './App.css';
import '../fonts/Nunito/myfont.ttf'
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {ThemeProvider} from '@emotion/react';
import {createTheme} from '@mui/material/styles';

import {AppDispatchType, useAppDispatch, useAppSelector} from '../store/store';
import {TaskType} from '../api/todolist-api';
import {RequestStatusType} from './app-reducer';
import {Box, CircularProgress} from '@mui/material';
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar';
import {Navigate, Route, Routes} from 'react-router-dom';
import {Login} from '../features/Login/Login';
import {TodolistsList} from '../components/TodolistsList/TodolistsList';
import {Error404} from '../components/ErrorPage/ErrorPage';
import {initializeAppTC, logoutTC, setIsInitializedAC} from '../reducers/auth-reducer/auth-reducer';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

export type TasksStateType = { // стейт с тасками
    [todoListId: string]: TaskType[]
}

const App = (): JSX.Element => {


    let isInitialized = useAppSelector(state => state.auth.isInitialized)

    const dispatch: AppDispatchType = useAppDispatch()

    let isLoginIn = useAppSelector<any>(state => state.auth.isLoggedIn)

    useEffect(() => {
        dispatch(initializeAppTC())
    }, []);

    const logoutHandler = () => {
        dispatch(logoutTC())
    }

    // useEffect(() => {// диспатчим санку, она попадет в Redux
    //     if (!isLoginIn) {
    //         return
    //     }
    //     dispatch(getTodolistTC())
    // }, [])

    const [isDark, setDarkMode] = useState<boolean>(false)

    const mode = isDark ? 'dark' : 'light'

    const customTheme = createTheme({
        typography: {
            fontFamily: 'Nunito'
        },
        palette: {
            primary: {
                main: '#1976d2',
            },
            secondary: {
                main: '#ef5350',
            },
            mode: mode,
        },
    })

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <>
            <ThemeProvider theme={customTheme}>
                <CssBaseline/>
                <div>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{mr: 2}}
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                                TodoLists
                            </Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Switch onChange={(e) => setDarkMode(e.currentTarget.checked)}/>}
                                    label={isDark ? 'dark mode' : 'light mode'}/>
                            </FormGroup>
                            {
                                isLoginIn && <Button onClick={logoutHandler} color="inherit"><LogoutIcon /></Button>
                            }
                        </Toolbar>
                    </AppBar>
                    <Container fixed>
                        <Routes>
                            <Route path={'/'} element={<TodolistsList/>}/>
                            <Route path={'/login'} element={<Login/>}/>
                            <Route path={'/404'} element={<Error404/>}/>
                            <Route path={'*'} element={<Navigate to={'/404'}/>}/>
                        </Routes>
                    </Container>
                    {/*}*/}
                    <ErrorSnackbar/>

                </div>
            </ThemeProvider>
        </>
    );
}

export default App;