import React, { useState } from 'react'
import "./signup.css";
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
    const navigate = useNavigate(); 
    const [udata, setUdata] = useState({
        fname: "",
        email: "",
        mobile: "",
        password: "",
        cpassword: ""
    });

    console.log(udata);

    const adddata = (e) => {
        const { name, value } = e.target;

        setUdata(() => {
            return {
                ...udata,
                [name]: value
            }
        })
    };

    const senddata = async (e) => {
        e.preventDefault();
        const { fname, email, mobile, password, cpassword } = udata;

        if (!fname || !email || !mobile || !password || !cpassword) {
            return toast.warn("Please fill all fields", { position: "top-center" });
          }
          if (password !== cpassword) {
            return toast.error("Passwords do not match", { position: "top-center" });
          }
                  

        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                fname, email, mobile, password, cpassword
            })
        })

        const data = await res.json();
        // console.log(data);

        if (res.status === 422 || !data) {
            // alert("No data")
            toast.warn("Invalid data ", {
                position: "top-center"
            })
        } else {
            // alert("Successfully SignUp")
            toast.success("data succesfully added", {
                position: "top-center"
            })
            setUdata({ ...udata, fname: "", email: "", mobile: "", password: "", cpassword: "" });
            navigate("/");
        }
    };

    return (
        <section>
            <div className='sign_container'>
                <div className='sign_form'>
                    <form method='POST'>
                        <h1>Sign-Up</h1>
                        <div className='form_data'>
                            <label htmlFor='fname'>Your name</label>
                            <input type='text' onChange={adddata} value={udata.fname} name='fname' id='fname' />
                        </div>
                        <div className='form_data'>
                            <label htmlFor='email'>Email</label>
                            <input type='text' onChange={adddata} value={udata.email} name='email' id='email' />
                        </div>
                        <div className='form_data'>
                            <label htmlFor='number'>Mobile</label>
                            <input type='text' onChange={adddata} value={udata.mobile}name='mobile' id='mobile' />
                        </div>

                        <div className='form_data'>
                            <label htmlFor='password'>Password</label>
                            <input type='password' onChange={adddata} value={udata.password} name='password' placeholder="At least 6 char" id='password' />
                        </div>

                        <div className='form_data'>
                            <label htmlFor='cpassword'>Confirm Password</label>
                            <input type='password' onChange={adddata} value={udata.cpassword} name='cpassword' id='cpassword' />
                        </div>
                        <button className='signin_btn' onClick={senddata}>Continue</button>

                        <div className='signin_info'>
                            <p>Already have an account</p>
                            <NavLink to="/login">Signin</NavLink>
                        </div>
                    </form>
                </div>
                <ToastContainer />
            </div>

        </section>
    )
}

export default SignUp
