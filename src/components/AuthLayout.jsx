import { AlertCircle, CheckCircle } from 'lucide-react';

export default function AuthLayout({ children, error, success }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-violet-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
            <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}