import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowLeft, XCircle, CheckCircle } from 'lucide-react';
import { useData } from './Dataprovider'; // o'z yo'lingizga moslashtiring
import DentaGo from '../../assets/logo.png';      // logongiz yo'li

const Login = () => {
    const { loginWithPhone } = useData();
    const navigate = useNavigate();

    const [phoneNumber, setPhoneNumber] = useState('+998');
    const [isSmsStep, setIsSmsStep] = useState(false);
    const [smsCode, setSmsCode] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [inputState, setInputState] = useState('default'); // 'default' | 'success' | 'error'

    const inputsRef = useRef([]);

    // Telefon raqamini chiroyli formatlash
    const formatPhone = (value) => {
        const cleaned = value.replace(/\D/g, '');
        const withPrefix = cleaned.startsWith('998') ? cleaned : '998' + cleaned;

        let result = '+998';
        const digits = withPrefix.substring(3);

        if (digits.length > 0) result += ' ' + digits.substring(0, 2);
        if (digits.length > 2) result += ' ' + digits.substring(2, 5);
        if (digits.length > 5) result += ' ' + digits.substring(5, 7);
        if (digits.length > 7) result += ' ' + digits.substring(7, 9);

        return result;
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhone(e.target.value);
        setPhoneNumber(formatted);
        setError('');
    };

    // SMS kod yuborish
    const sendSms = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        const cleanPhone = phoneNumber.replace(/\D/g, '');
        if (cleanPhone.length !== 12) {
            setError('Telefon raqami to\'liq kiritilmagan');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('https://app.dentago.uz/api/auth/app/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: `+${cleanPhone}` }),
            });

            const data = await response.json();

            if (!response.ok || !data?.success) {
                if (data?.message?.toLowerCase().includes('not found') || 
                    data?.message?.toLowerCase().includes("ro'yxatdan")) {
                    setError("Bu raqam ro'yxatdan o'tmagan");
                    // Agar register sahifasi bo'lsa shu yerga yo'naltirish mumkin
                    // navigate('/register');
                } else {
                    throw new Error(data?.message || 'Xatolik yuz berdi');
                }
            } else {
                setCountdown(60);
                setIsSmsStep(true);
                startCountdown();
            }
        } catch (err) {
            setError(err.message || 'Server bilan aloqa muammosi');
        } finally {
            setIsLoading(false);
        }
    };

    const startCountdown = () => {
        let time = 60;
        const timer = setInterval(() => {
            time--;
            setCountdown(time);
            if (time <= 0) clearInterval(timer);
        }, 1000);
    };

    // SMS kodni tekshirish va login
    const verifyCode = async (code) => {
        if (code.length !== 6) return;

        setIsLoading(true);
        setError('');
        setInputState('default');

        const fullPhone = `+${phoneNumber.replace(/\D/g, '')}`;

        try {
            // 1. OTP tekshirish
            const verifyRes = await fetch('https://app.dentago.uz/api/auth/app/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: fullPhone, otp: code }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData?.success) {
                throw new Error(verifyData?.message || "Kod noto'g'ri");
            }

            const { accessToken, refreshToken } = verifyData.tokens;

            // Tokenlarni saqlash
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            // 2. User ma'lumotlarini olish
            const meRes = await fetch('https://app.dentago.uz/api/auth/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            let user = {
                phone: fullPhone,
                name: fullPhone.replace('+998', '9...'),
                role: 'USER',
            };

            if (meRes.ok) {
                const meData = await meRes.json();
                if (meData?.user) {
                    user = {
                        ...user,
                        id: meData.user.id,
                        name: meData.user.username || meData.user.full_name || user.name,
                        role: meData.user.role || user.role,
                    };
                }
            }

            // 3. LocalStorage + Context yangilash
            localStorage.setItem('userData', JSON.stringify(user));
            loginWithPhone(fullPhone, user, accessToken);

            setInputState('success');
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 700);

        } catch (err) {
            setInputState('error');
            setError(err.message);
            setSmsCode('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCodeChange = (index, value) => {
        if (value && !/^[0-9]$/.test(value)) return;

        const newCode = smsCode.split('');
        newCode[index] = value;
        const joined = newCode.join('');
        setSmsCode(joined);

        // Avto-focus keyingi / oldingi katak
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        } else if (!value && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }

        if (joined.length === 6) {
            verifyCode(joined);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 p-8 text-white text-center">
                    <img src={DentaGo} alt="DentaGo" className="w-32 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold">
                        {isSmsStep ? "Kodni kiriting" : "Tizimga xush kelibsiz"}
                    </h1>
                </div>

                <div className="p-8">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    {!isSmsStep ? (
                        <form onSubmit={sendSms} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Telefon raqamingiz
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={handlePhoneChange}
                                        className={`w-full pl-12 pr-4 py-3.5 border rounded-lg outline-none transition-all
                      ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                                        placeholder="+998 90 123 45 67"
                                        autoComplete="tel"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2 text-sm">
                                    <XCircle size={18} /> {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60"
                            >
                                Kodni olish
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <button
                                onClick={() => setIsSmsStep(false)}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
                            >
                                <ArrowLeft size={16} /> Orqaga
                            </button>

                            <div className="flex justify-center gap-3">
                                {[...Array(6)].map((_, i) => (
                                    <input
                                        key={i}
                                        ref={el => (inputsRef.current[i] = el)}
                                        type="text"
                                        maxLength={1}
                                        value={smsCode[i] || ''}
                                        onChange={e => handleCodeChange(i, e.target.value)}
                                        className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg outline-none transition-all
                      ${
                          inputState === 'error'
                              ? 'border-red-500 animate-pulse'
                              : inputState === 'success'
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-300 focus:border-blue-500'
                      }`}
                                        autoFocus={i === 0}
                                    />
                                ))}
                            </div>

                            {error && (
                                <p className="text-red-600 text-center text-sm">{error}</p>
                            )}

                            <p className="text-center text-sm text-gray-500">
                                {countdown > 0 ? (
                                    `Qayta yuborish: ${countdown} soniya`
                                ) : (
                                    <button
                                        type="button"
                                        onClick={sendSms}
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        Kodni qayta yuborish
                                    </button>
                                )}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;