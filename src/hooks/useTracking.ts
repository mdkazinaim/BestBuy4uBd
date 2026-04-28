
/**
 * Custom hook for Google Tag Manager and GA4 Tracking
 * Follows GA4 Ecommerce schema
 */
export const useTracking = () => {
  const pushToDataLayer = (eventData: any) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(eventData);
    }
  };

  const trackEvent = (event: string, params: Record<string, any> = {}) => {
    pushToDataLayer({
      event,
      ...params,
    });
  };

  const trackAddToCart = (product: {
    id: string;
    name: string;
    price: number;
    category?: string;
    brand?: string;
    variant?: string;
    quantity: number;
  }) => {
    pushToDataLayer({
      event: "add_to_cart",
      ecommerce: {
        currency: "BDT",
        value: product.price * product.quantity,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            item_brand: product.brand,
            item_variant: product.variant,
            price: product.price,
            quantity: product.quantity,
          },
        ],
      },
    });
  };

  const trackPurchase = (order: {
    transaction_id: string;
    value: number;
    tax?: number;
    shipping?: number;
    currency?: string;
    coupon?: string;
    items: Array<{
      item_id: string;
      item_name: string;
      price: number;
      quantity: number;
      item_category?: string;
      item_variant?: string;
    }>;
    user_data?: {
      email?: string;
      phone_number?: string;
      address?: {
        first_name?: string;
        last_name?: string;
        street?: string;
        city?: string;
        region?: string;
        postal_code?: string;
        country?: string;
      };
    };
  }) => {
    pushToDataLayer({
      event: "purchase",
      ecommerce: {
        transaction_id: order.transaction_id,
        value: order.value,
        tax: order.tax || 0,
        shipping: order.shipping || 0,
        currency: order.currency || "BDT",
        coupon: order.coupon || "",
        items: order.items,
      },
      user_data: order.user_data,
    });
  };

  const trackViewItem = (product: {
    id: string;
    name: string;
    price: number;
    category?: string;
  }) => {
    pushToDataLayer({
      event: "view_item",
      ecommerce: {
        currency: "BDT",
        value: product.price,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            price: product.price,
          },
        ],
      },
    });
  };

  const trackBeginCheckout = (items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
    variant?: string;
  }[], value: number, coupon?: string) => {
    pushToDataLayer({
      event: "begin_checkout",
      ecommerce: {
        currency: "BDT",
        value: value,
        coupon: coupon,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          item_variant: item.variant,
          price: item.price,
          quantity: item.quantity
        }))
      }
    });
  };

  const trackAddToWishlist = (product: {
    id: string;
    name: string;
    price: number;
    category?: string;
  }) => {
    pushToDataLayer({
      event: "add_to_wishlist",
      ecommerce: {
        currency: "BDT",
        value: product.price,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            price: product.price,
          }
        ]
      }
    });
  };

  const trackRemoveFromCart = (product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    variant?: string;
  }) => {
    pushToDataLayer({
      event: "remove_from_cart",
      ecommerce: {
        currency: "BDT",
        value: product.price * product.quantity,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_variant: product.variant,
            price: product.price,
            quantity: product.quantity,
          }
        ]
      }
    });
  };

  const trackViewItemList = (items: {
    id: string;
    name: string;
    price: number;
    category?: string;
    list_name?: string;
    list_id?: string;
  }[]) => {
    pushToDataLayer({
      event: "view_item_list",
      ecommerce: {
        item_list_id: items[0]?.list_id || "general_list",
        item_list_name: items[0]?.list_name || "General List",
        items: items.map((item, index) => ({
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          price: item.price,
          index: index + 1
        }))
      }
    });
  };

  const trackSelectItem = (item: {
    id: string;
    name: string;
    price: number;
    category?: string;
    list_name?: string;
    list_id?: string;
  }) => {
    pushToDataLayer({
      event: "select_item",
      ecommerce: {
        item_list_id: item.list_id || "general_list",
        item_list_name: item.list_name || "General List",
        items: [{
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          price: item.price
        }]
      }
    });
  };

  const trackViewCart = (items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    variant?: string;
  }[], value: number) => {
    pushToDataLayer({
      event: "view_cart",
      ecommerce: {
        currency: "BDT",
        value: value,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          item_variant: item.variant,
          price: item.price,
          quantity: item.quantity
        }))
      }
    });
  };

  const trackAddShippingInfo = (items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[], value: number, shipping_tier: string) => {
    pushToDataLayer({
      event: "add_shipping_info",
      ecommerce: {
        currency: "BDT",
        value: value,
        shipping_tier: shipping_tier,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      }
    });
  };

  const trackAddPaymentInfo = (items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[], value: number, payment_type: string) => {
    pushToDataLayer({
      event: "add_payment_info",
      ecommerce: {
        currency: "BDT",
        value: value,
        payment_type: payment_type,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      }
    });
  };

  const trackLogin = (method: string) => {
    pushToDataLayer({
      event: "login",
      method: method
    });
  };

  const trackSignUp = (method: string) => {
    pushToDataLayer({
      event: "sign_up",
      method: method
    });
  };

  const trackSearch = (search_term: string) => {
    pushToDataLayer({
      event: "search",
      search_term: search_term
    });
  };

  const trackShare = (method: string, content_type: string, item_id: string) => {
    pushToDataLayer({
      event: "share",
      method: method,
      content_type: content_type,
      item_id: item_id
    });
  };

  const trackWishlistRemove = (product: {
    id: string;
    name: string;
    price: number;
    category?: string;
  }) => {
    pushToDataLayer({
      event: "wishlist_remove",
      ecommerce: {
        currency: "BDT",
        value: product.price,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            price: product.price,
          }
        ]
      }
    });
  };

  const trackCouponApply = (coupon_name: string, discount_amount?: number) => {
    pushToDataLayer({
      event: "coupon_apply",
      coupon_name: coupon_name,
      discount_amount: discount_amount
    });
  };

  const trackViewPromotion = (promotion: {
    id: string;
    name: string;
    creative_name?: string;
    creative_slot?: string;
    location_id?: string;
  }) => {
    pushToDataLayer({
      event: "view_promotion",
      ecommerce: {
        items: [{
          item_id: promotion.id,
          item_name: promotion.name,
          creative_name: promotion.creative_name,
          creative_slot: promotion.creative_slot,
          location_id: promotion.location_id
        }]
      }
    });
  };

  const trackSelectPromotion = (promotion: {
    id: string;
    name: string;
    creative_name?: string;
    creative_slot?: string;
    location_id?: string;
  }) => {
    pushToDataLayer({
      event: "select_promotion",
      ecommerce: {
        items: [{
          item_id: promotion.id,
          item_name: promotion.name,
          creative_name: promotion.creative_name,
          creative_slot: promotion.creative_slot,
          location_id: promotion.location_id
        }]
      }
    });
  };

  const trackGenerateLead = (lead_type: string, method?: string) => {
    pushToDataLayer({
      event: "generate_lead",
      lead_type: lead_type,
      method: method
    });
  };

  const trackContact = (method: string, content_id?: string) => {
    pushToDataLayer({
      event: "contact",
      method: method,
      content_id: content_id
    });
  };

  const trackSubscribe = (method: string, location_id?: string) => {
    pushToDataLayer({
      event: "subscribe",
      method: method,
      location_id: location_id
    });
  };

  const trackRefund = (transaction_id: string, value?: number, items?: any[]) => {
    pushToDataLayer({
      event: "refund",
      ecommerce: {
        transaction_id: transaction_id,
        value: value,
        items: items
      }
    });
  };

  // 'sign_up' is already implemented, but if 'complete_registration' is needed specifically:
  const trackCompleteRegistration = (method: string) => {
    pushToDataLayer({
      event: "complete_registration",
      method: method
    });
  };

  const trackReviewSubmit = (product_id: string, rating: number) => {
    pushToDataLayer({
      event: "review_submit",
      product_id: product_id,
      rating: rating
    });
  };

  const trackCheckoutError = (error_message: string, error_code?: string) => {
    pushToDataLayer({
      event: "checkout_error",
      error_message: error_message,
      error_code: error_code
    });
  };

  const trackPaymentRetry = (transaction_id?: string) => {
    pushToDataLayer({
      event: "payment_retry",
      transaction_id: transaction_id
    });
  };

  const trackOrderCancel = (transaction_id: string) => {
    pushToDataLayer({
      event: "order_cancel",
      transaction_id: transaction_id
    });
  };

  const trackFilterApply = (filter_type: string, filter_value: string) => {
    pushToDataLayer({
      event: "filter_apply",
      filter_type: filter_type,
      filter_value: filter_value
    });
  };

  const trackSortChange = (sort_option: string) => {
    pushToDataLayer({
      event: "sort_change",
      sort_option: sort_option
    });
  };

  const trackCompareProducts = (product_ids: string[]) => {
    pushToDataLayer({
      event: "compare_products",
      product_ids: product_ids
    });
  };

  const trackImageZoom = (product_id: string, image_url?: string) => {
    pushToDataLayer({
      event: "image_zoom",
      product_id: product_id,
      image_url: image_url
    });
  };

  const trackVariantSelect = (product_id: string, variant_name: string, variant_value: string) => {
    pushToDataLayer({
      event: "variant_select",
      product_id: product_id,
      variant_name: variant_name,
      variant_value: variant_value
    });
  };

  const trackStockAlert = (product_id: string) => {
    pushToDataLayer({
      event: "stock_alert",
      product_id: product_id
    });
  };

  return {
    trackEvent,
    trackAddToCart,
    trackPurchase,
    trackViewItem,
    trackBeginCheckout,
    trackAddToWishlist,
    trackRemoveFromCart,
    trackViewItemList,
    trackSelectItem,
    trackViewCart,
    trackAddShippingInfo,
    trackAddPaymentInfo,
    trackLogin,
    trackSignUp,
    trackSearch,
    trackShare,
    trackWishlistRemove,
    trackCouponApply,
    trackViewPromotion,
    trackSelectPromotion,
    trackGenerateLead,
    trackContact,
    trackSubscribe,
    trackRefund,
    trackCompleteRegistration,
    trackReviewSubmit,
    trackCheckoutError,
    trackPaymentRetry,
    trackOrderCancel,
    trackFilterApply,
    trackSortChange,
    trackCompareProducts,
    trackImageZoom,
    trackVariantSelect,
    trackStockAlert,
    pushToDataLayer
  };
};
