import { Container } from '@mui/material';
import React, { PropsWithChildren } from 'react';

const Content = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Container sx={{ pt: 10, px: 0, pb: 2 }}>
      {children}
    </Container>
  );
};

export default Content;
