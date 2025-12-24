import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {useSearchParams} from "react-router-dom";


const PaginationRounded = ({ totalPages }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const pageParam = Number(searchParams.get('page'));
    const currentPage =
        Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

    const handlePageChange = (event, page) => {
        setSearchParams({ page: page });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Stack spacing={2} sx={{ mt: 4, mb: 4, alignItems: 'center' }}>
            <Pagination
                count={totalPages}
                page={Math.min(currentPage, totalPages || 1)}
                onChange={handlePageChange}
                shape="rounded"
                variant="outlined"
                size="large"
            />
        </Stack>
    );
};



export default PaginationRounded;
