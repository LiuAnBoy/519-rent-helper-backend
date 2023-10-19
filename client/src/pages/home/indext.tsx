import {
  Box,
  CircularProgress,
  IconButton,
  List,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect } from 'react';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  ProfileContextProps,
  UserContext,
} from '../../application/hook/useUser';
import useCondition, {
  ConditionContextProps,
  ConditionProps,
  ConditionResponseProps,
} from '../../application/hook/useCondition';
import { ConditionContext } from '../../application/hook/useCondition';
import ConditionListItem from '../../presentation/component/ConditionListItem';
import useSnackBar from '../../application/hook/useSnackBar';
import NotifySection from '../../presentation/component/NotifySection';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSnackBar } = useSnackBar();

  const { user } = useContext(UserContext) as ProfileContextProps;
  const { conditionList } = useContext(
    ConditionContext
  ) as ConditionContextProps;

  const { requestChangePush } = useCondition();

  const handleAddCondition = () => {
    navigate('/condition/create');
  };

  const handleChangePush = async (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const res = await requestChangePush(id);
    return showSnackBar(res as ConditionResponseProps);
  };

  useEffect(() => {
    if (location.state) {
      showSnackBar(location.state as any);
      location.state = null;
    }
  }, []);

  if (Object.keys(user).length === 0) {
    return (
      <Box
        component='div'
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box component='div' sx={{ height: 'inherit' }}>
      <Typography
        variant='h6'
        sx={{ textAlign: 'center', position: 'relative' }}>
        Hi {user.name},
        {user.notify_token && user.condition ? ' 歡迎回來' : ' 請先設定條件'}
      </Typography>

      {!user.notify_token && <NotifySection id={user.line_id} />}

      {user.notify_token && (
        <Box
          component='div'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 'inherit',
          }}>
          <List sx={{ width: '100%' }}>
            {conditionList.map((condition, index) => (
              <ConditionListItem
                key={index}
                condition={condition}
                changePush={handleChangePush}
              />
            ))}
          </List>

          {conditionList.length <= 3 && (
            <IconButton onClick={handleAddCondition}>
              <ControlPointIcon sx={{ fontSize: '100px', color: '#ccc' }} />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
