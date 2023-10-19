import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import liff from '@line/liff';
import { CircularProgress } from '@mui/material';
import NabBar from './presentation/layout/NavBar';
import { Route, Routes, useNavigate } from 'react-router-dom';
import routes, { RouteProps } from './routes';
import Content from './presentation/layout/Content';
import vConsole from './application/vConsole';
import { useSearchParams } from 'react-router-dom';
import useUser, { UserContext } from './application/hook/useUser';
import useCondition, {
  ConditionContext,
  ConditionProps,
} from './application/hook/useCondition';
import { SnackbarProvider } from 'notistack';
import { ProfileProps } from './application/hook/useUser';

export default function App() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { requestLiffLogin } = useUser();
  const { requestGetConditionList } = useCondition();

  const [user, setUser] = React.useState<ProfileProps>({} as ProfileProps);
  const [conditionList, setConditionList] = React.useState<ConditionProps[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const appInit = async () => {
    try {
      await liff.init({ liffId: process.env.REACT_APP_LINE_LIFF_ID as string });
      if (!liff.isLoggedIn()) {
        await liff.login();
        navigate('/');
      }
      setIsLoading(true);
      const id_token = await liff.getIDToken();

      const storage = {
        token: id_token,
      };

      localStorage.setItem('591RentHelper', JSON.stringify(storage));

      const res = await requestLiffLogin(id_token as string);
      if (res?.success) {
        setUser(res.data);
        const conditionResponse = await requestGetConditionList(res.data._id);
        if (conditionResponse?.success) {
          setConditionList(conditionResponse.data as ConditionProps[]);
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    appInit();
  }, []);

  if (searchParams.get('code')) {
    navigate('/');
  }

  // React.useEffect(() => {
  //   if (process.env.NODE_ENV === 'development') {
  //     vConsole.show();
  //   }
  // }, []);

  if (isLoading) {
    return (
      <Box
        component='div'
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ConditionContext.Provider value={{ conditionList, setConditionList }}>
        <SnackbarProvider maxSnack={3}>
          <Container maxWidth='sm'>
            <NabBar />
            <Content>
              <Routes>
                {routes.map((route: RouteProps) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<route.view />}
                  />
                ))}
              </Routes>
            </Content>
          </Container>
        </SnackbarProvider>
      </ConditionContext.Provider>
    </UserContext.Provider>
  );
}

// export interface ProfileResponseProps {
//   success: boolean;
//   data: ProfileProps;
// }

// export interface ProfileProps {
//   _id: string;
//   name: string;
//   email: string;
//   picture: string;
//   line_id: string;
//   condition: number;
//   notify_token: string;
//   exp: number;
//   iat: number;
// }
