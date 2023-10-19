import React, { FC } from 'react';
import {
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

import Region from '../../Utils/Region';

const RegionSection: FC<RegionProps> = ({
  onChange,
  error,
  helpText,
  value,
}) => {
  return (
    <Grid container item>
      <Grid item xs={2}>
        <Typography
          variant='h6'
          sx={{
            position: 'relative',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 18,
          }}>
          地區
        </Typography>
      </Grid>
      <Grid item xs={10}>
        <FormControl fullWidth>
          <Select
            id='region'
            name='region'
            value={value}
            error={error}
            onChange={onChange}>
            {Object.entries(Region).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error={error}>{helpText}</FormHelperText>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default RegionSection;

interface RegionProps {
  onChange: (e: any) => void;
  error: boolean;
  helpText: string;
  value: string;
}
