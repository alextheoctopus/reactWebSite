import { configureStore } from "@reduxjs/toolkit";
import authStore from "./features/authStore/authStore";
export default configureStore(
    {
        reducer: {
            auth:authStore,
        }
    }
);