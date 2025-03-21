import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-6xl mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">SaaS Platform</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="hidden md:inline">Don't have an account? </span>
            <Link 
              href="/auth/signup" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium ml-1"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2">
          <LoginForm 
            onSuccess={() => console.log('Login successful')}
            onError={(error) => console.error('Login error:', error)}
            redirectTo="/dashboard"
          />
        </div>

        {/* Right side - Features */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Why Join Our Platform?
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-blue-600 dark:text-blue-400">🚀</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Powerful Analytics</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Get insights with advanced data visualization and real-time dashboards.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-green-600 dark:text-green-400">🔒</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Enterprise Security</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Bank-level security with encryption, 2FA, and compliance certifications.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-purple-600 dark:text-purple-400">⚡</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Lightning Fast</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Optimized performance with global CDN and 99.9% uptime guarantee.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-yellow-600 dark:text-yellow-400">🌍</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Global Scale</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Deploy anywhere with multi-region support and automatic scaling.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">10K+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">24/7</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          By signing in, you agree to our{' '}
          <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
            Privacy Policy
          </Link>
        </p>
        <p className="mt-2">© 2025 SaaS Platform. All rights reserved.</p>
      </div>
    </div>
  );
}
EOF'
