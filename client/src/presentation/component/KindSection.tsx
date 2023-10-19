import React, { FC } from 'react';
import {
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';

import Kind from '../../Utils/Kind';

const KindSection: FC<KindProps> = ({ onChange, value, module }) => {
  return (
    <Grid item container xs={12} spacing={1}>
      <Grid item xs={12}>
        <Typography
          variant='h6'
          sx={{
            position: 'relative',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 18,
          }}>
          類型
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <ToggleButtonGroup
          id='kind'
          exclusive
          sx={{ flexWrap: 'wrap', gap: 1.5 }}
          value={value}
          onChange={(e: React.MouseEvent<HTMLElement>, value) => onChange(value, module)}
          >
          <ToggleButton disableRipple value=''>
            不限
          </ToggleButton>
          {Object.entries(Kind).map(([key, value]) => (
            <ToggleButton disableRipple key={key} value={key}>
              {value}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  );
};

export default KindSection;

interface KindProps {
  onChange: (value: string, name: string) => void;
  value: string;
  module: string;
}
