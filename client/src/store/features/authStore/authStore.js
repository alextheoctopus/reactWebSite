import { createSlice } from "@reduxjs/toolkit";

// здесь создаем объект ,который будет хранить данные об авторизации пользователя
//он содержит начальные значения данных и все методы ,которы позволяют эти данные менять

export const authStore = createSlice({
    name: "auth",//это аргументы функции createSlice
    initialState: {//опред стурктуру данных и их начальные значения
        username: 'undeeeefined',//имя чувачка-это как бы пропс из App.js
        status: false,//по умолчанию не авторизирован
    },
    reducers: {//ф-ии которые будут менять данные я еще их не продумала
        logining: (state, data) => {
            state.username =data;//<--props, а как тут без пропсов ? мне имя нужно засунуть
            state.status = true;
        },
        logouting: (state) => {
            state.username = '';
            state.status = false;
        }
    }
});


export const { logining, logouting }= authStore.actions

export default authStore.reducer;