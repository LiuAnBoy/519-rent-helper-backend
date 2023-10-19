import React, { FC } from 'react';
import { Grid, Stack, Typography } from '@mui/material';

import MultiRoom from '../../Utils/MultiRoom';
import ConditionCheckbox from './ConditionCheckbox';

const MultiRoomSection: FC<MultiRoomProps> = ({ onChange, value, module }) => {
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
          格局
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Stack flexDirection='row' flexWrap='wrap' gap={1.5}>
          <ConditionCheckbox
            name='0'
            onChange={onChange}
            module={module}
            label='不限'
            checked={value.length === 0}
          />
          {Object.entries(MultiRoom).map(([key, val]) => (
            <ConditionCheckbox
              key={key}
              name={key}
              onChange={onChange}
              module={module}
              label={val}

              checked={value.includes(key)}
            />
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default MultiRoomSection;

interface MultiRoomProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  value: string[];
  module: string;
}
