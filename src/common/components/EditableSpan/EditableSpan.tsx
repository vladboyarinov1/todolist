import React, { ChangeEvent, memo, useState } from "react";
import { TextField } from "@mui/material";

type Props = {
    title: string;
    changeTitle: (title: string) => void;
};

export const EditableSpan = memo(({ title, changeTitle }: Props) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [localTitle, setTitle] = useState<string>(title);

    const changeLocalTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
    };

    const onEditMode = () => {
        setEditMode(true);
    };
    const offEditMode = () => {
        setEditMode(false);
        changeTitle(localTitle); // передаем новое название в функцию
    };

    return editMode ? (
        <TextField
            onChange={changeLocalTitle}
            onBlur={offEditMode}
            value={localTitle}
            size="small"
            variant="standard"
            multiline
        /> // title но уже пропущенный через локальный стейт
    ) : (
        <span style={{ maxWidth: "210px", wordWrap: "break-word" }} onDoubleClick={onEditMode}>
            {title}
        </span>
    );
});
