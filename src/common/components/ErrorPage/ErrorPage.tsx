import React from "react";
import s from "common/components/ErrorPage/ErrorPage.module.css";
import error404 from "common/img/404.svg";

export const Error404 = () => {
    return (
        <div id={"hw5-page-404"}>
            <div className={s.wrapper}>
                <img src={error404} alt={"404"} className={s.error404} />
            </div>
        </div>
    );
};
