import React, { useState } from 'react';
import { Search, Package, Phone, Truck, AlertCircle, ArrowLeft, Receipt, MapPin, Inbox, RefreshCcw } from 'lucide-react';
import { useTrackOrderByPhoneQuery, useTrackOrderByOrderIdQuery } from '@/store/Api/OrderApi';
import { motion, AnimatePresence } from 'framer-motion';
import OrderStepper from './Components/OrderStepper';

const OrderTrack = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTrigger, setSearchTrigger] = useState<{ term: string; type: 'phone' | 'id' | null }>({ term: '', type: null });

    const { data: phoneData, isLoading: phoneLoading } = useTrackOrderByPhoneQuery(
        searchTrigger.term,
        { skip: searchTrigger.type !== 'phone' }
    );

    const { data: idData, isLoading: idLoading } = useTrackOrderByOrderIdQuery(
        searchTrigger.term,
        { skip: searchTrigger.type !== 'id' }
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        const term = searchTerm.trim();
        if (/^\d+$/.test(term) && term.length >= 10) {
            setSearchTrigger({ term, type: 'phone' });
        } else {
            setSearchTrigger({ term, type: 'id' });
        }
    };

    const orders = searchTrigger.type === 'phone' ? phoneData?.data : idData?.data;
    const isLoading = phoneLoading || idLoading;

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 selection:bg-green-100 transition-colors">
            {/* Simple Top Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 py-4 hidden md:block">
                <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                    <span className="hover:text-green-600 dark:hover:text-green-400 cursor-pointer transition-colors">হোম</span>
                    <span className="text-gray-300 dark:text-slate-700">/</span>
                    <span className="text-gray-900 dark:text-slate-100 font-medium">অর্ডার ট্র্যাক</span>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8 md:py-16">
                <AnimatePresence mode="wait">
                    {!searchTrigger.term ? (
                        /* Hero Search Section */
                        <motion.div 
                            key="search-hero"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center"
                        >
                            <div className="mb-10">
                                <div className="inline-block p-4 bg-green-50 dark:bg-green-950/20 rounded-3xl mb-6">
                                    <Truck className="w-10 h-10 text-green-600 dark:text-green-400" />
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-slate-100 mb-6 tracking-tight">
                                    <span className="text-secondary">আপনার</span> অর্ডার ট্র্যাক করুন
                                </h1>
                                <p className="text-gray-500 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                                    অর্ডারের সঠিক অবস্থান এবং ডেলিভারির সময়কাল জানতে আপনার ফোন নম্বর অথবা অর্ডার আইডি ব্যবহার করুন।
                                </p>
                            </div>

                            <div className="max-w-2xl mx-auto">
                                <form onSubmit={handleSearch} className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                        <Search className="w-6 h-6 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full pl-16 pr-44 py-6 bg-white dark:bg-slate-900 border-2 border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] focus:border-green-500 focus:outline-none text-lg transition-all text-gray-900 dark:text-slate-100"
                                        placeholder="ফোন নম্বর বা অর্ডার আইডি লিখুন..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="absolute right-3 top-3 bottom-3 px-10 bg-green-600 hover:bg-green-700 text-white font-bold rounded-[2rem] shadow-xl shadow-green-100 dark:shadow-green-950/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                                    >
                                        {isLoading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : 'তথ্য দেখুন'}
                                    </button>
                                </form>
                                <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
                                    <div className="flex items-center gap-2 text-gray-400 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-gray-50 dark:border-slate-800 shadow-sm">
                                        <Phone className="w-4 h-4 text-green-500" />
                                        <span>নম্বর: 01XXXXXXXXX</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-gray-50 dark:border-slate-800 shadow-sm">
                                        <Package className="w-4 h-4 text-orange-500" />
                                        <span>আইডি: 65a4...</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* Results Page */
                        <motion.div 
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div>
                                    <button 
                                        onClick={() => setSearchTrigger({ term: '', type: null })}
                                        className="flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 font-bold transition-colors group cursor-pointer"
                                    >
                                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                        সার্চে ফিরে যান
                                    </button>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest mb-1">সার্চ রেজাল্ট</p>
                                    <p className="text-gray-900 dark:text-slate-100 font-bold">"{searchTrigger.term}"-এর জন্য {orders?.length || 0}টি অর্ডার পাওয়া গেছে</p>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] shadow-sm border border-gray-100 dark:border-slate-800">
                                    <div className="relative">
                                        <div className="w-20 h-20 border-4 border-green-100 dark:border-green-950/20 rounded-full animate-[ping_2s_infinite]"></div>
                                        <Truck className="w-10 h-10 text-green-600 dark:text-green-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <p className="mt-8 text-gray-500 dark:text-slate-400 font-bold tracking-widest uppercase text-xs">আপনার তথ্য খুঁজে দেখা হচ্ছে...</p>
                                </div>
                            ) : orders && orders?.length > 0 ? (
                                <div className="grid grid-cols-1 gap-12">
                                    {orders?.map((order: any, idx: number) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            key={order?._id}
                                        >
                                            <OrderDetailsCard order={order} />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white dark:bg-slate-900 p-16 rounded-[3rem] shadow-sm border border-gray-50 dark:border-slate-800 text-center"
                                >
                                    <div className="bg-red-50 dark:bg-red-950/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <AlertCircle className="w-12 h-12 text-red-400" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-slate-100 mb-3">দুঃখিত, কোনো অর্ডার পাওয়া যায়নি</h3>
                                    <p className="text-gray-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                                        আপনার প্রদান করা ফোন নম্বর বা অর্ডার আইডিটি সঠিক কিনা তা পুনরায় যাচাই করুন অথবা আমাদের হেল্পলাইনে যোগাযোগ করুন।
                                    </p>
                                    <button 
                                        onClick={() => setSearchTrigger({ term: '', type: null })}
                                        className="mt-8 px-8 py-4 bg-gray-900 dark:bg-slate-800 text-white font-bold rounded-2xl hover:bg-gray-800 dark:hover:bg-slate-700 transition-colors shadow-lg cursor-pointer"
                                    >
                                        আবার সার্চ করুন
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const OrderDetailsCard = ({ order }: { order: any }) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.04)] overflow-hidden border border-gray-100 dark:border-slate-800">
            {/* Header / Summary */}
            <div className="p-8 md:p-12 border-b border-gray-50 dark:border-slate-800/80 bg-[#FBFDFB]/50 dark:bg-slate-950/50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="bg-green-600 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <Inbox className="w-4 h-4" /> {order?.status}
                            </span>
                            <span className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-400 dark:text-slate-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                ID: {order?._id}
                            </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-slate-100">অর্ডারটির বর্তমান অবস্থা</h2>
                    </div>
                    
                    <div className="flex items-center gap-6 md:gap-12 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-50 dark:border-slate-700 shadow-sm">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest mb-1">তারিখ</p>
                            <p className="font-bold text-gray-900 dark:text-slate-100">
                                {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('bn-BD', {
                                    year: 'numeric', month: 'short', day: 'numeric'
                                }) : 'N/A'}
                            </p>
                        </div>
                        <div className="w-px h-10 bg-gray-100 dark:bg-slate-700"></div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest mb-1">মোট মূল্য</p>
                            <p className="text-2xl font-black text-green-600 dark:text-green-400">৳{order?.totalAmount}</p>
                        </div>
                    </div>
                </div>

                {/* Status Stepper */}
                <div className="mt-12 max-w-4xl mx-auto">
                    <OrderStepper status={order?.status || 'pending'} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left Side: Items and Breakdown */}
                <div className="lg:col-span-7 p-8 md:p-12 space-y-10">
                    <div>
                        <h3 className="text-xs font-black text-gray-400 dark:text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <Package className="w-4 h-4 text-green-600 dark:text-green-400" /> আইটেমসমূহ
                        </h3>
                        <div className="space-y-6">
                            {order?.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-6 group">
                                    <div className="relative overflow-hidden rounded-2xl w-24 h-24 bg-gray-50 dark:bg-slate-950 flex-shrink-0">
                                        <img 
                                            src={item?.image} 
                                            alt={item?.product?.basicInfo?.title} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 py-1">
                                        <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-2 truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                            {item?.product?.basicInfo?.title}
                                        </h4>
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                                            <p className="text-gray-400 dark:text-slate-400">পরিমাণ: <span className="text-gray-900 dark:text-slate-100 font-bold">{item?.quantity}</span></p>
                                            <p className="text-gray-400 dark:text-slate-400">মূল্য: <span className="text-gray-900 dark:text-slate-100 font-bold">৳{item?.price}</span></p>
                                        </div>
                                        {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3 text-gray-900 dark:text-slate-100 text-xs">
                                                Available Variant :
                                                {Object.entries(item.selectedVariants).map(([group, variants]: [string, any]) => (
                                                    Array.isArray(variants) ? variants.map((v: any, vIdx: number) => (
                                                        <span key={`${group}-${vIdx}`} className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                                             {v.value} ,
                                                        </span>
                                                    )) : (
                                                        <span key={group} className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider after:content-[' ,'] last:after:content-['']">
                                                             {variants.value} 
                                                        </span>
                                                    )
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right py-1">
                                        <p className="font-bold text-gray-900 dark:text-slate-100">৳{item?.price * item?.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 bg-gray-50/50 dark:bg-slate-950/50 rounded-3xl p-8 border border-gray-50 dark:border-slate-800">
                            <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-6 border-b border-gray-100 dark:border-slate-800 pb-4">মূল্য বিবরণী</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 dark:text-slate-400 font-medium">সাবটোটাল</span>
                                    <span className="text-gray-900 dark:text-slate-200 font-bold">৳{
                                        order.subTotal || order.items.reduce((acc : number, item : any) => acc + item.price * item.quantity, 0)
                                    }</span>
                                </div>
                                
                                {/* Combo Savings - Highlighted in Green */}
                                {order?.totalDiscount > 0 && (
                                    <div className="flex justify-between items-center text-sm bg-green-50 dark:bg-green-950/20 -mx-2 px-2 py-2 rounded-lg border border-green-200 dark:border-green-900/40">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-green-700 dark:text-green-400 font-semibold">কম্বো সেভিংস</span>
                                        </div>
                                        <span className="font-bold text-green-700 dark:text-green-400">-৳{order.totalDiscount}</span>
                                    </div>
                                )}
                                
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 dark:text-slate-400 font-medium">ডেলিভারি চার্জ</span>
                                    <span className="text-gray-900 dark:text-slate-200 font-bold">৳{order?.deliveryCharge || 0}</span>
                                </div>
                                
                                <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center">
                                    <span className="text-gray-900 dark:text-slate-100 font-black text-lg">সর্বমোট</span>
                                    <span className="text-2xl font-black text-green-600 dark:text-green-400 tracking-tight">৳{order?.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Information */}
                <div className="lg:col-span-5 bg-[#FBFDFB]/30 dark:bg-slate-950/30 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-slate-800 p-8 md:p-12 space-y-12">
                    <section>
                        <h3 className="text-xs font-black text-gray-400 dark:text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" /> ডেলিভারি ঠিকানা
                        </h3>
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-gray-50 dark:border-slate-700 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 dark:bg-green-950/20 rounded-bl-[4rem] -mr-8 -mt-8 opacity-50 transition-transform group-hover:scale-110"></div>
                           <div className="relative space-y-3">
                                <p className="text-lg font-black text-gray-900 dark:text-slate-100">{order?.billingInformation?.name}</p>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 text-sm">
                                    <Phone className="w-4 h-4 text-green-500" />
                                    <span>{order?.billingInformation?.phone}</span>
                                </div>
                                <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed pt-2">
                                    {order?.billingInformation?.address}
                                </p>
                           </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xs font-black text-gray-400 dark:text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <Receipt className="w-4 h-4 text-green-600 dark:text-green-400" /> পেমেন্ট ইনফো
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-50 dark:border-slate-700 shadow-sm">
                                <span className="text-gray-500 dark:text-slate-400 text-sm font-medium">পেমেন্ট মেথড</span>
                                <span className="text-gray-900 dark:text-slate-100 font-black bg-gray-50 dark:bg-slate-900 px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest">{order?.paymentInfo?.paymentMethod || 'COD'}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-50 dark:border-slate-700 shadow-sm">
                                <span className="text-gray-500 dark:text-slate-400 text-sm font-medium">পেমেন্ট স্ট্যাটাস</span>
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                    order?.paymentInfo?.status === 'paid' ? 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400' : 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400'
                                }`}>
                                    {order?.paymentInfo?.status || 'unpaid'}
                                </span>
                            </div>
                        </div>
                    </section>

                    <div className="bg-gradient-to-br from-green-600 to-green-700 p-8 rounded-[2rem] text-white shadow-xl shadow-green-100 dark:shadow-green-950/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="font-black text-lg mb-3 tracking-tight">হেল্প প্রয়োজন?</h4>
                            <p className="text-green-100 text-sm leading-relaxed mb-6 opacity-80">
                                অর্ডারের ব্যাপারে যেকোনো তথ্যের জন্য আমাদের কাস্টমার কেয়ারে যোগাযোগ করুন।
                            </p>
                            <a href="tel:+880123456789" className="inline-flex items-center gap-3 text-white font-black bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-2xl transition-all">
                                <Phone className="w-5 h-5" />
                                <span>কাস্টমার কেয়ার</span>
                            </a>
                        </div>
                        <Truck className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10 opacity-50 rotate-[-15deg]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTrack;
