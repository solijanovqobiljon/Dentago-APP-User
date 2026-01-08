import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
// Context'ni import qilish (Hali yaratmagan bo'lsangiz, manzili o'zgarishi mumkin)
import { useData } from '../context/DataProvider'; 
// Assetlar manzili (Yangi loyihada rasm borligiga ishonch hosil qiling)
import DentaGo from "../assets/dentago.png"; 

const Login = () => {
    // Context va Navigatsiya
    const { loginWithPhone } = useData(); 
    const navigate = useNavigate();

    // Form boshqaruvi
    const { handleSubmit, setValue } = useForm();

    // State'lar
    const [error, setError] = useState('');
    const [isSmsStep, setIsSmsStep] = useState(false);
    const [smsCode, setSmsCode] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState('+998');
    const [isLoading, setIsLoading] = useState(false);
    const [inputBorderState, setInputBorderState] = useState('default');
    const [phoneNotRegistered, setPhoneNotRegistered] = useState(false);

    const inputsRef = useRef([]);

    // 1. Ro'yxatdan o'tgandan keyin avtomatik SMS bosqichiga o'tish effekti
    useEffect(() => {
        const justRegistered = localStorage.getItem('justRegistered');
        const savedPhone = localStorage.getItem('userPhone');

        if (justRegistered === 'true' && savedPhone) {
            let formattedPhone = savedPhone.startsWith('+') ? savedPhone : '+' + savedPhone;
            setPhoneNumber(formatPhoneNumber(formattedPhone));
            setIsSmsStep(true);
            localStorage.removeItem('justRegistered');
            sendSmsCode(formattedPhone);
        }
    }, []);

    // 2. Telefon raqamini chiroyli formatlash (+998-XX-XXX-XX-XX)
    const formatPhoneNumber = (value) => {
        let numbers = value.replace(/\D/g, '');
        if (!numbers.startsWith('998')) numbers = '998' + numbers;

        let formatted = '+998';
        if (numbers.length > 3) formatted += '-' + numbers.substring(3, 5);
        if (numbers.length > 5) formatted += '-' + numbers.substring(5, 8);
        if (numbers.length > 8) formatted += '-' + numbers.substring(8, 10);
        if (numbers.length > 10) formatted += '-' + numbers.substring(10, 12);

        return formatted;
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhoneNumber(formatted);
        setValue('phone', formatted.replace(/\D/g, ''));
    };

    // 3. SMS kodini yuborish
    const sendSmsCode = async (customPhone = null) => {
        setIsLoading(true);
        setError('');
        setPhoneNotRegistered(false);

        const cleanPhone = (customPhone || phoneNumber).replace(/\D/g, '');
        const fullPhone = `+${cleanPhone}`;

        try {
            const response = await fetch('https://app.dentago.uz/api/auth/app/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: fullPhone }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setCountdown(60);
                setIsSmsStep(true);
                startTimer();
            } else {
                handleApiError(data, fullPhone);
            }
        } catch (err) {
            setError('Internet aloqasi muammosi yoki server xatosi');
        } finally {
            setIsLoading(false);
        }
    };

    const startTimer = () => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleApiError = (data, fullPhone) => {
        const msg = data.message?.toLowerCase() || '';
        if (msg.includes('not found') || msg.includes('regist')) {
            setPhoneNotRegistered(true);
            setError('Ushbu telefon raqami tizimda roʻyxatdan oʻtmagan.');
            localStorage.setItem('pendingRegisterPhone', fullPhone);
        } else {
            setError(data.message || 'SMS joʻnatishda xato yuz berdi');
        }
    };

    // 4. SMS tasdiqlash
    const handleSmsConfirm = async (code) => {
        if (code.length !== 6) return;
        setIsLoading(true);
        setError('');

        const fullPhone = `+${phoneNumber.replace(/\D/g, '')}`;

        try {
            const verifyResponse = await fetch('https://app.dentago.uz/api/auth/app/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: fullPhone, otp: code }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
                throw new Error(verifyData.message || 'Kod noto‘g‘ri');
            }

            // Tokenlarni saqlash
            localStorage.setItem('accessToken', verifyData.tokens.accessToken);
            localStorage.setItem('refreshToken', verifyData.tokens.refreshToken);
            
            // Foydalanuvchi ma'lumotlarini olish (Sizning kodingizdagi logika)
            let userForApp = { name: fullPhone.replace('+998', '9'), role: 'OPERATOR' };

            const meResponse = await fetch('https://app.dentago.uz/api/auth/me', {
                headers: { 'Authorization': `Bearer ${verifyData.tokens.accessToken}` }
            });

            if (meResponse.ok) {
                const meData = await meResponse.json();
                if (meData.user?.username) {
                    userForApp.name = meData.user.username.trim();
                }
            }

            localStorage.setItem('userData', JSON.stringify(userForApp));
            loginWithPhone(fullPhone, userForApp); // Contextni yangilash
            setInputBorderState('success');
            setTimeout(() => navigate('/dashboard'), 800);

        } catch (err) {
            setInputBorderState('error');
            setError(err.message);
            setSmsCode('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSmsInputChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        const newCodeArr = smsCode.split('');
        newCodeArr[index] = value;
        const newCode = newCodeArr.join('');
        setSmsCode(newCode);

        if (value && index < 5) inputsRef.current[index + 1]?.focus();
        if (newCode.length === 6) handleSmsConfirm(newCode);
    };

    // UI qismlari (Eski kodingizdagi chiroyli dizayn saqlab qolindi)
    return (
        <div className="min-h-screen bg-white flex">
            {/* Loading Spinner */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Dizayn qismi (Chap taraf rasm) */}
            <div className="hidden lg:flex w-3/5 bg-gray-100 relative">
                <img 
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop" 
                    className="absolute inset-0 w-full h-full object-cover" 
                    alt="Dental"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center p-20">
                    <div className="text-white max-w-md">
                        <h1 className="text-5xl font-bold mb-4">DentaGo</h1>
                        <p className="text-xl">Stomatologiya klinikasini boshqarishning eng oson yo'li.</p>
                    </div>
                </div>
            </div>

            {/* Form qismi (O'ng taraf) */}
            <div className="w-full lg:w-2/5 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <img src={DentaGo} alt="Logo" className="w-40 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-800">
                            {isSmsStep ? "Kodni tasdiqlang" : "Xush kelibsiz"}
                        </h2>
                    </div>

                    {!isSmsStep ? (
                        <form onSubmit={handleSubmit(() => sendSmsCode())} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqam</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                    <input 
                                        type="text" 
                                        value={phoneNumber} 
                                        onChange={handlePhoneChange}
                                        className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="+998-90-123-45-67"
                                    />
                                </div>
                            </div>
                            {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2"><XCircle className="w-4 h-4"/> {error}</div>}
                            
                            {!phoneNotRegistered ? (
                                <button className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition">
                                    Kodni olish
                                </button>
                            ) : (
                                <button type="button" onClick={() => navigate('/register')} className="w-full bg-green-500 text-white py-3 rounded-xl font-bold">
                                    Ro'yxatdan o'tish
                                </button>
                            )}
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <button onClick={() => setIsSmsStep(false)} className="flex items-center gap-2 text-sm text-gray-500"><ArrowLeft className="w-4 h-4"/> Orqaga</button>
                            <div className="flex justify-between gap-2">
                                {[...Array(6)].map((_, i) => (
                                    <input
                                        key={i}
                                        ref={el => inputsRef.current[i] = el}
                                        maxLength="1"
                                        className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg outline-none focus:border-blue-500 ${inputBorderState === 'error' ? 'border-red-500' : 'border-gray-200'}`}
                                        onChange={(e) => handleSmsInputChange(i, e.target.value)}
                                    />
                                ))}
                            </div>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <p className="text-center text-gray-500 text-sm">
                                {countdown > 0 ? `Qayta yuborish: ${countdown}s` : <span onClick={() => sendSmsCode()} className="text-blue-500 cursor-pointer">Kodni qayta yuborish</span>}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;