import React, { FC } from 'react';
import {
  FormControl,
  FormHelperText,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import Price from '../../Utils/Price';
import ConditionCheckbox from './ConditionCheckbox';

const PriceSection: FC<PriceProps> = ({
  onChange,
  value,
  module,
  error,
  max_price,
  min_price,
  helpText,
}) => {
  return (
    <Grid container item spacing={1}>
      <Grid item xs={12}>
        <Typography
          variant='h6'
          sx={{
            position: 'relative',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 18,
          }}>
          租金
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ mb: 0.5 }}>
        <Stack flexDirection='row' flexWrap='wrap' gap={1.5}>
          <ConditionCheckbox
            name='0'
            onChange={onChange}
            module={module}
            label='不限'
            checked={value.length === 0 || typeof value === 'string'}
          />
          {Object.entries(Price).map(([key, val]) => (
            <ConditionCheckbox
              key={key}
              name={key}
              onChange={onChange}
              module={module}
              label={val}
              checked={value.includes(key) || typeof value === 'string'}
            />
          ))}
        </Stack>
      </Grid>
      <Grid container item>
        <Grid item xs={5.5}>
          <TextField
            id='min_price'
            name='min_price'
            size='small'
            variant='outlined'
            error={error}
            value={min_price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange(e, module)
            }
            fullWidth
          />
        </Grid>
        <Grid item xs={1}>
          <Typography
            variant='h6'
            sx={{
              position: 'relative',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 18,
              textAlign: 'center',
            }}>
            -
          </Typography>
        </Grid>
        <Grid item xs={5.5}>
          <TextField
            id='max_price'
            name='max_price'
            size='small'
            variant='outlined'
            error={error}
            value={max_price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange(e, module)
            }
            fullWidth
          />
        </Grid>
      </Grid>
      <FormControl fullWidth sx={{ flexDirection: 'row' }}>
        <FormHelperText error={error}>{helpText}</FormHelperText>
      </FormControl>
    </Grid>
  );
};

export default PriceSection;

interface PriceProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  value: string[];
  module: string;
  error: boolean;
  helpText: string;
  min_price: string;
  max_price: string;
}
