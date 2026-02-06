import {
    RECEIVE_BOOKS,
    REQUEST_BOOKS,
    ERROR_BOOKS
} from '../constants/actionBookType';

const initialState = {
    list: [],            // Список книг
    errors: [],          // Помилки запитів
    isFetchingBooks: false, // Стан завантаження (як isFetchingUser у шаблоні)
};

const convertErrors = errors => errors.map(error => ({
    code: error.code,
    description: error.description,
}));

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case REQUEST_BOOKS: {
            return {
                ...state,
                isFetchingBooks: true,
            };
        }

        case RECEIVE_BOOKS: {
            return {
                ...state,
                list: action.payload,
                isFetchingBooks: false,
            };
        }

        case ERROR_BOOKS: {
            return {
                ...state,
                errors: convertErrors(action.payload),
                isFetchingBooks: false,
            };
        }

        default:
            return state;
    }
}