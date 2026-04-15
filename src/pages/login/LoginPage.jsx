import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEye, faEyeSlash, faMessage } from '@fortawesome/free-regular-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

import {faLock } from '@fortawesome/free-solid-svg-icons';

import './LoginStyle.css'


function Login() {

  const [showPassword , setShowPassword] = useState(false);

  const inputWrapperStyle = 'pl-10 relative w-full bg-gray-300 rounded-lg'

  return (
    <section className="flex flex-col justify-center items-center w-screen h-screen bg-gray-200">

      <div className="p-8 bg-white rounded-xl">

        <header className='flex flex-col justify-center items-center text-center'>
          <h1 className='text-4xl font-bold mb-2'>Welcome Back</h1>
          <p className='w-[90%] mb-2'>Continue your creative journey with WorkWise</p>
        </header>

        <form className="flex flex-col justify-center items-center gap-5 ">
          

          <div className=" w-full relative">
            <label className='text-gray-800 text-sm'>Email</label>
            <div className={inputWrapperStyle}>
              <input type="email" placeholder='name@example.com' className='w-full outline-0 h-12'  />
              <FontAwesomeIcon icon={faEnvelope} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg'/>
            </div>
          </div>

          <div className=" w-full relative">
            <label className='text-gray-800 text-sm'>Password</label>
            <div className={inputWrapperStyle}>
              <input type={showPassword ? 'text' : 'password'} placeholder='••••••••' className='w-full outline-0 h-12'  />
              <span onClick={() => setShowPassword(!showPassword)} className='cursor-pointer'><FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-lg'/></span>
              <FontAwesomeIcon icon={faLock} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg'/>
            </div>
          </div>

          
          <a href="" className='self-end text-sm text-blue-700 font-bold'>Forget Password ?</a>
          <button type="submit" className='bg-[var(--Primary)] w-full text-white h-10 rounded-lg cursor-pointer hover:-translate-y-1 transition duration-300'>Log in</button>
          
        </form>

      </div>

      
      
    </section>
  )
}

export default Login