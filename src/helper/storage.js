import SecureLS from 'secure-ls';

const ls = new SecureLS({ encodingType: 'aes' });

export const storeToken = (token) => {
  try {
    ls.set('authToken', token);
  } catch (e) {
    console.error('Error storing token:', e);
  }
};

export const getToken = () => {
  try {
    return ls.get('authToken');
  } catch (e) {
    console.error('Error retrieving token:', e);
  } 
};

export const removeToken = () => {
  try {
    ls.remove('authToken');
  } catch (e) {
    console.error('Error removing token:', e);
  }
};
