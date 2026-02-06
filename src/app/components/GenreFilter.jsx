import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";

const GenreFilter = ({selectedGenre, onChangeGenre, genres}) => {
    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            mb: 4
        }}>
            <Box sx={{ width: 300 }}>
            <FormControl fullWidth variant='standard'>
                <Select value={selectedGenre} onChange={(e) => onChangeGenre(e.target.value)} variant='standard'>
                    <MenuItem value='all'>Всі жанри</MenuItem>
                    {genres.map(genre => (
                        <MenuItem key={genre} value={genre}>{genre}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
        </Box>
    )
}

export default GenreFilter;