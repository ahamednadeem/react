import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './SignupValidation';
import axios from 'axios';

function Signup() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        // Check if there are no validation errors before submitting
        if (Object.values(validationErrors).every(error => error === "")) {
            axios.post('http://localhost:3030/signup', values)
                .then(res => {
                    if (res.data.status === "success") {
                        navigate('/login');
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
                <h2>Sign-Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="name"><strong>Name</strong></label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            name="name"
                            onChange={e => setValues({ ...values, name: e.target.value })}
                            className="form-control rounded-0"
                        />
                        {errors.name && <span className='text-danger'>{errors.name}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            name="email"
                            onChange={e => setValues({ ...values, email: e.target.value })}
                            className="form-control rounded-0"
                        />
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            onChange={e => setValues({ ...values, password: e.target.value })}
                            className="form-control rounded-0"
                        />
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                    </div>
                    <button type='submit' className="btn btn-success w-100 rounded-0"><strong>Sign up</strong></button>
                    <p></p>
                    <Link to='/login' className="btn btn-default border w-100 bg-info rounded-0 text-decoration-none"><strong>Login</strong></Link>
                </form>
            </div>
        </div>
    );
}

export default Signup;