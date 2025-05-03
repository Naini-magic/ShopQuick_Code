import React, { useState , useContext} from 'react'
import "./signup.css";
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginContext } from '../context/ContextProvider';


const Sign_in = () => {
    const navigate = useNavigate();

    const [logData , setData] = useState({
        email:"",
        password:""
    });

    const { account, setAccount } = useContext(LoginContext);


    const adddata = (e) => {
        const {name , value} = e.target;

        setData(() => {
            return {
                ...logData,
                [name]:value
            }
        })
    }

    const senddata = async(e) => {
           
        e.preventDefault();
        const { email , password } = logData;

        const res = await fetch("/login" , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
            email  , password
            })
        });

        const data = await res.json();
        console.log(data);

        if(res.status == 400 || !data ){
            console.log(" Invalid details ")
            toast.warn("Invalid data " , {
                position: "top-center"
            })
        }else{
            console.log("data valid");
            setAccount(data);
            toast.success("user data valid" , {
                position: "top-center"
            })
            setData({...logData , email:"" , password:""});  
            navigate("/");    
        }

    }

    return (
        <section>
            <div className='sign_container'>
                {/* <div className='sign_header'>
                    <img src="" alt="" />
                </div> */}
                <div className='sign_form'>
                    <form method='POST'>
                        <h1>Sign-In</h1>
                        <div className='form_data'>
                            <label htmlFor='email'>Email</label>
                            <input type='text' 
                            onChange={adddata} 
                            value={logData.email}
                            name='email'
                             id='email' />
                        </div>
                        <div className='form_data'>
                            <label htmlFor='password'>Password</label>
                            <input type='password'
                            onChange={adddata} 
                            value={logData.password}
                            name='password' 
                            placeholder="At least 6 char" 
                            id='password' />
                        </div>
                        <button className='signin_btn' onClick={senddata}>Continue</button>
                    </form>
                </div>

                <div className='create_accountinfo'>
                    <p>New To ShopQuick</p>
                    <NavLink to="/register">
                        <button>Create Your Account</button>
                    </NavLink>
                </div>
            </div>
            <ToastContainer />
        </section>
    )
}

export default Sign_in;