import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';

const UpdateUsers = () => {
  const { id } = useParams();
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = tokenPayload.exp * 1000;

      const currentTime = Date.now();
      if (currentTime > expiresAt) {
        handleLogout();
      } else {
        setIsAuthenticated(true);
        const remainingTime = expiresAt - currentTime;
        setTimeout(handleLogout, remainingTime);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
    setTokenExpired(true);
    setTimeout(() => {
      navigate('/login');
    }, 3000); // Redirect after 3 seconds
  };

  const validateForm = () => {
    const errors = {};

    if (!values.name) {
      errors.name = 'Name cannot be empty';
    } else if (!/^[A-Za-z\s]+$/.test(values.name)) {
      errors.name = 'Name cannot contain numbers';
    }

    if (!values.email) {
      errors.email = 'Email cannot be empty';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Invalid email format';
    }

    if (!values.phone) {
      errors.phone = 'Phone cannot be empty';
    } else if (!/^\d{10}$/.test(values.phone)) {
      errors.phone = 'Phone must be exactly 10 numeric characters';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const token = Cookies.get('token');
      if (!token || tokenExpired) {
        handleLogout();
        return;
      }

      axios
        .put(`http://localhost:3030/update/${id}`, values, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          setErrors({});
          navigate('/users');
        })
        .catch((err) => {
          if (err.response && err.response.status === 400) {
            setErrors(err.response.data.errors);
          } else {
            console.log(err);
          }
        });
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      axios
        .get(`http://localhost:3030/getrecord/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setValues({
          name: res.data[0].name,
          email: res.data[0].email,
          phone: res.data[0].phone
        }))
        .catch((err) => console.log(err));
    } else {
      setIsAuthenticated(false);
    }
  }, [id]);

  return (
    <div className="container mt-5">
      {isAuthenticated ? (
        <div className="row justify-content-center">
          <div className="col-md-6">
          <br /> <br /><br /><br /><br /> 
            <div className="jumbotron bg-dark">
              <br />
              <h4 className="text-white text-center">UPDATE USER</h4>
              <div className="d-flex justify-content-center">
                <form onSubmit={handleSubmit} style={{ width: '90%' }}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label text-white">Name:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      id="name"
                      placeholder="Enter name"
                      name="name"
                      value={values.name}
                      onChange={(e) => setValues({ ...values, name: e.target.value })}
                    />
                    {errors.name && <p className="text-danger">{errors.name}</p>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label text-white">Email:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      placeholder="Enter Email"
                      name="email"
                      value={values.email}
                      onChange={(e) => setValues({ ...values, email: e.target.value })}
                    />
                    {errors.email && <p className="text-danger">{errors.email}</p>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label text-white">Phone:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      id="phone"
                      placeholder="Enter Phone Number"
                      name="phone"
                      value={values.phone}
                      onChange={(e) => setValues({ ...values, phone: e.target.value })}
                    />
                    {errors.phone && <p className="text-danger">{errors.phone}</p>}
                  </div>

                  <button type="submit" className="btn btn-success mb-4 mr-2">Submit</button>
                  <Link to="/users" className="btn btn-primary mb-4" style={{ marginLeft: '10px' }}>Back</Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center not-auth">
          <h1 className="text-white">YOU ARE NOT AUTHORISED</h1>
          <button onClick={() => navigate('/login')} className="btn btn-primary not-auth-button">Back to Login</button>
        </div>
      )}
      {tokenExpired && (
        <div className="alert alert-danger text-center alert-custom" role="alert">
          Your session has expired. Redirecting to login...
        </div>
      )}
    </div>
  );
};

export default UpdateUsers;
