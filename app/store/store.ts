import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import blogReducer from "./slice/blogSlice";
import departmentReducer from "./slice/departmentSlice";
import universityReducer from "./slice/universitySlice";
import collegeReducer from "./slice/collegeSlice";
import categoryReducer from "./slice/categorySlice";
import courseReducer from "./slice/courseSlice";
import othersPlaceReducer from "./slice/othersPlaceSlice";
import lessonReducer from "./slice/lessonSlice";
import reviewReducer from "./slice/reviewSlice";
import privateLessonReducer from "./slice/privateLessonSlice";
import researchReducer from "./slice/researchSlice";
import advertisementReducer from "./slice/advertisementSlice";

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
    lesson: lessonReducer,
    review: reviewReducer,
    privateLesson: privateLessonReducer,
    research: researchReducer,
    advertisement: advertisementReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

