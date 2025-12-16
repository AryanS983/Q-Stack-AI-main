import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

function Login({setCurrentPage}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { updateUser } = useContext(UserContext)
  const navigate = useNavigate();

  //handle login from submit button
  const handleLogin = async (e) =>{
    e.preventDefault()

    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }if(!password){
      setError("Please enter a password");
      return;
    }
    setError('');
    
    //login API call
    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {email, password});

      const { token } = response.data;
      if(token){
        localStorage.setItem('token', token);
        updateUser(response.data);
        navigate("/dashboard");
      }

    }catch(err){
      if(err.response && err.response.data){
        setError(err.response.data.message);
      }else{
        setError("Something Went Wrong.... Please Try again");
        console.log(err);
      }
    }
  }

  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center '>
      <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6 " >
        Please enter your details to login. <span className=' text-red-600 font-bold '>Note: "It might take a while to load innitially"</span>
      </p>

      <form action="" onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email Address"
          type="text"
          placeholder="example@gmail.com"
          
        />

        <Input 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          type="password"
          placeholder="Min 8 Characters"
        />

        {error && <p className="text-red-500 text-xs pb-2.5"> {error} </p> }
        
        <button className="btn-primary" type='submit'>
          Login
        </button>

        <p className="text-[13px] text-slate-700 mt-3 ">
          Don't have an account? <button className="text-primary underline cursor-pointer" onClick={() => setCurrentPage('signUp')}>Sign Up</button> 
        </p>

      </form>
    </div>
  )
}

export default Login
