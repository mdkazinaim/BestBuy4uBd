/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* This is a checkout component that handles the entire checkout flow including:
- Personal details collection
- Shipping information
- Order notes
- Payment method selection (bKash or Cash on Delivery)
- Order review and confirmation
*/
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import OrderSummary from './OrderSummary'
import CheckoutForm from './CheckOutForm'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import OrderSuccessModal from '../Admin/AdminDashboard/LandingPage/OrderSuccessModal'

/* Main checkout component that manages the checkout steps and payment selection */
export default function Checkout() {
  const cartItems = useSelector((state) => state.cart?.cartItems)
  // const [showSuccessModal, setShowSuccessModal] = useState(false)
  // const [successOrderDetails, setSuccessOrderDetails] = useState(null)

  // Redirect if cart is empty
  if (!cartItems?.length) {
    return <Navigate to="/" replace />
  }

  // const handleOrderSuccess = (orderDetails) => {
  //   setSuccessOrderDetails(orderDetails)
  //   // setShowSuccessModal(true)
  // }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-green-50 to-white">
      <ToastContainer />
      <div className="container px-4 mx-auto">
        <div className="overflow-hidden bg-white border border-green-100 shadow-2xl rounded-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Checkout Form */}
            <div className="order-2 p-4 bg-white md:p-10 md:order-none ">
              <h1 className="flex items-center mb-6 text-2xl font-bold text-gray-800 md:text-3xl md:mb-8">
                <span className="flex items-center justify-center w-8 h-8 mr-3 bg-green-100 rounded-full md:w-10 md:h-10 md:mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                চেকআউট
              </h1>
              {/* <CheckoutForm onOrderSuccess={handleOrderSuccess} /> */}
              <CheckoutForm />
            </div>

            {/* Order Summary */}
            <div className="p-4 md:p-10 bg-gradient-to-br from-green-50 via-white to-green-50">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {/* {successOrderDetails && (
        <OrderSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          orderDetails={successOrderDetails}
        />
      )} */}
    </div>
  )
}
