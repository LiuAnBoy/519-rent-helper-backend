import React, { FC } from 'react';
import { Grid, Stack, Typography } from '@mui/material';

import ConditionCheckbox from './ConditionCheckbox';
import MultiNotice from '../../Utils/MultiNotice';

const MultiNoticeSection: FC<OtherProps> = ({ onChange, value, module }) => {
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
          須知
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
          {Object.entries(MultiNotice).map(([key, val]) => (
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

export default MultiNoticeSection;

interface OtherProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  value: string[];
  module: string;
}
