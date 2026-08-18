import { Mail, Lock, LogIn, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useLogin } from './hooks/useAuth';

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');

    const {mutateAsync: login , isPending: isLoading} = useLogin();

    const [loginData , setLoginData] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const {name , value} = e.target;
        setLoginData(prev => ({...prev , [name]: value}));
    }

    const handleSubmit = async (e:React.SubmitEvent<HTMLFormElement>) =>{
        e.preventDefault();
        try{
            if(!loginData.email.trim()){
                toast.error('The email field is require');
                return;
            }

            if(!loginData.password.trim()){
                toast.error('The password field is require');
                return;
            }

            const reponse = await login(loginData);
            toast.success(reponse.data.message);
            console.log(reponse.data)

        }catch (e: any) {
            console.error('Full error:', e);
            
            if (e.response) {
                const errorMessage = 
                    e.response.data?.message || 
                    e.response.data?.error || 
                    e.response.statusText ||
                    'Something went wrong';
                
                if (e.response.data?.errors) {
                    const errors = e.response.data.errors;
                    const errorMessages = Object.values(errors).flat();
                    toast.error(errorMessages[0] as string || 'Validation error');
                } else {
                    toast.error(errorMessage);
                }
            } else if (e.request) {
                toast.error('No response from server. Please check your connection.');
            } else {
                toast.error(e.message || 'Failed to update holiday');
            }
        }
    }

    useEffect(() =>{
        console.log(loginData)
    } , [loginData])

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8 flex flex-col items-center">
                    <img src="/logo.png" alt="MasarHR Logo" className="w-48 h-auto object-contain" />
                </div>

                <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 md:p-8">
                    <form className="space-y-5" onSubmit={(e) => handleSubmit(e)}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-dark mb-1.5">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-brown" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name='email'
                                    value={loginData.email}
                                    onChange={(e) =>handleChange(e)}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green focus:border-green outline-none transition-all duration-200 bg-surface hover:bg-white focus:bg-white"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-dark mb-1.5">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-brown" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={loginData?.password}
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Enter your password"
                                    name='password'
                                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green focus:border-green outline-none transition-all duration-200 bg-surface hover:bg-white focus:bg-white"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-brown hover:text-dark transition-colors hover:cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="w-4 h-4 text-green border-gray-300 rounded focus:ring-green"
                                />
                                <label htmlFor="remember" className="text-sm text-brown cursor-pointer">
                                    Remember me
                                </label>
                            </div>
                            <a
                                href="#"
                                className="text-sm font-medium text-green hover:text-green-dark hover:underline transition-colors"
                            >
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2.5 text-sm font-medium text-white bg-green hover:bg-green-dark rounded-xl transition-all duration-200 shadow-card hover:shadow-card-hover flex items-center justify-center gap-2 disabled:opacity-50"
                            disabled={isLoading}

                        >
                            {isLoading? 'Sing in...' : 
                                <div className='flex items-center gap-2'>
                                    Sing In
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            }
                            
                        </button>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Login