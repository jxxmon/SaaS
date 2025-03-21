            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Google</span>
          </button>

          <button
            type="button"
            onClick={() => console.log("GitHub sign up")}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            disabled={isLoading}
          >
            <span className="mr-2">🐙</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">GitHub</span>
          </button>

          <button
            type="button"
            onClick={() => console.log("Microsoft sign up")}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            disabled={isLoading}
          >
            <span className="mr-2">🪟</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Microsoft</span>
          </button>
        </div>

        {/* Demo note */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start">
            <span className="text-blue-500 mr-2">💡</span>
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Demo Account</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Any valid form data will be accepted. No real registration occurs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF && echo 'SignUpForm 완성 완료' && echo '' && echo '파일 크기:' && wc -l components/auth/SignUpForm.tsx
