import { useLocation } from 'react-router-dom';

const Error = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const message = searchParams.get('message');
    

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full mx-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {message === 'cancel' ? 'Payment Cancelled' : 
             message === 'failure' ? 'Insufficient Fund' : 
             'Payment Failed'}
          </h2>
          <div className="h-1 w-20 bg-red-500 mx-auto mb-6"></div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/'}
              className="px-8 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Return Home
            </button>
            <button
              onClick={() => window.location.href = '/checkout'}
              className="px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Error