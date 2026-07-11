import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGetOrderByIdQuery } from "@/store/Api/OrderApi";
import { useGetSettingsQuery } from "@/store/Api/SettingsApi";
import { useGetHost } from "@/utils/useGetHost";

import { Button } from "@heroui/react";
import { Printer, ArrowLeft, LayoutTemplate, Store, User } from "lucide-react";
import InvoiceTemplate2 from "./Templates/InvoiceTemplate2";
import InvoiceTemplate3 from "./Templates/InvoiceTemplate3";
import InvoiceTemplate5 from "./Templates/InvoiceTemplate5";

const inputClass = "w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 transition-colors";
const labelClass = "text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1.5";

const InvoiceContainer = () => {
  const host = useGetHost();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const template = searchParams.get("template") || "template2";

  const { data: response, isLoading: orderLoading, error } = useGetOrderByIdQuery(id);
  const { data: settingsResponse, isLoading: settingsLoading } = useGetSettingsQuery({});
  const order = response?.data;

  const [buyerInfo, setBuyerInfo] = useState({ name: "", address: "", phone: "", email: "" });
  const [sellerInfo, setSellerInfo] = useState({ name: "", logo: "", address: "", phone: "", email: "", web: "" });

  useEffect(() => {
    if (order?.billingInformation) {
      setBuyerInfo({
        name: order.billingInformation.name || "",
        address: order.billingInformation.address || "",
        phone: order.billingInformation.phone || "",
        email: order.billingInformation.email || ""
      });
    }
  }, [order]);

  useEffect(() => {
    if (settingsResponse?.data?.adminInfo) {
       const info = settingsResponse.data.adminInfo;
       setSellerInfo({
         name: info.siteName || host.title || "",
         logo: info.logo || host.logo || "",
         address: info.information || "Dhaka, Bangladesh",
         phone: info.contact || host.phone || "+880 1XXXXXXXXX",
         email: info.email || host.email || "support@bestbuy4ubd.com",
         web: host.title ? `www.${host.title.toLowerCase().replace(/\s/g, "")}.com` : "www.bestbuy4ubd.com"
       });
    }
  }, [settingsResponse, host]);

  if (orderLoading || settingsLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-red-100 dark:border-red-900/30">
          <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-2">Order Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">The invoice you are looking for does not exist or an error occurred.</p>
          <Button color="primary" variant="flat" onPress={() => navigate(-1)} startContent={<ArrowLeft className="w-4 h-4" />}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleBuyerChange = (e: any) => {
    setBuyerInfo({ ...buyerInfo, [e.target.name]: e.target.value });
  };

  const handleSellerChange = (e: any) => {
    setSellerInfo({ ...sellerInfo, [e.target.name]: e.target.value });
  };

  const renderTemplate = () => {
    switch (template.toLowerCase()) {
      case "template5":
        return <InvoiceTemplate5 order={order} buyerInfo={buyerInfo} sellerInfo={sellerInfo} />;
      case "template3":
        return <InvoiceTemplate3 order={order} buyerInfo={buyerInfo} sellerInfo={sellerInfo} />;
      case "template2":
      default:
        return <InvoiceTemplate2 order={order} buyerInfo={buyerInfo} sellerInfo={sellerInfo} />;
    }
  };

  return (
    <div className="min-h-screen dark:bg-slate-950 print:p-0 print:bg-white print:min-h-0 font-sans">
      <style>{`
        @media print {
          @page {
            margin: 0;
            size: ${template.toLowerCase() === "template5" ? "A4 landscape" : "A4 portrait"};
          }
          body {
            background-color: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          header, footer, nav {
            display: none !important;
          }
          .print-full-width {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
      
      {/* Modern Glassmorphic Toolbar */}
      <div className="w-full max-w-[1600px] mx-auto mb-6 print:hidden sticky top-4 z-10">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button
              isIconOnly
              variant="flat"
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              onPress={() => navigate(`/admin/orders/${id}`)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
            
            <div className="flex items-center gap-3 flex-1 sm:flex-none relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <LayoutTemplate className="w-4 h-4" />
              </div>
              <select
                id="template-select"
                value={template}
                onChange={(e) => setSearchParams({ template: e.target.value })}
                className="block w-full sm:w-56 pl-10 pr-10 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50"
              >
                <option value="template2">Professional Layout</option>
                <option value="template3">Minimalist View</option>
                <option value="template5">POS Receipt</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          
          <Button
            color="primary"
            onPress={handlePrint}
            startContent={<Printer className="w-4 h-4" />}
            className="w-full sm:w-auto rounded-lg font-semibold"
          >
            Print Invoice
          </Button>
        </div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-6 items-start print:block print:max-w-none print:w-full print:m-0 print:px-0">
        
        {/* Editor Sidebar */}
        <div className="w-full lg:w-1/4 xl:w-1/5 space-y-6 print:hidden sticky top-28">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Store className="w-4 h-4 text-blue-500" /> Seller Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Company Name</label>
                <input type="text" name="name" value={sellerInfo.name} onChange={handleSellerChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <input type="text" name="address" value={sellerInfo.address} onChange={handleSellerChange} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={labelClass}>Phone</label>
                  <input type="text" name="phone" value={sellerInfo.phone} onChange={handleSellerChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email / Web</label>
                  <input type="text" name="email" value={sellerInfo.email} onChange={handleSellerChange} className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <User className="w-4 h-4 text-emerald-500" /> Buyer Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Customer Name</label>
                <input type="text" name="name" value={buyerInfo.name} onChange={handleBuyerChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <input type="text" name="address" value={buyerInfo.address} onChange={handleBuyerChange} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={labelClass}>Phone</label>
                  <input type="text" name="phone" value={buyerInfo.phone} onChange={handleBuyerChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="text" name="email" value={buyerInfo.email} onChange={handleBuyerChange} className={inputClass} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Document Wrapper */}
        <div className="w-full lg:w-3/4 xl:w-4/5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-all duration-300 print:max-w-none print:w-full print:m-0 print:border-none print:rounded-none print-full-width">
          {renderTemplate()}
        </div>

      </div>
    </div>
  );
};

export default InvoiceContainer;
