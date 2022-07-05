import React,{ useContext } from 'react'
import { TransactionContext } from '../context/TransactionContext';


const LoginScreen = () => {
  const { handleLogin } = useContext(TransactionContext)

  return (
    <div className="gradient-bg-welcome">
    <div className="flex w-full justify-center items-center min-h-screen">
    <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
    <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
        <form onSubmit={handleLogin} className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
          <input placeholder="Email Adress" name="email" type="text" className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"/>
          <button
            type="submit"
            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
          >
            Send
          </button>
        </form>
        </div>
        </div>  
      </div>
    </div>
  )
};

export default LoginScreen;