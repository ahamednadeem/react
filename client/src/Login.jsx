// Login.jsx
import React, { useState } from 'react';
import Validation from './LoginValidation';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        // Check if there are no validation errors before submitting
        if (Object.values(validationErrors).every(error => error === "")) {
            axios.post('http://localhost:3030/login', values)
                .then(res => {
                    if (res.data.status === "success") {
                        navigate('/users');
                    } else {
                        alert("Error: " + res.data.Error);
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("An error occurred while signing up. Please try again.");
                });
        }
    };


    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-image-set">
            <div className="bg-light p-3 rounded w-25">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" placeholder="Enter Email" name='email'
                            value={values.email}
                            onChange={e => setValues({ ...values, email: e.target.value })} className=" form-control rounded-0" />
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" placeholder="Enter Password" name='password'
                            value={values.password}
                            onChange={e => setValues({ ...values, password: e.target.value })} className="form-control rounded-0" />
                        {errors.password && <span className='text-danger'>{errors.password}</span>}

                    </div>
                    <button type='submit' className="btn btn-success w-100 rounded-0"><strong>Log In</strong></button>
                    <p></p>
                    <Link to='/signup' className="btn btn-default border w-100 bg-info rounded-0 text-decoration-none"><strong>Create Account</strong></Link>
                </form>
            </div>
        </div>
    )
}

export default Login;