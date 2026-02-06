import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import {Card, CardContent, Container} from "@mui/material";

const SkeletonCard = () =>  {
    return (
        <Container sx={{ py: 4 }}>
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 3,
            py: 20
        }}>

        { [...Array(6)].map((_, i) => (
            <Card key={i} variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent>
                    <Skeleton variant="text" sx={{ fontSize: '2rem', mb: 1 }} width="80%" />
                    <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 2 }} width="40%" />
                    <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 1 }} />
                </CardContent>
            </Card>
    ))}
</Box>
        </Container>
    );
}

export default SkeletonCard;