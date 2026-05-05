import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Chip,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useNavigate } from 'react-router-dom';
import { assetUrl } from '../../shared/assetUrl.js';
import { formatRub } from '../../shared/shopConstants.js';

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#f0f0f0" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-family="sans-serif" font-size="16">Нет фото</text></svg>'
  );

const IMG_RATIO = '4 / 3';

export function ProductCardShop({ toy, onAddToCart, dense = false }) {
  const navigate = useNavigate();
  const img = toy.image_url ? assetUrl(toy.image_url) : PLACEHOLDER;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <Box sx={{ position: 'relative', width: '100%' }}>
        {toy.badge === 'sale' && (
          <Chip
            label="СКИДКА"
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 2,
              bgcolor: '#E53935',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.65rem',
            }}
          />
        )}
        {toy.badge === 'new' && (
          <Chip
            label="НОВИНКА"
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 2,
              bgcolor: '#FB8C00',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.65rem',
            }}
          />
        )}
        <CardActionArea onClick={() => navigate(`/product/${toy.id}`)} sx={{ display: 'block' }}>
          <Box
            sx={{
              width: '100%',
              aspectRatio: IMG_RATIO,
              maxHeight: dense ? 200 : 240,
              position: 'relative',
              bgcolor: '#fafafa',
            }}
          >
            <Box
              component="img"
              src={img}
              alt=""
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        </CardActionArea>
      </Box>
      <CardContent sx={{ flexGrow: 1, pt: 1.5, pb: 2, px: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{ minHeight: '2.5em', lineHeight: 1.25, cursor: 'pointer' }}
          onClick={() => navigate(`/product/${toy.id}`)}
        >
          {toy.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
          <Typography variant="h6" color="success.main" fontWeight={800}>
            {formatRub(toy.price)}
          </Typography>
          {toy.compare_price != null && Number(toy.compare_price) > Number(toy.price) && (
            <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
              {formatRub(toy.compare_price)}
            </Typography>
          )}
        </Box>
        {onAddToCart && (
          <Button
            size="small"
            variant="contained"
            fullWidth
            startIcon={<AddShoppingCartIcon />}
            sx={{ mt: 1.5 }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(toy);
            }}
          >
            В корзину
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
