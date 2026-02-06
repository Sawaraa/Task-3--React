import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useForm} from "react-hook-form";

export default function AddBookDialog({ open, onClose }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()


    const onSubmit = (data) => {
        console.log(data)
        localStorage.setItem('book', JSON.stringify(data))

        onClose()
    }
    return (
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Add Book</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Plase added book in collecion
                    </DialogContentText>
                    <form onSubmit={handleSubmit(onSubmit)} id="subscription-form">
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="title"
                            name="title"
                            label="Title book"
                            type="text"
                            fullWidth
                            variant="standard"
                            {...register("title", { required: "Назва обов'язкова" })}
                            // 5. Виводимо помилку, якщо вона є
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        />
                        <TextField
                            required
                            margin="dense"
                            id="author"
                            name="author"
                            label="Author book"
                            type="text"
                            fullWidth
                            variant="standard"
                            {...register("author", { required: "Автор обов'язковий" })}
                        error={!!errors.author}
                        helperText={errors.author?.message}
                        />
                        <TextField
                            required
                            margin="dense"
                            id="genre"
                            name="genre"
                            label="Genre"
                            type="text"
                            fullWidth
                            variant="standard"
                            {...register("genre", { required: "Жанр обов'язковий" })}
                            error={!!errors.genre}
                            helperText={errors.genre?.message}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" form="subscription-form">
                        Add Book
                    </Button>
                </DialogActions>
            </Dialog>
    )
}