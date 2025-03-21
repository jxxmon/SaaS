import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-6xl mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">SaaS Platform</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <Link 
              href="/auth/login" 
              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 font-medium"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2">
          <ForgotPasswordForm 
            onSuccess={() => console.log('Password reset email sent')}
            onError={(error) => console.error('Password reset error:', error)}
          />
        </div>

        {/* Right side - Security info */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Account Security Tips
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-yellow-600 dark:text-yellow-400">🔐</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Strong Passwords</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Use at least 12 characters with mix of letters, numbers, and symbols.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-blue-600 dark:text-blue-400">📱</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Enable 2FA for an extra layer of security on your account.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-red-600 dark:text-red-400">⚠️</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Phishing Protection</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Never share your password. We'll never ask for it via email.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-green-600 dark:text-green-400">🔄</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Regular Updates</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Change your password every 90 days and use unique passwords for each service.
                  </p>
                </div>
              </div>
            </div>

            {/* Security stats */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">99.9%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Security uptime</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">256-bit</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Encryption</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Need help? Contact our{' '}
          <Link href="/support" className="text-yellow-600 dark:text-yellow-400 hover:underline">
            support team
          </Link>{' '}
          or check our{' '}
          <Link href="/security" className="text-yellow-600 dark:text-yellow-400 hover:underline">
            security center
          </Link>
        </p>
        <p className="mt-2">© 2025 SaaS Platform. All rights reserved.</p>
      </div>
    </div>
  );
}
EOF && echo '비밀번호 재설정 페이지 생성 완료'
