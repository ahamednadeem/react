import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Nav from './Nav';
import Cookies from 'js-cookie';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const UserSearch = () => {
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const query = useQuery().get('q');
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = tokenPayload.exp * 1000; // Convert to milliseconds

      const currentTime = Date.now();
      if (currentTime > expiresAt) {
        handleLogout(false); // Token expired
      } else {
        setIsAuthenticated(true);
        if (query) {
          fetchSearchResults(query, token);
        }
        const remainingTime = expiresAt - currentTime;
        setTimeout(() => {
          handleLogout(false); // Token expiration logout
        }, remainingTime);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [query, navigate]);

  const fetchSearchResults = (query, token) => {
    axios
      .get(`http://localhost:3030/search?q=${query}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setResults(res.data))
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          handleLogout(false); // Token expired
        } else {
          console.log(err);
        }
      });
  };

  const handleDelete = (id) => {
    const token = Cookies.get('token');
    axios
      .delete(`http://localhost:3030/delete/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => setResults(results.filter((user) => user.id !== id)))
      .catch((err) => console.log(err));
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleLogout = (manual = true) => {
    Cookies.remove('token');
    setIsAuthenticated(false);
    if (manual) {
      navigate('/login');
    } else {
      setTokenExpired(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Redirect after 2 seconds
    }
  };

  return (
    <div>
      {isAuthenticated && <Nav handleLogout={handleLogout} />}
      <div className="container mt-5">
        {isAuthenticated ? (
          <>
            <Link to="/users" className={`btn btn-primary mb-3 ${showModal ? 'blur-background' : ''}`}>
              Back
            </Link>
            <br />
            <br />
            <div className={`content ${showModal ? 'blur-background' : ''}`}>
              {results.length !== 0 ? (
                <table className="table table-dark table-hover table-bordered border-info table-striped">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone</th>
                      <th scope="col" style={{ width: '350px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((user, index) => (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>
                          <Link to={`/update/${user.id}`} className="btn btn-primary btn-sm me-5">
                            Update
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(user.id)}
                            className="btn btn-danger btn-sm me-5"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => handleViewUser(user)}
                            className="btn btn-success btn-sm"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <h1 className="text-white no-record">No Records Found</h1>
              )}
            </div>
          </>
        ) : (
          <div className="text-center not-auth">
            <h1 className="text-white">YOU ARE NOT AUTHORISED</h1>
            <button onClick={() => navigate('/login')} className="btn btn-primary not-auth-button">
              Back to Login
            </button>
          </div>
        )}

        {showModal && selectedUser && (
          <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content custom-modal">
                <div className="modal-header">
                  <h5 className="modal-title text-white">User Details</h5>
                  <button type="button" className="btn-close custom-close-btn" onClick={closeModal}></button>
                </div>
                <div className="modal-body text-white">
                  <p>Name: {selectedUser.name}</p>
                  <p>Email: {selectedUser.email}</p>
                  <p>Phone: {selectedUser.phone}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tokenExpired && (
          <div className="alert alert-danger text-center alert-custom" role="alert">
            Your session has expired. Redirecting to login...
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
