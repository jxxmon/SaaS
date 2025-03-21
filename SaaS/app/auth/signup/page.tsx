import SignUpForm from '@/components/auth/SignUpForm';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-6xl mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">SaaS Platform</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="hidden md:inline">Already have an account? </span>
            <Link 
              href="/auth/login" 
              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium ml-1"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2">
          <SignUpForm 
            onSuccess={() => console.log('Sign up successful')}
            onError={(error) => console.error('Sign up error:', error)}
            redirectTo="/dashboard"
          />
        </div>

        {/* Right side - Benefits */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Start Your Free Trial Today
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-green-600 dark:text-green-400">🎯</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">14-Day Free Trial</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Full access to all features. No credit card required.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-blue-600 dark:text-blue-400">📊</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Advanced Analytics</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Real-time insights with customizable dashboards and reports.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-purple-600 dark:text-purple-400">🤖</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">AI-Powered Tools</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Automate workflows with intelligent recommendations and predictions.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-yellow-600 dark:text-yellow-400">👥</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Team Collaboration</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Invite team members with role-based permissions and shared workspaces.
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing tiers */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Simple, Transparent Pricing</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">Free</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Basic features</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">Pro</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">9/month</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">Enterprise</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Custom</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-green-600 dark:text-green-400 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-green-600 dark:text-green-400 hover:underline">
            Privacy Policy
          </Link>
        </p>
        <p className="mt-2">© 2025 SaaS Platform. All rights reserved.</p>
      </div>
    </div>
  );
}
EOF && echo '회원가입 페이지 생성 완료'
