import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import blogReducer from "./slice/blogSlice";
import departmentReducer from "./slice/departmentSlice";
import universityReducer from "./slice/universitySlice";
import collegeReducer from "./slice/collegeSlice";
import categoryReducer from "./slice/categorySlice";
import courseReducer from "./slice/courseSlice";
import othersPlaceReducer from "./slice/othersPlaceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    department: departmentReducer,
    university: universityReducer,
    college: collegeReducer,
    category: categoryReducer,
    course: courseReducer,
    othersPlace: othersPlaceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

