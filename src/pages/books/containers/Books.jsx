import { createUseStyles } from "react-jss";
import { useIntl } from "react-intl";
import {useNavigate, useSearchParams} from "react-router-dom";
import useTheme from "misc/hooks/useTheme";
import Button from "components/Button";
import Card from "components/Card";
import Pagination from "components/Pagination";
import * as pages from "../../../constants/pages";
import pageURLs from 'constants/pagesURLs';

import CardContent from "components/CardContent";
import CardTitle from "components/CardTitle";

import IconButton from "components/IconButton";
import Typography from "components/Typography";
import Edit from "components/icons/Edit";
import Delete from "components/icons/Delete";
import { useState, useEffect } from "react";

const getClasses = createUseStyles((theme) => ({
  buttons: {
    display: "flex",
    gap: `${theme.spacing(1)}px`,
    justifyContent: "center",
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

function Books() {
  const { formatMessage } = useIntl();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const classes = getClasses({ theme });
  const [list, setList] = useState([]);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  // якщо потрібен лоадер:
  const [isFetchingBooks, setIsFetchingBooks] = useState(false);

const [searchParams, setSearchParams] = useSearchParams();

const currentPageFromUrl = parseInt(searchParams.get("page") || "1", 10);
const currentPage = currentPageFromUrl > 0 ? currentPageFromUrl : 1;

const itemsPerPage = 3;
const totalPages = Math.ceil(list.length / itemsPerPage);

const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentItems = list.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsFetchingBooks(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}api/book/list`, {
          credentials: 'include'
        });

        if (response.status === 401) {
          setIsUnauthorized(true);
          return;
        }

        if (!response.ok) throw new Error('Error');

        const data = await response.json();
        setList(data);
        setIsUnauthorized(false);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsFetchingBooks(false);
      }
    };

    fetchBooks();
  }, []);

useEffect(() => {
  if (totalPages > 0 && currentPage > totalPages) {
    setSearchParams({ page: "1" }, { replace: true });
  }
}, [currentPage, totalPages, setSearchParams]);

  const handleChangePage = (event, page) => {
    setSearchParams({ page: page.toString() });
  };

  // --- Шар Security (якщо 401) ---
  if (isUnauthorized) {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Typography variant="h5" color="error">
            {formatMessage({ id: 'pleaseLogin' }) || 'Для перегляду списку книг необхідно авторизуватися'}
          </Typography>

          <div style={{ marginTop: '20px' }}>
            <a
                href={`${process.env.REACT_APP_API_URL}/oauth2/authorization/google`}
                style={{ textDecoration: 'none' }}
            >
              <Button colorVariant="header" variant="text">
                <Typography color="inherit" variant="subtitle">
                  <strong>{formatMessage({ id: 'signIn' })}</strong>
                </Typography>
              </Button>
            </a>
          </div>
        </div>
    );
  }

  const handleDelete = async (id) => {
    if (!window.confirm(formatMessage({ id: "confirmDelete" }) || "Ви впевнені, що хочете видалити цю книгу?")) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/book/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        // Оновлюємо стан: фільтруємо список, видаляючи книгу з цим id
        setList((prevList) => prevList.filter((book) => book.id !== id));
        console.log(`Книга з id ${id} видалена`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Помилка при видаленні');
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Не вдалося видалити книгу: " + error.message);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.contentHeader}>
        <Typography variant="title" color="inherit">
          {formatMessage({ id: "titlePage" })}
        </Typography>
        <Button onClick={() => navigate(`${pageURLs[pages.formCreate]}`)}>
          <Typography color="inherit">
            <strong>{formatMessage({ id: "create" })}</strong>
          </Typography>
        </Button>
      </div>
      <div className={classes.content}>
        {currentItems.map((book) => (
          <Card key={book.id}>
            <CardTitle>
              <Typography variant="subTitle">
                {formatMessage({ id: "title" })}
              </Typography>
              <Typography variant="title" color="grey">
                <strong>{book.title}</strong>
              </Typography>
              <div className={classes.buttons}>
                <IconButton>
                  <Edit size={24} />
                </IconButton>
                <IconButton onClick={() => handleDelete(book.id)}>
                  <Delete size={24} />
                </IconButton>
              </div>
            </CardTitle>

            <CardContent>
              <div className={classes.dialogContent}>
                <Typography variant="subTitle">
                  {formatMessage({ id: "id.book" })}
                </Typography>
                <Typography color="grey">{book.id}</Typography>
              </div>

              <div className={classes.dialogContent}>
                <Typography variant="subTitle">
                  {formatMessage({ id: "author" })}
                </Typography>
                <Typography variant="subTitle" color="grey">
                  <strong>{book.author?.name || 'Unknown Author'}</strong>
                </Typography>
              </div>

              <div className={classes.dialogContent}>
                <Typography variant="subTitle">
                  {formatMessage({ id: "genre" })}
                </Typography>
                <Typography variant="subTitle" color="grey">
                  <strong>{book.genre}</strong>
                </Typography>
              </div>

              <div className={classes.dialogContent}>
                <Typography variant="subTitle">
                  {formatMessage({ id: "published" })}
                </Typography>
                <Typography variant="default" color="grey">
                  <strong>{book.published}</strong>
                </Typography>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
        />
      )}
    </div>
  );
}

export default Books;
