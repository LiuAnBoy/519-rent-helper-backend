import React from 'react';
import {
  ListItem,
  ListItemText,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import Region from '../../Utils/Region';
import Section from '../../Utils/Section';
import { ConditionProps } from '../../application/hook/useCondition';

const ConditionListItem: React.FC<ConditionListItemProps> = ({
  condition,
  changePush,
}) => {
  const navigate = useNavigate();

  return (
    <ListItem
      sx={{
        border: '1px solid #ccc',
        borderRadius: '5px',
        cursor: 'pointer',
        my: 3,
        display: 'flex',
        flexDirection: 'column',
        pb: 2.5,
        px: 2,
      }}>
      <ListItemText
        sx={{ width: '100%' }}
        primary={
          <Stack
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'>
            <Typography variant='body1'>{condition.name}</Typography>
            <Switch
              edge='end'
              checked={condition.push}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                changePush(e, condition._id)
              }
            />
          </Stack>
        }
        secondary={`建立時間： ${moment(condition.created_at).format('YYYY-MM-DD HH:mm:ss')}`}
      />
      <Stack
        sx={{ width: '100%' }}
        flexDirection='column'
        onClick={() => navigate(`/condition/edit/${condition._id}`)}>
        <Typography variant='body2' color="#a3a3a3">
          地區: {Region[condition.region as keyof typeof Region]}
        </Typography>
        <Typography variant='body2' color="#a3a3a3">
          位置:{' '}
          {condition.section.length > 0
            ? condition.section
                .map(
                  s =>
                    Section[condition.region as keyof typeof Section][
                      s as keyof (typeof Section)[keyof typeof Section]
                    ]
                )
                .join('、')
            : '不限'}
        </Typography>
      </Stack>
    </ListItem>
  );
};

export default ConditionListItem;

interface ConditionListItemProps {
  condition: ConditionProps;
  changePush: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
}
