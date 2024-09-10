import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import SignupForm from '../../containers/Signup';
import LoginForm from '../../containers/Login';
import { AuthResponse } from '../../types/userTypes/apiTypes';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/userSlice';

const Registration: React.FC = () => {
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [isOtpStep, setIsOtpStep] = useState<boolean>(false);
  const navigate = useNavigate(); 
  const dispatch = useDispatch(); 


  const handleSignup = (data: AuthResponse) => {
    console.log('Signup Data:', data);
    
    dispatch(setUser({
      _id: data.userData?._id,
      email: data.userData?.email,
      name: data.userData?.name,
      role: data.userData?.role
    }));
console.log(data.token,'tocken cheking in here')
    localStorage.setItem('accessToken', data.token);

  };

  const handleLogin = (data: { email: string; password: string }) => {
    console.log('Login Data:', data);
  };

  const handleLoginRedirect = () => {

    navigate('/login');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center relative p-4">
        <div
          className="rounded-lg shadow-2xl p-8 relative h-auto md:h-[42rem]"
          style={{
            backgroundColor: '#AEA235',
            width: '100%',
            maxWidth: '577px',
          }}
        >
          <div className="absolute bottom-0 right-0 w-60 h-80 bg-gray-100 rounded-lg flex items-center justify-center shadow-lg">
            <img
              src="/assets/signup.jpg"
              alt="Decorative"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Content inside the box */}
          <div className="absolute top-0 left-0 p-8">
            <h1 className="text-4xl mb-3 font-lalezar text-white">Antiguo</h1>
            <div className="relative mt-40 text-start md:text-center">
              <p className="text-4xl font-bold text-white whitespace-pre-line">
                Start Your{"\n"}
                Vintage Auction{"\n"}
                Adventure Now!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
          {!isOtpStep ? (
            <>
              {showLogin ? (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
                  <LoginForm onLogin={handleLogin} />
                  <div className="text-center mb-4">
                    <p className="text-gray-600">
                      Don't have an account?{" "}
                      <button
                        onClick={() => setShowLogin(false)}
                        className="text-blue-500 hover:underline"
                      >
                        Sign up here
                      </button>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
                  <SignupForm onSignup={handleSignup} />
                  <div className="text-center mb-4">
                    <p className="text-gray-600">
                      Already have an account?{" "}
                      <a
                        onClick={() => setShowLogin(true)}
                        className="text-blue-500 hover:underline"
                      >
                        Log in here
                      </a>
                    </p>
                  </div>
                </>
              )}
            </>
          ) : null}

          {!isOtpStep && (
            <div className="flex items-center justify-center my-4">
              <hr className="w-1/4 border-gray-300" />
              <span className="mx-4 text-gray-500">or</span>
              <hr className="w-1/4 border-gray-300" />
            </div>
          )}

          {!isOtpStep && (
            <button
              type="button"
              className="w-full text-black border-solid font-bold py-2 px-4 rounded flex items-center justify-center border border-gray-300"
            >
              <img
                src="/assets/Google.png"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Registration;
