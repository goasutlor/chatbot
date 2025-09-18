export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-primary-200">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-red-600 rounded"></div>
        </div>
        <h1 className="text-xl font-bold text-primary-900 mb-2">Access Denied</h1>
        <p className="text-primary-600 mb-6">
          Please use your company Google account to access Ko Chatbot.
        </p>
        <a
          href="/"
          className="inline-block bg-accent-500 hover:bg-accent-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
        >
          Back to Home
        </a>
      </div>
    </div>
  )
}
