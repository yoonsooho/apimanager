import LoginForm from "@/app/login/LoginForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">로그인</h2>
                <LoginForm />
                <div className="mt-4 text-center">
                    <a href="/signUp" className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                        계정이 없으신가요? 회원가입
                    </a>
                </div>
            </div>
        </div>
    );
}
