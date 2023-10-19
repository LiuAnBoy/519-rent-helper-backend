import axios from 'axios';

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

const checkToken = () => {
  const storage = localStorage.getItem('591RentHelper');

  const token = storage ? JSON.parse(storage).token : null;

  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

export const getRequest = async <T>(endPoint: string) => {
  checkToken()

  try {
    const res = await instance.get<T>(endPoint);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const postRequest = async <T>(endPoint: string, body?: {}) => {
  checkToken()

  try {
    const res = await instance.post<T>(endPoint, body);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const putRequest = async <T>(endPoint: string, body?: {}) => {
  checkToken()

  try {
    const res = await instance.put<T>(endPoint, body);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const patchRequest = async <T>(endPoint: string, body?: {}) => {
  checkToken()

  try {
    const res = await instance.patch<T>(endPoint, body);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export const deleteRequest = async <T> (endPoint: string) => {
  checkToken()

  try {
    const res = await instance.delete<T>(endPoint);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
