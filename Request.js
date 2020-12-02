import axios from 'axios';
import Config from './Config';

const client = axios.create({
  baseURL: Config.URL.MAIN_URL,
});

const request = function (options) {
  const onSuccess = function (response) {
    console.debug('Request Successful!', response);
    return response.data;
  };

  const onError = function (error) {
    console.error('Request Failed:', error.config);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else {
      console.error('Error Message:', error.message);
    }

    return Promise.reject(error.response || error.message);
  };

  return client(options).then(onSuccess).catch(onError);
};

export const get = (url, params) => {
  return request({
    url,
    method: 'GET',
    params: params,
  });
};

export const post = (url, data) => {
  return request({
    url,
    method: 'POST',
    data,
  });
};

export const put = (url, data) => {
  return request({
    url,
    method: 'PUT',
    data,
  });
};
export const deleteReq = (url, params) => {
  return request({
    url,
    method: 'DELETE',
    params: params,
  });
};
// export default request;
