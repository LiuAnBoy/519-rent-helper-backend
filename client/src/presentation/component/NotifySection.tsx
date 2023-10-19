import React, { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';

const NotifySection: FC<NotifySectionProps> = ({ id }) => {
  const handleBindNotify = () => {
    window.open(
      `/line/notify/token?id=${id}`,
      '_self'
    );
  };

  return (
    <Box
      component='div'
      sx={{
        mt: 6,
        display: 'flex',
        flexDirection: 'column',
        height: 'inherit',
      }}>
      <Typography variant='h5' textAlign='center' sx={{ mb: 3 }}>
        第一步，請綁定Notify通知
      </Typography>
      <Button variant='contained' color='primary' onClick={handleBindNotify}>
        綁定Notify
      </Button>
    </Box>
  );
};

export default NotifySection;

export interface NotifySectionProps {
  id: string;
}
