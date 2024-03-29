import React, { useEffect, useState } from "react";
import "../common/fonts/Nunito/myfont.ttf";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import { CircularProgress, LinearProgress } from "@mui/material";
import { ErrorSnackbar } from "common/components/ErrorSnackbar/ErrorSnackbar";
import { Navigate, Route, Routes } from "react-router-dom";
import { TodoListsList } from "features/TodolistsList/ui/TodolistsList";
import { Error404 } from "common/components/ErrorPage/ErrorPage";
import LogoutIcon from "@mui/icons-material/Logout";
import { appSelectors } from "../features/Application";
import { Auth, authAction, authSelectors } from "../features/Auth";
import { useActions } from "common/hooks/useActions";

import { useAppSelector } from "common/hooks/useAppSelector";
import { TaskType } from "features/TodolistsList/api/tasks/tasksApi.types";

export type TasksState = Record<string, TaskType[]>;

const App = (): JSX.Element => {
    const { logout, initializeApp } = useActions(authAction);

    let isInitialized = useAppSelector(appSelectors.selectIsInitialized);
    let isLoginIn = useAppSelector(authSelectors.selectIsLoggedIn);
    const isLinearProgress = useAppSelector(appSelectors.selectIsLinearProgress);

    useEffect(() => {
        initializeApp();
    }, []);

    const logoutHandler = () => {
        logout();
    };

    const [isDark, setDarkMode] = useState<boolean>(false);

    const mode = isDark ? "dark" : "light";

    const customTheme = createTheme({
        typography: {
            fontFamily: "Nunito",
        },
        palette: {
            primary: {
                main: "#1976d2",
            },
            secondary: {
                main: "#ef5350",
            },
            mode: mode,
        },
    });

    if (!isInitialized) {
        return (
            <div
                style={{
                    position: "fixed",
                    top: "30%",
                    textAlign: "center",
                    width: "100%",
                }}
            >
                <CircularProgress />
            </div>
        );
    }

    return (
        <>
            <ThemeProvider theme={customTheme}>
                <CssBaseline />
                <div>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                TodoLists
                            </Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Switch onChange={(e) => setDarkMode(e.currentTarget.checked)} />}
                                    label={isDark ? "dark mode" : "light mode"}
                                />
                            </FormGroup>
                            {isLoginIn && (
                                <Button onClick={logoutHandler} color="inherit">
                                    <LogoutIcon />
                                </Button>
                            )}
                        </Toolbar>
                    </AppBar>
                    {isLinearProgress && <LinearProgress />}
                    <Container fixed>
                        <Routes>
                            <Route path={"/"} element={<TodoListsList />} />
                            <Route path={"/auth"} element={<Auth />} />
                            <Route path={"/404"} element={<Error404 />} />
                            <Route path={"*"} element={<Navigate to={"/404"} />} />
                        </Routes>
                    </Container>
                    <ErrorSnackbar />
                </div>
            </ThemeProvider>
        </>
    );
};

export default App;
