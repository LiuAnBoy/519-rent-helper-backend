import React, { FC } from 'react';
import { Checkbox, Typography } from '@mui/material';

import theme from '../../theme';

const ConditionCheckbox: FC<ConditionCheckboxProps> = ({
  onChange,
  module,
  label,
  name,
  checked,
}) => {
  return (
    <Checkbox
      id={name}
      name={name}
      disableRipple
      sx={{ p: 0 }}
      icon={
        <Typography
          sx={{ border: '1px solid black', px: 3, py: 0.5 }}
          variant='h6'>
          {label}
        </Typography>
      }
      checkedIcon={
        <Typography
          sx={{
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.palette.primary.main,
            px: 3,
            py: 0.5,
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
          }}
          variant='h6'>
          {label}
        </Typography>
      }
      checked={checked}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e, module)}
    />
  );
};

export default ConditionCheckbox;

interface ConditionCheckboxProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  module: string;
  label: string;
  name: string;
  checked: boolean;
}
