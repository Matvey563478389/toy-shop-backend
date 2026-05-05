import { Typography } from '@mui/material';
import { BRAND_NAME } from '../../shared/shopConstants.js';

export function BrandTitle({ size = 'medium' }) {
  return (
    <Typography
      component="span"
      sx={{
        fontWeight: 800,
        fontSize: size === 'small' ? '1.15rem' : '1.35rem',
        color: 'text.primary',
        letterSpacing: '-0.02em',
      }}
    >
      {BRAND_NAME}
    </Typography>
  );
}
