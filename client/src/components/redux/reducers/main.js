import { getProductsReducers } from "./Productreducers";

import {combineReducers} from "redux";

const rootReducer = combineReducers({
    getproductsdata : getProductsReducers
});

export default rootReducer;