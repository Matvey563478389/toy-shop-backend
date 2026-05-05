import { Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

export function StarRating({ value = 5, size = 18 }) {
  const v = Math.min(5, Math.max(0, Number(value)));
  const full = Math.floor(v);
  const half = v - full >= 0.5;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', color: '#FDE910', gap: 0.1 }}>
      {[0, 1, 2, 3, 4].map((i) => {
        if (i < full) {
          return <StarIcon key={i} sx={{ fontSize: size }} />;
        }
        if (i === full && half) {
          return <StarIcon key={i} sx={{ fontSize: size, opacity: 0.55 }} />;
        }
        return <StarBorderIcon key={i} sx={{ fontSize: size, color: '#E0E0E0' }} />;
      })}
    </Box>
  );
}
