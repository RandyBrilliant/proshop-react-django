import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';

import { getUserDetails, updateUser } from '../actions/userActions';

import { USER_UPDATE_RESET } from '../constants/userConstants';


function UserEditScreen({ match, history }) {

  const userId = match.params.id;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector(state => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector(state => state.userUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      history.push('/admin/userlist')
    } else {
      if (!user.name || user._id !== Number(userId)) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, userId, user, history, successUpdate])

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({_id: user._id, name, email, isAdmin}))
  }

  return (
    <div>
      <Link to="/admin/userlist">Go Back</Link>

      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={e => setName(e.target.value)}
              >
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={e => setEmail(e.target.value)}
              >
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="isAdmin">
              <Form.Label>Is Admin</Form.Label>
              <Form.Check
                type="checkbox"
                placeholder="Is Admin"
                checked={isAdmin}
                onChange={e => setIsAdmin(e.target.checked)}
                onBlur={e => setIsAdmin(e.target.checked)}
              >
              </Form.Check>
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-3">Update</Button>
          </Form>
        )}

      </FormContainer>
    </div>

  )
}

export default UserEditScreen
