import { Mail, Lock, LogIn, Eye, EyeOff, ArrowRight, Briefcase } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { useLogin } from './hooks/useAuth';
import ForgotPasswordModal from './components/ForgotPasswordModal';

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');

    const { mutateAsync: login, isPending: isLoading } = useLogin();
    const navigate = useNavigate();
    const setToken = useAuthStore(state => state.setToken);
    const setCurrentUser = useAuthStore(state => state.setCurrentUser);
    const [rememberMe, setRememberMe] = useState(false);

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!loginData.email.trim()) {
                toast.error('The email field is require');
                return;
            }

            if (!loginData.password.trim()) {
                toast.error('The password field is require');
                return;
            }

            const response = await login(loginData);
            toast.success(response.data.message);
            console.log(response.data);

            const user = response.data?.data?.user;
            const token = response.data?.Token;

            if (user && token) {
                // Save remember_me choice first, so the store knows where to save
                localStorage.setItem('remember_me', rememberMe ? 'true' : 'false');
                localStorage.setItem('login_timestamp', Date.now().toString());

                // Save token and user to the store and localStorage/sessionStorage
                setToken(token);

                // Determine user role from the new backend response structure
                const userRole = (response.data.data.role || user.role || user.job_title || 'employee').toLowerCase();
                const userWithRole = {
                    ...user,
                    role: userRole,
                    role_id: response.data.data.role_id
                };

                setCurrentUser(userWithRole);

                // Redirect based on role
                if (userRole.includes('admin') || userRole.includes('ceo')) {
                    navigate('/admin');
                } else if (userRole.includes('hr')) {
                    navigate('/Hr');
                } else if (userRole.includes('manager')) {
                    navigate('/manager');
                } else {
                    navigate('/employee');
                }
            }

        } catch (e: any) {
            console.error('Full error:', e);

            if (e.response) {
                const errorMessage =
                    e.response.data?.message ||
                    e.response.data?.error ||
                    (e.response.status === 401 ? 'Invalid email or password. Please try again.' : 
                     e.response.status === 500 ? 'Server error occurred. Please try again later.' :
                     e.response.statusText) ||
                    'Something went wrong';
                toast.error(errorMessage);
            } else if (e.request) {
                toast.error('No response from server. Please check your connection.');
            } else {
                toast.error(e.message || 'Login failed');
            }
        }
    }

    useEffect(() => {
        console.log(loginData)
    }, [loginData])

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#4A7C59] via-[#4A4E4A] to-[#6B6358] relative overflow-hidden" dir="ltr">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#C4A66A] opacity-20 blur-[100px]"></div>
                <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-[#4A7C59] opacity-40 blur-[120px]"></div>
                <div className="absolute bottom-0 left-[20%] w-[30%] h-[30%] rounded-full bg-[#C4A66A] opacity-10 blur-[80px]"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8 flex flex-col items-center relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/80 rounded-full blur-[60px] pointer-events-none"></div>
                    <img src="/logo-login.png" alt="MasarHR Logo" className="w-48 h-auto object-contain mix-blend-multiply relative z-10" />
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-5 sm:p-7 md:p-8">
                    <form className="space-y-4 sm:space-y-5" onSubmit={(e) => handleSubmit(e)}>
                        <div>
                            <label htmlFor="email" className="block text-sm sm:text-base font-bold text-white mb-1.5">
                                Email Address <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-white/70" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name='email'
                                    value={loginData.email}
                                    onChange={(e) => handleChange(e)}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 border border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition-all duration-200 bg-white/10 text-white placeholder-white/50 hover:bg-white/20 focus:bg-white/20 text-sm sm:text-base"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm sm:text-base font-bold text-white mb-1.5">
                                Password <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-white/70" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={loginData?.password}
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Enter your password"
                                    name='password'
                                    className="w-full pl-10 pr-12 py-2.5 border border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition-all duration-200 bg-white/10 text-white placeholder-white/50 hover:bg-white/20 focus:bg-white/20 text-sm sm:text-base"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white transition-colors hover:cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-white border-white/30 rounded focus:ring-white/50 bg-white/10"
                                />
                                <label htmlFor="remember" className="text-xs sm:text-sm font-semibold text-white/90 cursor-pointer">
                                    Remember me
                                </label>
                            </div>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsForgotModalOpen(true);
                                }}
                                className="text-xs sm:text-sm font-semibold text-white/90 hover:text-white hover:underline transition-colors"
                            >
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2.5 sm:py-3 text-base font-bold text-[#4A7C59] bg-white hover:bg-gray-100 border border-transparent rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sign in...' :
                                <div className='flex items-center gap-2'>
                                    Sign In
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            }
                        </button>
                    </form>

                    {/* Guest / Careers Portal Button */}
                    <div className="mt-5 pt-4 border-t border-white/15 text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/careers')}
                            className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white border border-white/25 rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 font-bold text-xs sm:text-sm backdrop-blur-md group hover:border-white/40 cursor-pointer"
                        >
                            <Briefcase className="w-4 h-4 text-white/80 group-hover:text-white transition-colors flex-shrink-0" />
                            <span>هل أنت ضيف؟ تصفح الوظائف</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 flex-shrink-0" />
                        </button>
                    </div>

                </div>
            </div>

            <ForgotPasswordModal
                isOpen={isForgotModalOpen}
                onClose={() => setIsForgotModalOpen(false)}
            />
        </div>
    )
}

export default Login