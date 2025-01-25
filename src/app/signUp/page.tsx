"use client";
import SignUpForm from "./SignUpForm";

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">회원가입</h2>
                <SignUpForm />
                <div className="mt-4 text-center">
                    <a href="/login" className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                        이미 계정이 있으신가요? 로그인
                    </a>
                </div>
            </div>
        </div>
    );
}
