import axios from 'axios';

const setTokenAsHeader = (token: string | null): void => {
  if (token) {
    axios.defaults.headers.common.Authorization = token;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};

export default setTokenAsHeader;
