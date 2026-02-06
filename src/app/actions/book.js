import axios from 'axios';
import config from 'config';
import {
    RECEIVE_BOOKS,
    REQUEST_BOOKS,
    ERROR_BOOKS
} from '../constants/actionBookType';

const BOOKS_STORAGE_KEY = 'MOCK_BOOKS_DATA';

const MOCK_BOOKS_RESPONSE = [
    { id: '5f2e8a1c-9b34-4d61-a7e2-1c8b92f4d5a0', title: 'Кобзар', author: 'Тарас Шевченко', genre: 'Поезія', description: "Збірка поетичних творів Тараса Шевченка, що відображає боротьбу українського народу за свободу, національну гідність і соціальну справедливість." },
    { id: 'd3c7b9e1-45af-4628-b103-f9a2e6b7c8d4', title: 'Маруся Чурай', author: 'Ліна Костенко', genre: 'Роман', description: "Історичний роман у віршах про трагічну долю Марусі Чурай, її кохання, творчість і життя України XVII століття." }
];


const receiveBooks = (books) => ({
    payload: books,
    type: RECEIVE_BOOKS,
});

const requestBooks = () => ({
    type: REQUEST_BOOKS,
});

const errorBooks = (errors) => ({
    payload: errors,
    type: ERROR_BOOKS,
});


const getBooks = () => {
    const {
        BOOKS_SERVICE,
    } = config;

    return axios.get(`${BOOKS_SERVICE}/books/get`);
};

// export const fetchBooks = () => (dispatch) => {
//     dispatch(requestBooks());
//
//     return getBooks()
//         .then(({ data: serverBooks }) => {
//             localStorage.setItem('BOOKS_STORAGE', JSON.stringify(serverBooks));
//             dispatch(receiveBooks(serverBooks));
//         })
//         .catch(() => {
//             const localData = localStorage.getItem('BOOKS_STORAGE');
//
//             if (localData) {
//                 const data = JSON.parse(localData);
//                 dispatch(receiveBooks(data));
//             } else {
//                 localStorage.setItem('BOOKS_STORAGE', JSON.stringify(MOCK_BOOKS_RESPONSE));
//                 dispatch(receiveBooks(MOCK_BOOKS_RESPONSE));
//             }
//         });
// };

export const fetchBooks = () => (dispatch) => {
    dispatch(requestBooks());

    return getBooks()
        .then(({ data: serverBooks }) => {
            // Якщо сервер повернув дані, зберігаємо їх
            if (serverBooks && serverBooks.length > 0) {
                localStorage.setItem('BOOKS_STORAGE', JSON.stringify(serverBooks));
                dispatch(receiveBooks(serverBooks));
            } else {
                // Якщо сервер повернув пустий список, перевіряємо локальні дані
                throw new Error('Empty server data');
            }
        })
        .catch(() => {
            // Логіка відновлення даних
            const localData = localStorage.getItem('BOOKS_STORAGE');

            if (localData && JSON.parse(localData).length > 0) {
                // Якщо в стореджі щось є — беремо це
                dispatch(receiveBooks(JSON.parse(localData)));
            } else {
                // Якщо порожньо — примусово ставимо моки
                localStorage.setItem('BOOKS_STORAGE', JSON.stringify(MOCK_BOOKS_RESPONSE));
                dispatch(receiveBooks(MOCK_BOOKS_RESPONSE));
            }
        });
};

