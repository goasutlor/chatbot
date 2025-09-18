import { LoginButton } from '@/components/LoginButton'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
        <p className="text-gray-600 mb-6">
          Sign in to access the multi-LLM chat interface
        </p>
        <LoginButton />
      </div>
    </div>
  )
}
