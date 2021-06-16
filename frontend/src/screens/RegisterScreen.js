import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';

import { register } from '../actions/userActions';


function RegisterScreen({ location, history }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  const userRegister = useSelector(state => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Password do not match, try again!')
    } else {
      dispatch(register(name, email, password))
    }
  }

  return (
    <FormContainer>
      <h1>Register</h1>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            required
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
            required
            type="email"
            placeholder="Enter Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={e => setEmail(e.target.value)}
          >
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onBlur={e => setPassword(e.target.value)}
          >
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Re-Enter Your Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            onBlur={e => setConfirmPassword(e.target.value)}
          >
          </Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">Register</Button>
      </Form>

      <Row className="py-3">
        <Col>
          Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Sign In Now</Link> and start purchasing items!
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen
