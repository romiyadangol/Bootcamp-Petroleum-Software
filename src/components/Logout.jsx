import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutUserSuccess } from "../redux/actions/authActions";
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@apollo/client";
import { LOGOUT_USER } from "../graphql/mutation/logout";
import SecureLS from 'secure-ls';
import { removeToken } from "../helper/storage";


const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const ls = new SecureLS({ encodingType: 'aes' });


    const [logout, { error, loading }] = useMutation(LOGOUT_USER, {
        onCompleted: () => {
            try {
                removeToken();
            } catch (error) {
                console.error('Error removing token:', error);
            }
        dispatch(logoutUserSuccess());
        navigate('/');
        },
        onError: (error) => {
        console.error('Logout error:', error);
        }
    });

  useEffect(() => {
    logout();
  }, [logout]);

  if (loading) return <p>Logging out...</p>;

  return null;
};

export default Logout;
