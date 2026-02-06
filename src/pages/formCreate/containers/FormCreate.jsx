import {useIntl} from "react-intl";
import {Box, Paper} from "@mui/material";
import Typography from "../../../components/Typography";
import { useParams, useNavigate } from 'react-router-dom';
import Button from "components/Button";

import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import {createUseStyles} from "react-jss";
import useTheme from "../../../misc/hooks/useTheme";

const getClasses = createUseStyles((theme) => ({
  buttons: {
    display: "flex",
    gap: `${theme.spacing(1)}px`,
    justifyContent: "center",
    marginTop: `${theme.spacing(5)}px`,
  },
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  contentHeader: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: `${theme.spacing(2)}px`,
    width: "600px",
  },
  dialogContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    gap: `${theme.spacing(2)}px`,
  },
}));


function FormCreate() {
  const { formatMessage } = useIntl();
  const { theme } = useTheme();
  const classes = getClasses({ theme });
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { title: '', author: '', genre: '', description: '' }
  });

  const onSubmit = async (data) => {
    try {
      const authorResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/author`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.author }),
        credentials: 'include'
      });

      if (!authorResponse.ok) throw new Error('Failed to create author');

      const authorData = await authorResponse.json();
      const createdAuthorId = authorData.id;
      const bookResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          genre: data.genre,
          authorId: createdAuthorId,
          published: new Date().toISOString().split('T')[0]
        }),
        credentials: 'include'
      });

      if (bookResponse.ok) {
        navigate('/books');
      }
    } catch (error) {
      console.error("Full error detail:", error);
      alert("Помилка: " + error.message);
    }
  };
  const handleClear = () => {
    reset({
      title: '',
      author: '',
      genre: '',
      description: ''
    });
  };
  return (
      <div className={classes.container}>
        <Button onClick={() => navigate(-1)}>
          <Typography color="inherit">
            <strong>{formatMessage({ id: "back" })}</strong>
          </Typography>
        </Button>

        <Paper sx={{ p: 3, mt: 2 }}>
              <form>
                <Typography variant="h5"><strong>{formatMessage({ id: "create" })}</strong></Typography>
                <TextField
                    fullWidth
                    label={formatMessage({ id: 'title' })}
                    {...register("title", { required: formatMessage({ id: "titleError" }) })}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    sx={{ mt: 2 }}
                />
                <TextField
                    fullWidth
                    label={formatMessage({ id: 'author' })}
                    {...register("author", { required: formatMessage({ id: "authorError" }) })}
                    error={!!errors.author}
                    helperText={errors.author?.message}
                    sx={{ mt: 2 }}
                />

                <TextField
                    fullWidth
                    label={formatMessage({ id: 'genre' })}
                    {...register("genre", {
                      required: formatMessage({ id: "genreError" })
                    })}
                    error={!!errors.genre}
                    helperText={errors.genre?.message}
                    sx={{ mt: 2 }}
                />

                <TextField
                    fullWidth
                    label={formatMessage({ id: 'description' })}
                    {...register("description", {
                      required: formatMessage({ id: "descriptionError" })
                    })}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    sx={{ mt: 2 }}
                />
                <div className={classes.buttons}>
                  <Button onClick={handleSubmit(onSubmit)} variant="secondary">
                    <Typography color="inherit">
                      <strong>{formatMessage({ id: "create" })}</strong>
                    </Typography>
                  </Button>
                  <Button type="button" onClick={handleClear}>
                    <strong>{formatMessage({ id: "cancel" })}</strong>
                  </Button>
                </div>
              </form>

        </Paper>
      </div>
  );

}

export default FormCreate;