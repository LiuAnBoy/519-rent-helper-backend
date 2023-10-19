import React, { FC } from 'react';
import {
  Modal,
  Backdrop,
  Fade,
  Typography,
  Box,
  Stack,
  Button,
  Divider,
} from '@mui/material';
import { orange } from '@mui/material/colors';

const ConfirmModal: FC<ConfirmModalProps> = ({
  open,
  handleClose,
  handleSubmit,
  title,
  content,
  okButtonDisabled,
  cancelButtonDisabled,
  okText = '確認',
  cancelText = '取消',
  children,
}) => {
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        <Fade in={open}>
          <Box
            component='div'
            sx={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 360,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}>
            <Typography
              id='transition-modal-title'
              variant='h5'
              color={orange[500]}
              sx={{ textAlign: 'center', mb: 2, fontWeight: 700 }}>
              {title}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {content && (
              <Typography
                id='transition-modal-title'
                variant='body1'
                sx={{ mb: 4, textAlign: 'center' }}>
                {content}
              </Typography>
            )}
            {children}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Stack flexDirection='row' gap={4}>
                {!okButtonDisabled && (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleSubmit}>
                    {okText}
                  </Button>
                )}
                {!cancelButtonDisabled && (
                  <Button variant='outlined' onClick={handleClose}>
                    {cancelText}
                  </Button>
                )}
              </Stack>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ConfirmModal;

interface ConfirmModalProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  title: string;
  content: string;
  okButtonDisabled?: boolean;
  cancelButtonDisabled?: boolean;
  okText?: string;
  cancelText?: string;
  children?: React.ReactNode;
}
