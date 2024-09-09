import SecureLS from 'secure-ls';

const ls = new SecureLS({ encodingType: 'aes' });

export const storeToken = (token, roles) => {
  try {
    ls.set('authToken', token);
    ls.set('userRole', roles);
  } catch (e) {
    console.error('Error storing token:', e);
  }
};

export const getToken = () => {
  try {
    const role = ls.get('userRole');
    if (role === 'admin') {
      return ls.get('authToken');
    } else {
      return null;
    }
  } catch (e) {
    console.error('Error retrieving token:', e);
  } 
};

export const removeToken = () => {
  try {
    ls.remove('authToken');
    ls.remove('userRole');
  } catch (e) {
    console.error('Error removing token:', e);
  }
};
