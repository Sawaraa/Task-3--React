import { useIntl } from 'react-intl';
import Typography from 'components/Typography';
import Card from "../../../components/Card";
import {Box, Button, CardHeader, CircularProgress, Container, Divider, Snackbar} from "@mui/material";
import CardContent from "../../../components/CardContent";
import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchBooks} from "../../../app/actions/book";
import * as pages from "../../../constants/pages";
import {Link, useSearchParams} from "react-router-dom";
import pageURLs from 'constants/pagesURLs';
import ConfirmDeleteBook from "../../../app/components/ConfirmDeleteBook";
import { useParams, useNavigate } from 'react-router-dom';
import SkeletonCard from "../../../app/components/SkeletonCard";
import PaginationRounded from "../../../app/components/PaginationRounded";
import GenreFilter from "../../../app/components/GenreFilter";


function Book() {
    const { formatMessage } = useIntl();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

    const { list, isFetchingBooks } = useSelector((state) => state.book);
    const [id, setId] = useState("")

    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const selectedGenre = searchParams.get('genre') || 'all'
    const itemsPerPage = 6;
    const genres = [...new Set(list.map(book => book.genre))].sort();
    const filteredBooks = selectedGenre === 'all' ? list : list.filter(book => book.genre.toLowerCase() === selectedGenre.toLowerCase());
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
    const currentItems = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        dispatch(fetchBooks());

    }, [dispatch])

    const handleDeleteConfirm = () => {
        const storageData = JSON.parse(localStorage.getItem("BOOKS_STORAGE")) || [];
        const updatedData = storageData.filter((book) => String(book.id) !== String(id));

        localStorage.setItem("BOOKS_STORAGE", JSON.stringify(updatedData));

        dispatch({ type: 'RECEIVE_BOOKS', payload: updatedData });

        setIsDialogOpen(false);
        setIsSnackbarOpen(true);
    };

    const handleClickOpen = (bookId) => {
        setId(bookId);
        setIsDialogOpen(true);
    };


    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const onChangeGenre = (newGenre) => {
        const params = new URLSearchParams(searchParams);
        params.set('genre', newGenre);
        params.set('page', '1'); // Скидаємо на 1 сторінку при зміні фільтру
        setSearchParams(params);
    };


    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setIsSnackbarOpen(false);
    };

    if(isFetchingBooks){
        return <SkeletonCard />;
    }

    return (
        <div>

            <Container sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate(`${pageURLs[pages.bookDetailsPage]}/create`)}
                        sx={{
                            background: "#027f0b",
                            padding: "8px 24px",
                            "&:hover": {
                                background: "#015c08",
                            }
                        }}
                    >
                        Додати книгу
                    </Button>
                </Box>

                <Typography variant="title">Каталог книг</Typography>


                <GenreFilter genres={genres} onChangeGenre={onChangeGenre} selectedGenre={selectedGenre}/>

                {currentItems.length === 0 && !isFetchingBooks && (
                    <p style={{ fontWeight: "bold", fontSize: 24, color: "#000" }}>
                        Нічого не знайдено у вибраному жанрі - <Typography variant="title">{selectedGenre}</Typography></p>)
                }

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 4,
                    marginTop: 4,
                    gridAutoRows: '1fr'
                }}>
                    {currentItems.map((book) => (
                        <Link key={book.id}
                            to={`${pageURLs[pages.bookDetailsPage]}/${book.id}`}
                              style={{
                                  textDecoration: 'none',
                                  color: 'inherit',
                                  display: 'block',
                                  position: 'relative',
                                  border: '1px solid #027f0b',
                                  borderRadius: "14px",
                                  transition: 'box-shadow 0.3s',
                                  overflow: 'hidden',
                                  height: '100%',
                                  '&:hover': { boxShadow: 6 }

                              }}
                        >
                        <Card>
                            <Box
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleClickOpen(book.id)
                                }}
                                className="delete-btn"
                                sx={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                    zIndex: 999,
                                    borderRadius: '50%',
                                    width: 35,
                                    height: 35,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
                                    background: "white",
                                    cursor: 'pointer',

                                    opacity: 0,
                                    transition: 'opacity 0.2s ease-in-out',

                                    '&:hover': {
                                            background: '#f0f0f0',
                                        }
                                }}
                            >
                                🗑️
                            </Box>

                            <CardHeader
                                title={book.title}
                                titleTypographyProps={{
                                    sx: {
                                        fontWeight: 800,
                                        fontSize: '1.2rem',
                                        color: "#027f0b",
                                    },
                                    variant: 'h4',
                                    component: 'div'
                                }}
                            />

                            <Divider />
                            <CardContent sx={{
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'box-shadow 0.3s',
                            }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <strong>Жанр: </strong> {book.genre}
                                </Typography>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h5" color="#000" sx={{ fontWeight: 'bold' }}>
                                        {book.description}
                                    </Typography>
                                </Box>

                            </CardContent>
                        </Card>
                        </Link>
                    ))}
                </Box>
                {totalPages >=1 && <PaginationRounded totalPages={totalPages} /> }
                <ConfirmDeleteBook
                    open={isDialogOpen}
                    onClose={handleCloseDialog}
                    onConfirm={handleDeleteConfirm}
                />
                <Snackbar
                    open={isSnackbarOpen}
                    autoHideDuration={4000}
                    onClose={handleCloseSnackbar}
                    message="Книга успішно видалена"
                />
            </Container>
        </div>
    );
}

export default Book;