import React from 'react';
import PaginationMUI from '@mui/material/Pagination';
import useTheme from 'misc/hooks/useTheme';
import { createUseStyles } from 'react-jss';

const getClasses = createUseStyles((theme) => ({
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: `${theme.spacing(2)}px`,
  },
}));

const Pagination = ({
  count,          // Загальна кількість сторінок
  page,           // Поточна сторінка
  onChange,       // Функція (event, value) => { ... }
  color = 'primary', // primary | secondary | standard
  size = 'medium',   // small | medium | large
  disabled = false,
}) => {
  const { theme } = useTheme();
  const classes = getClasses({ theme });

  return (
    <div className={classes.paginationContainer}>
      <PaginationMUI
        count={count}
        page={page}
        onChange={onChange}
        color={color}
        size={size}
        disabled={disabled}
        shape="rounded" 
        variant="outlined"
      />
    </div>
  );
};

export default Pagination;