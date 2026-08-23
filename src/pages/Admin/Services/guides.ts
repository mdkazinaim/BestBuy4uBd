export interface GuideStep {
  title?: string;
  content: string;
  image?: string;
}

export interface ServiceGuideData {
  title: string;
  description: string;
  steps: GuideStep[];
}

export const serviceGuides: Record<string, ServiceGuideData> = {
  gtmId: {
    title: "গুগল ট্যাগ ম্যানেজার (GTM) ইভেন্ট ট্রিগার সেটআপ গাইড",
    description: "যেহেতু আপনার ওয়েবসাইটে ই-কমার্স ট্র্যাকিংয়ের জন্য `dataLayer.push` ব্যবহার করা হয়েছে, তাই এখন গুগল ট্যাগ ম্যানেজারে (GTM) এই ইভেন্টগুলো ধরার জন্য **Custom Event Trigger** তৈরি করতে হবে। নিচে ধাপে ধাপে বাংলায় গাইড দেওয়া হলো:",
    steps: [
      {
        title: "ধাপ ১: GTM ড্যাশবোর্ডে লগইন করুন",
        content: "1. [Google Tag Manager](https://tagmanager.google.com/) -এ যান।\n2. আপনার ওয়েবসাইটের কন্টেইনার (Container) নির্বাচন করুন।",
      },
      {
        title: "ধাপ ২: Custom Event Trigger তৈরি করা",
        content: "আমাদের ওয়েবসাইটের কোডে অনেকগুলো ইভেন্ট আছে (যেমন: `add_to_cart`, `purchase`, `view_item`)। প্রতিটি ইভেন্টের জন্য একটি করে ট্রিগার তৈরি করতে হবে।\n\nযেকোনো একটি ইভেন্ট (উদাহরণস্বরূপ: **add_to_cart**) এর ট্রিগার তৈরি করার নিয়ম:\n\n1. বাম পাশের মেনু থেকে **Triggers** -এ ক্লিক করুন।\n2. উপরের ডানদিকে **New** বাটনে ক্লিক করুন।\n3. ট্রিগারের একটি নাম দিন (যেমন উপরের বাম কোণায় লিখুন: `Event - Add to Cart`)।\n4. **Trigger Configuration** বক্সে ক্লিক করুন।\n5. ডানপাশ থেকে স্ক্রল করে নিচে নামুন এবং **Custom Event** নির্বাচন করুন।",
        image: "/assets/guides/gtm_trigger_creation.png"
      },
      {
        content: "6. **Event name** এর ঘরে আপনার কোডে ব্যবহৃত হুবহু ইভেন্টের নামটি লিখুন। (যেমন: `add_to_cart` - সব ছোট হাতের অক্ষর এবং আন্ডারস্কোর থাকবে)।\n7. \"This trigger fires on\" এর অপশনে **All Custom Events** সিলেক্ট করা থাকবে।",
        image: "/assets/guides/gtm_event_name.png"
      },
      {
        content: "8. উপরের ডানদিক থেকে **Save** বাটনে ক্লিক করুন।\n\n> **একইভাবে নিচের ইভেন্টগুলোর জন্যও আলাদা আলাদা ট্রিগার তৈরি করুন:**\n> - `view_item` (প্রোডাক্ট দেখার জন্য)\n> - `view_item_list` (প্রোডাক্ট লিস্ট দেখার জন্য)\n> - `begin_checkout` (চেকআউট পেজে যাওয়ার জন্য)\n> - `purchase` (অর্ডার সম্পন্ন হওয়ার জন্য)\n> - `remove_from_cart` (কার্ট থেকে রিমুভ করার জন্য)\n> - `select_item` (প্রোডাক্ট কার্ডে ক্লিক করার জন্য)\n> - `share` (শেয়ার করার জন্য)\n> - `image_zoom` (ছবি বড় করে দেখার জন্য)"
      },
      {
        title: "ধাপ ৩: ডাটা লেয়ার ভেরিয়েবল তৈরি করা (ঐচ্ছিক কিন্তু প্রয়োজনীয়)",
        content: "গুগল অ্যানালিটিক্স ৪ (GA4) ই-কমার্স ডাটা (যেমন: দাম, প্রোডাক্টের নাম) অটোমেটিক নিয়ে নেয় যদি আপনি GA4 ই-কমার্স ট্যাগ ব্যবহার করেন। তবে অন্যান্য ডাটার জন্য কিছু ভেরিয়েবল তৈরি করা লাগতে পারে।\n\n1. বাম পাশের মেনু থেকে **Variables** -এ যান।\n2. নিচে \"User-Defined Variables\" সেকশনে **New** বাটনে ক্লিক করুন।\n3. **Variable Configuration** এ ক্লিক করে **Data Layer Variable** নির্বাচন করুন।\n4. Data Layer Variable Name এর ঘরে ডাটার পাথ দিন (যেমন: `ecommerce.value` বা `ecommerce.transaction_id`)।\n5. সেভ করুন।"
      },
      {
        title: "ধাপ ৪: GA4 Event Tag তৈরি করা এবং ট্রিগার যুক্ত করা",
        content: "ট্রিগার তৈরি হয়ে গেলে এবার ট্যাগ তৈরি করতে হবে যা ডাটাগুলো গুগল অ্যানালিটিক্সে পাঠাবে।\n\n1. বাম পাশের মেনু থেকে **Tags** -এ ক্লিক করুন।\n2. **New** বাটনে ক্লিক করুন।\n3. ট্যাগের নাম দিন (যেমন: `GA4 Event - Add to Cart`)।\n4. **Tag Configuration** -এ ক্লিক করে **Google Analytics: GA4 Event** সিলেক্ট করুন।\n5. আপনার **Measurement ID** (G-XXXXXXX) দিন বা Configuration Tag সিলেক্ট করুন।",
        image: "/assets/guides/gtm_tag_config.png"
      },
      {
        content: "6. **Event Name** এর ঘরে ইভেন্টের নাম লিখুন (যেমন: `add_to_cart`)।\n7. নিচে **More Settings** > **Ecommerce** এ গিয়ে **Send Ecommerce data** চেকবক্সে টিক দিন এবং Data source হিসেবে `Data Layer` সিলেক্ট করুন।\n8. এরপর নিচে **Triggering** বক্সে ক্লিক করুন।\n9. ধাপ ২-এ যে ট্রিগারটি তৈরি করেছিলেন (যেমন: `Event - Add to Cart`), সেটি সিলেক্ট করুন।\n10. **Save** বাটনে ক্লিক করুন।"
      },
      {
        title: "ধাপ ৫: পাবলিশ করা (Publish)",
        content: "সব ট্রিগার এবং ট্যাগ তৈরি করা শেষ হলে:\n1. একদম উপরের ডানদিকে **Submit** বাটনে ক্লিক করুন।\n2. Version Name -এ কী পরিবর্তন করেছেন তা লিখে (যেমন: `Added Ecommerce Triggers`) **Publish** বাটনে ক্লিক করুন。\n\n**পাবলিশ করার আগে Preview বাটনে ক্লিক করে আপনি ওয়েবসাইটটি টেস্ট করে দেখতে পারেন যে আপনি \"Add to Cart\" বাটনে ক্লিক করলে GTM-এ ট্রিগারটি ফায়ার হচ্ছে কি না।**"
      }
    ]
  },
  googleAnalyticsId: {
    title: "গুগল অ্যানালিটিক্স ৪ (GA4) ইভেন্ট সেটআপ গাইড",
    description: "কীভাবে আপনার গুগল অ্যানালিটিক্স ৪ (GA4) ড্যাশবোর্ডে ইভেন্ট এবং ই-কমার্স ট্র্যাকিং সেটআপ করবেন তার ধাপে ধাপে গাইড নিচে দেওয়া হলো:",
    steps: [
      {
        title: "ধাপ ১: Measurement ID সংগ্রহ করুন",
        content: "1. [Google Analytics](https://analytics.google.com/) -এ যান এবং আপনার প্রপার্টি নির্বাচন করুন।\n2. বাম দিকের নিচে **Admin** (গিয়ার আইকন) -এ ক্লিক করুন।\n3. Data collection and modification থেকে **Data Streams** -এ গিয়ে আপনার ওয়েবসাইটের স্ট্রিমটি সিলেক্ট করুন।\n4. ডানদিকের উপর থেকে **Measurement ID** (G-XXXXXXX) কপি করুন এবং আমাদের ওয়েবসাইটের সার্ভিসে বসান।",
        image: "/assets/guides/Goolge Analytics/1.jpeg"
      },
      {
        title: "ধাপ ২: ই-কমার্স ইভেন্ট চেক করা",
        content: "ডাটা আসা শুরু করলে আপনি ইভেন্টগুলো চেক করতে পারবেন:\n\n1. বাম পাশের মেনু থেকে **Reports** > **Engagement** > **Events** -এ যান।\n2. এখানে আপনি `add_to_cart`, `purchase`, `view_item` ইত্যাদি ইভেন্টগুলো দেখতে পাবেন।\n\n> **নোট:** নতুন ইভেন্ট GA4 ড্যাশবোর্ডে শো করতে সাধারণত ২৪-৪৮ ঘণ্টা সময় লাগতে পারে।",
        image: "/assets/guides/Goolge Analytics/2.jpeg"
      }
    ]
  },
  facebook: {
    title: "ফেসবুক পিক্সেল (Pixel) ও CAPI সেটআপ গাইড",
    description: "ফেসবুক পিক্সেল এবং কনভার্শন এপিআই (Conversions API) এর মাধ্যমে ওয়েবসাইটের ট্র্যাকিং সেটআপ করতে নিচের ধাপগুলো অনুসরণ করুন:",
    steps: [
      {
        title: "ধাপ ১: পিক্সেল আইডি (Pixel ID) সংগ্রহ করুন",
        content: "1. ফেসবুকের [Events Manager](https://business.facebook.com/events_manager) -এ যান।\n2. বাম পাশের মেনু থেকে **Data Sources** -এ ক্লিক করে আপনার পিক্সেল সিলেক্ট করুন।\n3. ডানপাশে **Settings** ট্যাবে যান।\n4. একটু নিচে স্ক্রল করে **Pixel ID** টি কপি করুন।",
        image: "/assets/guides/Facebook/1.jpeg"
      },
      {
        title: "ধাপ ২: অ্যাক্সেস টোকেন (Access Token) জেনারেট করুন",
        content: "Conversions API (CAPI) এর জন্য একটি টোকেন প্রয়োজন:\n\n1. একই **Settings** পেজে আরো নিচে স্ক্রল করে \"Conversions API\" সেকশনে যান।\n2. \"Set up manually\" এর নিচে **Generate access token** লিঙ্কে ক্লিক করুন।\n3. টোকেনটি কপি করে আমাদের ওয়েবসাইটের সার্ভিসে বসান।",
        image: "/assets/guides/Facebook/2.jpeg"
      },
      {
        title: "ধাপ ৩: ইভেন্ট টেস্ট করুন",
        content: "সব সেটআপ হয়ে গেলে ইভেন্ট টেস্ট করে দেখতে পারেন:\n\n1. **Test Events** ট্যাবে যান।\n2. \"Test browser events\" এর ঘরে ওয়েবসাইটের URL দিয়ে ওয়েবসাইটটি ওপেন করুন।\n3. ওয়েবসাইটে কিছু এক্টিভিটি করুন (যেমন: প্রোডাক্ট দেখা, কার্টে অ্যাড করা)।\n4. Events Manager এ ফিরে এসে দেখুন ইভেন্টগুলো ঠিকমতো রিসিভ হচ্ছে কিনা।",
        image: "/assets/guides/Facebook/3.jpeg"
      }
    ]
  },
  steadfast: {
    title: "স্টেডফাস্ট কুরিয়ার (Steadfast Courier) এপিআই সেটআপ গাইড",
    description: "ওয়েবসাইটের সাথে স্টেডফাস্ট কুরিয়ার অটোমেশন সেটআপ করার জন্য API Key এবং Secret Key প্রয়োজন। নিচের ধাপগুলো অনুসরণ করে এগুলো সংগ্রহ করুন:",
    steps: [
      {
        title: "ধাপ ১: স্টেডফাস্ট মার্চেন্ট প্যানেলে লগইন করুন",
        content: "1. [Steadfast Merchant Panel](https://steadfast.com.bd/) -এ গিয়ে আপনার মার্চেন্ট একাউন্টে লগইন করুন।"
      },
      {
        title: "ধাপ ২: API সেটিংস এ যান",
        content: "1. ড্যাশবোর্ডের মেনু থেকে **API Settings** বা **Developer** অপশনে ক্লিক করুন।"
      },
      {
        title: "ধাপ ৩: API Key এবং Secret Key সংগ্রহ করুন",
        content: "1. এখানে আপনি আপনার **API Key** এবং **Secret Key** দেখতে পাবেন (প্রয়োজন হলে নতুন তৈরি করুন)।\n2. এগুলো কপি করে আমাদের ওয়েবসাইটের সার্ভিসে বসান।"
      }
    ]
  },
  facebookChat: {
    title: "ফেসবুক মেসেঞ্জার (Facebook Messenger) চ্যাট সেটআপ গাইড",
    description: "ওয়েবসাইটে ফেসবুক মেসেঞ্জার লাইভ চ্যাট যুক্ত করার জন্য আপনার ফেসবুক পেজের 'Page ID' প্রয়োজন। নিচের ধাপগুলো অনুসরণ করে Page ID সংগ্রহ করুন:",
    steps: [
      {
        title: "ধাপ ১: ফেসবুক পেজে যান",
        content: "1. ফেসবুকে লগইন করুন এবং আপনার বিজনেস পেজটি (Page) ওপেন করুন।"
      },
      {
        title: "ধাপ ২: Page ID সংগ্রহ করুন",
        content: "1. পেজের বাম পাশের মেনু থেকে **About** ট্যাবে ক্লিক করুন।\n2. এরপর **Page Transparency** -তে ক্লিক করুন।\n3. সেখানে আপনি **Page ID** নামের একটি সংখ্যা দেখতে পাবেন।\n4. এই ID টি কপি করে আমাদের ওয়েবসাইটের সার্ভিসে বসান।"
      }
    ]
  },
  whatsappNumber: {
    title: "হোয়াটসঅ্যাপ (WhatsApp) চ্যাট সেটআপ গাইড",
    description: "ওয়েবসাইটে হোয়াটসঅ্যাপ চ্যাট বাটন যুক্ত করার জন্য আপনার হোয়াটসঅ্যাপ নাম্বারটি সঠিকভাবে দিতে হবে।",
    steps: [
      {
        title: "ধাপ ১: সঠিক ফরম্যাটে নাম্বার লিখুন",
        content: "1. আপনার হোয়াটসঅ্যাপ নাম্বারটি দেশের কোড সহ লিখতে হবে।\n2. বাংলাদেশের জন্য নাম্বারের আগে **880** যুক্ত করুন (যেমন: `8801XXXXXXXXX`)।\n3. কোনো `+` (প্লাস) চিহ্ন, হাইফেন বা স্পেস ব্যবহার করবেন না।\n4. নাম্বারটি কপি করে আমাদের ওয়েবসাইটের সার্ভিসে বসান।"
      }
    ]
  },
  clarityId: {
    title: "মাইক্রোসফট ক্ল্যারিটি (Microsoft Clarity) প্রজেক্ট আইডি সেটআপ গাইড",
    description: "ওয়েবসাইটের হিটম্যাপ এবং ইউজার সেশন রেকর্ড করার জন্য Microsoft Clarity-এর প্রজেক্ট আইডি (Project ID) প্রয়োজন। এটি সংগ্রহ করতে নিচের ধাপগুলো অনুসরণ করুন:",
    steps: [
      {
        title: "ধাপ ১: ক্ল্যারিটি ড্যাশবোর্ডে লগইন করুন",
        content: "1. [Microsoft Clarity](https://clarity.microsoft.com/) -এ যান এবং আপনার একাউন্টে লগইন করুন।\n2. নতুন প্রজেক্ট তৈরি করুন বা আপনার ওয়েবসাইটের প্রজেক্টে ক্লিক করুন।"
      },
      {
        title: "ধাপ ২: প্রজেক্ট আইডি (Project ID) সংগ্রহ করুন",
        content: "1. প্রজেক্টের **Settings** (সেটিংস) মেনুতে যান।\n2. **Overview** বা **Setup** ট্যাবে আপনি প্রজেক্ট আইডি (একটি ছোট কোড) দেখতে পাবেন।\n3. এই আইডিটি কপি করে আমাদের ওয়েবসাইটের সার্ভিসে বসান।"
      }
    ]
  },
  searchConsoleVerificationCode: {
    title: "গুগল সার্চ কনসোল (Search Console) ভেরিফিকেশন কোড গাইড",
    description: "গুগল সার্চ কনসোলে ওয়েবসাইট ভেরিফাই করার জন্য HTML Tag এর ভেরিফিকেশন কোডটি প্রয়োজন। নিচের ধাপগুলো অনুসরণ করুন:",
    steps: [
      {
        title: "ধাপ ১: সার্চ কনসোলে প্রপার্টি অ্যাড করুন",
        content: "1. [Google Search Console](https://search.google.com/search-console) -এ যান।\n2. **URL prefix** অপশনটি নির্বাচন করুন এবং আপনার ওয়েবসাইটের লিংক দিন।\n3. Continue বাটনে ক্লিক করুন।"
      },
      {
        title: "ধাপ ২: HTML Tag ভেরিফিকেশন মেথড নির্বাচন করুন",
        content: "1. ভেরিফিকেশন উইন্ডোতে **Other verification methods** থেকে **HTML tag** অপশনটিতে ক্লিক করুন।\n2. আপনি একটি মেটা ট্যাগ দেখতে পাবেন। যেমন: `<meta name=\"google-site-verification\" content=\"আপনাকো‌ডএখানে\">`"
      },
      {
        title: "ধাপ ৩: ভেরিফিকেশন কোড সংগ্রহ করুন",
        content: "1. মেটা ট্যাগের ভেতর `content=\"...\"` অংশে যে কোডটি আছে সেটি কপি করুন (শুধুমাত্র কোডটুকু)।\n2. এই কোডটি আমাদের ওয়েবসাইটের সার্ভিসে বসিয়ে সেভ করুন।\n3. এরপর সার্চ কনসোলে ফিরে গিয়ে **Verify** বাটনে ক্লিক করুন।"
      }
    ]
  },
  lookerStudioEmbedUrl: {
    title: "লুকার স্টুডিও (Looker Studio) এমবেড ইউআরএল (Embed URL) গাইড",
    description: "আপনার তৈরি করা কাস্টম ড্যাশবোর্ড বা রিপোর্ট ওয়েবসাইটে দেখানোর জন্য Looker Studio-এর Embed URL প্রয়োজন।",
    steps: [
      {
        title: "ধাপ ১: লুকার স্টুডিও রিপোর্ট ওপেন করুন",
        content: "1. [Looker Studio](https://lookerstudio.google.com/) -এ গিয়ে আপনার তৈরি করা রিপোর্টটি ওপেন করুন।"
      },
      {
        title: "ধাপ ২: এমবেডিং (Embedding) চালু করুন",
        content: "1. উপরের মেনু থেকে **File** -এ ক্লিক করুন।\n2. এরপর **Embed report** অপশনে ক্লিক করুন।\n3. \"Enable embedding\" অপশনটি চালু করুন।"
      },
      {
        title: "ধাপ ৩: এমবেড ইউআরএল (Embed URL) কপি করুন",
        content: "1. **Embed URL** অপশনটি সিলেক্ট করুন।\n2. বক্সে যে URL টি দেখাবে সেটি কপি করুন।\n3. এই URL টি আমাদের ওয়েবসাইটের সার্ভিসে বসান।"
      }
    ]
  },
  tiktokPixelId: {
    title: "টিকটক পিক্সেল (TikTok Pixel) সেটআপ গাইড",
    description: "টিকটক অ্যাডস ম্যানেজারের মাধ্যমে ওয়েবসাইটের ইভেন্ট ট্র্যাকিং করার জন্য পিক্সেল আইডি প্রয়োজন।",
    steps: [
      {
        title: "ধাপ ১: ইভেন্ট ম্যানেজার ওপেন করুন",
        content: "1. [TikTok Ads Manager](https://ads.tiktok.com/) -এ লগইন করুন।\n2. উপরের মেনু থেকে **Assets** বা **Tools** -এ ক্লিক করে **Events** -এ যান।\n3. **Web Events** -এ ক্লিক করে Manage বাটনে চাপ দিন।"
      },
      {
        title: "ধাপ ২: পিক্সেল আইডি (Pixel ID) কপি করুন",
        content: "1. আপনার ওয়েবসাইটের জন্য তৈরি করা টিকটক পিক্সেলটি সিলেক্ট করুন।\n2. পিক্সেলের নামের নিচেই আপনি **Pixel ID** দেখতে পাবেন।\n3. আইডিটি কপি করে আমাদের ওয়েবসাইটের সার্ভিসে বসান।"
      }
    ]
  }
};

export const getGuideData = (serviceKey: string, serviceName: string): ServiceGuideData => {
  return serviceGuides[serviceKey] || {
    title: `Guide for ${serviceName}`,
    description: `We are currently working on a detailed configuration guide for this service. Please check back later. In the meantime, you can check the official documentation for ${serviceName}.`,
    steps: []
  };
};
