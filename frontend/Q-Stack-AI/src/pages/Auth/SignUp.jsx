import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import ProfilePictureSelector from '../../components/Inputs/ProfilePictureSelector';
import { API_PATHS } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadImage';
import { validateEmail } from '../../utils/helper';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';

function SignUp({setCurrentPage}) {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const { updateUser } = useContext(UserContext)
  const navigate = useNavigate();

  const handleSignUp = async (e)=>{
    e.preventDefault()

    let profileImageUrl = ""

    if(!fullName){
      setError("Please enter a name");
      return;
    }
    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }if(!password){
      setError("Please enter a password");
      return;
    }

    setError('');

    //signUp API call
    try{
      //Upload image if present
      if(profilePic){
        const imageUploadRes = await uploadImage(profilePic);
        profileImageUrl = imageUploadRes.imageUrl || ""
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        name: fullName,
        email,
        password,
        profileImageUrl
      })
      console.log(response.data);

      const { token } = await response.data;
      if(token){
        localStorage.setItem('token', token);
        await updateUser(response.data);
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
      <h3 className="text-lg font-semibold text-black">Create an Account</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6 ">
        Join us today and unlock the power of Q-Stack AI. <span className=' text-red-600 font-bold '>Note: "It might take a while to load innitially"</span>
      </p>

      <form onSubmit={handleSignUp}>
        <ProfilePictureSelector image={profilePic} setImage={setProfilePic}/>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            label="Full Name"
            placeholder="Aryan XYZ"
            type="text"
          />

          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
            placeholder="example@gmail"
            type="text"
          />

          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type='submit' className="btn-primary">
            Sign Up
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{' '}
            <button
              type='button'
              className="text-primary font-medium underline cursor-pointer"
              onClick={() => setCurrentPage('login')}
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}

export default SignUp