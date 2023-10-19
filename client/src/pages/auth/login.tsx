import React from 'react'
import { Box, Button } from '@mui/material'
import axios from 'axios'

const LoginPage = () => {

  const handleLineLogin = async () => {
    window.open('/auth/login', '_self');
  }

  return (
    <Box>
      <Button variant='contained' color='primary' onClick={handleLineLogin}>
        Login
      </Button>
    </Box>
  )
}

export default LoginPage;