import React, { FC } from 'react';
import { Alert } from '@mui/material';

const MessageAlert: FC<MessageAlertProps> = ({ message, severity }) => {
  console.log(message);
  return (
    <Alert severity={severity || 'success'}>
      {message}
    </Alert>
  );
};

export default MessageAlert;

interface MessageAlertProps {
  message: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
}
