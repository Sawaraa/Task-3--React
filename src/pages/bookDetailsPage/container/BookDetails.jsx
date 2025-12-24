import {useIntl} from "react-intl";
import Card from "../../../components/Card";
import {Box, Button, CardHeader, Container, Divider, IconButton, Paper} from "@mui/material";
import Typography from "../../../components/Typography";
import CardContent from "../../../components/CardContent";
import React, {useEffect, useState} from "react";
import { useParams, useNavigate } from 'react-router-dom';
import pageURLs from "../../../constants/pagesURLs";
import * as pages from "../../../constants/pages";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import {useDispatch} from "react-redux";

const BookDetails = () => {
     const { formatMessage } = useIntl();
     const {id} = useParams();
    const navigate = useNavigate();
    const isCreateBook = id === 'create';
    const [isEditing, setIsEditing] = useState(isCreateBook);
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { title: '', author: '', genre: '', description: '' }
    });
    const dispatch = useDispatch();


    const [bookDetails, setBookDetails] = useState(null);


    useEffect(() => {
        if (isCreateBook) return;

        const storage = JSON.parse(localStorage.getItem("BOOKS_STORAGE")) || [];
        const book = storage.find(b => String(b.id) === String(id));

        if (book) {
            setBookDetails(book);
            reset(book);
        }
    }, [id, isCreateBook, reset]);

    const onSubmit = (data) => {
        const storage = JSON.parse(localStorage.getItem("BOOKS_STORAGE")) || [];

        const updatedList = isCreateBook
            ? [...storage, { ...data, id: crypto.randomUUID() }]
            : storage.map(b => String(b.id) === String(id) ? { ...b, ...data } : b);

        localStorage.setItem("BOOKS_STORAGE", JSON.stringify(updatedList));

        dispatch({ type: 'RECEIVE_BOOKS', payload: updatedList });
        navigate(-1);
    };

    const handleCancel = () => {
        if (isCreateBook) {
            navigate(-1);
        } else {
            setIsEditing(false);
        }
    };

     return (
        <Container
            sx={{
                py: 4,
                marginTop: 3,
        }}
        >
            <Button
                onClick={() => navigate(-1)}
                sx={{
                    color: "#000",
                    border: "1px solid gray",
                    marginBottom: 3,
                    padding: "4px 16px",
            }}
            >
                Назад</Button>

            <Paper sx={{ p: 3, mt: 2 }}>
                {!isEditing && (
                    <IconButton onClick={() => setIsEditing(true)} sx={{ position: 'absolute', top: 100, right: 20 }}>✏️</IconButton>
                )}

                {isEditing ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Typography variant="h5">{isCreateBook ? 'Створення' : 'Редагування'}</Typography>

                        <TextField
                            fullWidth
                            label="Назва"
                            {...register("title", { required: "Назва обов'язкова" })}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Автор"
                            {...register("author", { required: "Автор обов'язковий" })}
                            error={!!errors.author}
                            helperText={errors.author?.message}
                            sx={{ mt: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Жанр"
                            {...register("genre", {
                                required: "Опис обов'язковий",
                            })}
                            error={!!errors.genre}
                            helperText={errors.genre?.message}
                            sx={{ mt: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Опис"
                            {...register("description", {
                                required: "Опис обов'язковий",
                            })}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            sx={{ mt: 2 }}
                        />

                        <Box sx={{ mt: 3 }}>
                            <Button type="submit" variant="contained">
                                {isCreateBook ? 'Створити' : 'Зберегти'}
                            </Button>
                            <Button onClick={handleCancel}>Скасувати</Button>
                        </Box>
                    </form>
                ) : (
                    <Box
                        sx={{ display: "flex",
                              flexDirection: "column",
                              gap: 4,
                              border: "1px solid gray",
                              padding: "10px 26px",
                        }}
                    >
                        <Typography
                            color="black"
                            variant= "title"
                            >Назва: {bookDetails?.title}</Typography>
                        <Typography color="gray"
                                    variant= "title"
                        >Автор: {bookDetails?.author}</Typography>
                        <Typography color="gray"
                                    variant= "title"
                        >Жанр: {bookDetails?.genre}</Typography>
                        <Typography color="gray"
                                    variant= "title"
                        >Опис: {bookDetails?.description}</Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );

}

export default BookDetails;