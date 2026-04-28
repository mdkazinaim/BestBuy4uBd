import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Divider,
} from "@heroui/react";
import {
  BarChart3,
  Facebook,
  ExternalLink,
  Eye,
  EyeOff,
  Video,
  Search,
  LayoutDashboard,
  Code2,
  Trash2,
  Settings2,
  Plus,
  Truck,
  MessageCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useGetTrackingSettingsQuery,
  useUpdateTrackingSettingsMutation,
} from "@/store/Api/TrackingApi";

const Services = () => {
  const { data: trackingData, isLoading } = useGetTrackingSettingsQuery({});
  const [updateTracking, { isLoading: isUpdating }] =
    useUpdateTrackingSettingsMutation();
  const settings = trackingData?.data || {};

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeService, setActiveService] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm();
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

    const handleEdit = (serviceKey: string, currentVal: any) => {
    setActiveService(serviceKey);
    reset();

    if (serviceKey === "facebook") {
      setValue("facebookPixelId", currentVal?.facebookPixelId);
      setValue("facebookAccessToken", currentVal?.facebookAccessToken);
    } else if (serviceKey === "facebookChat") {
      setValue("facebookPageId", currentVal?.facebookPageId);
    } else if (serviceKey === "steadfast") {
      setValue("steadfastApiKey", currentVal?.steadfastApiKey);
      setValue("steadfastSecretKey", currentVal?.steadfastSecretKey);
      setValue("steadfastEnabled", currentVal?.steadfastEnabled);
    } else {
      setValue(serviceKey, currentVal);
    }
    onOpen();
  };

  const handleRemove = (key: string) => {
    toast.warning(
      "Are you sure you want to remove this integration? This will stop tracking immediately.",
      {
        position: "top-center",
        action: {
          label: "Remove",
          onClick: async () => {
            try {
              const payload: any = {};

              if (key === "facebook") {
                payload.facebookPixelId = "";
                payload.facebookAccessToken = "";
              } else if (key === "facebookChat") {
                payload.facebookPageId = "";
              } else if (key === "steadfast") {
                payload.steadfastApiKey = "";
                payload.steadfastSecretKey = "";
                payload.steadfastEnabled = false;
              } else {
                payload[key] = "";
              }

              await updateTracking(payload).unwrap();
              toast.success("Integration removed successfully");
              onClose();
            } catch {
              toast.error("Failed to remove integration");
            }
          },
        },
        cancel: {
          label: "Cancel",
          onClick: () => {
            onClose();
          },
        },
      }
    );
  };

  const onSubmit = async (data: any) => {
    try {
      await updateTracking(data).unwrap();
      toast.success("Settings updated successfully");
      onClose();
    } catch {
      toast.error("Failed to update settings");
    }
  };

  const toggleVisibility = (key: string) => {
    setShowKey((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const maskValue = (value: string, key: string) => {
    if (!value) return "";
    if (showKey[key]) return value;
    return value.slice(0, 4) + "••••••••";
  };

  const integrations = [
    {
      key: "gtmId",
      title: "Google Tag Manager",
      desc: "Manage all your tags without editing code.",
      icon: <Code2 className="text-blue-600 w-6 h-6" />,
      color: "bg-blue-100",
      link: "https://tagmanager.google.com/",
      idLabel: "Container ID",
    },
    {
      key: "googleAnalyticsId",
      title: "Google Analytics 4",
      desc: "Track website traffic and user behavior.",
      icon: <BarChart3 className="text-orange-600 w-6 h-6" />,
      color: "bg-orange-100",
      link: "https://analytics.google.com/",
      idLabel: "Measurement ID",
    },
    {
      key: "facebook",
      title: "Facebook Pixel & CAPI",
      desc: "Track conversions and retarget users on Facebook.",
      icon: <Facebook className="text-blue-600 w-6 h-6" />,
      color: "bg-blue-50",
      link: "https://business.facebook.com/events_manager2/",
      idLabel: "Pixel ID",
    },
    {
      key: "facebookChat",
      title: "Facebook Chat",
      desc: "Enable Messenger chat on your website.",
      icon: <MessageCircle className="text-blue-600 w-6 h-6" />,
      color: "bg-blue-50",
      link: "https://www.facebook.com/business/help/1524587524402327",
      idLabel: "Page ID",
    },
    {
      key: "whatsappNumber",
      title: "WhatsApp Chat",
      desc: "Enable WhatsApp chat button for customers.",
      icon: <MessageCircle className="text-green-500 w-6 h-6" />,
      color: "bg-green-50",
      link: "https://faq.whatsapp.com/general/chats/how-to-use-click-to-chat/",
      idLabel: "Phone Number (with 880)",
    },
    {
      key: "tiktokPixelId",
      title: "TikTok Pixel",
      desc: "Measure performance of TikTok ads.",
      icon: <Video className="text-black w-6 h-6" />,
      color: "bg-gray-200",
      link: "https://ads.tiktok.com/i18n/events_manager/",
      idLabel: "Pixel ID",
    },
    {
      key: "clarityId",
      title: "Microsoft Clarity",
      desc: "Heatmaps and session recordings.",
      icon: <Eye className="text-orange-500 w-6 h-6" />,
      color: "bg-orange-50",
      link: "https://clarity.microsoft.com/",
      idLabel: "Project ID",
    },
    {
      key: "searchConsoleVerificationCode",
      title: "Google Search Console",
      desc: "Monitor and troubleshoot your site's presence.",
      icon: <Search className="text-green-600 w-6 h-6" />,
      color: "bg-green-100",
      link: "https://search.google.com/search-console",
      idLabel: "Verification Code",
    },
    {
      key: "lookerStudioEmbedUrl",
      title: "Looker Studio",
      desc: "Embed your custom Looker Studio dashboard.",
      icon: <LayoutDashboard className="text-indigo-600 w-6 h-6" />,
      color: "bg-indigo-100",
      link: "https://lookerstudio.google.com/",
      idLabel: "Embed URL",
    },
    {
      key: "steadfast",
      title: "Steadfast Courier",
      desc: "Automated shipping and delivery in Bangladesh.",
      icon: <Truck className="text-emerald-600 w-6 h-6" />,
      color: "bg-emerald-100",
      link: "https://stedfast.com.bd/",
      idLabel: "API Key",
    },
  ];

  if (isLoading)
    return <div className="p-10 text-center">Loading Integrations...</div>;

  return (
    <div className="p-2 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-8">
      <div className="px-1">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">
          Services
        </h1>
        <p className="text-gray-500 text-xs md:text-sm mt-0.5">
          Manage third-party tool integrations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {integrations.map((item) => {
          const isConfigured =
            item.key === "facebook"
              ? !!settings.facebookPixelId
              : item.key === "facebookChat"
              ? !!settings.facebookPageId
              : item.key === "steadfast"
              ? !!settings.steadfastApiKey
              : !!settings[item.key];

          const currentValue =
            item.key === "facebook"
              ? {
                  facebookPixelId: settings.facebookPixelId,
                  facebookAccessToken: settings.facebookAccessToken,
                }
              : item.key === "facebookChat"
              ? {
                  facebookPageId: settings.facebookPageId,
                }
              : item.key === "steadfast"
              ? {
                  steadfastApiKey: settings.steadfastApiKey,
                  steadfastSecretKey: settings.steadfastSecretKey,
                  steadfastEnabled: settings.steadfastEnabled,
                }
              : settings[item.key];

          const displayValue =
            item.key === "facebook"
              ? settings.facebookPixelId
              : item.key === "facebookChat"
              ? settings.facebookPageId
              : item.key === "steadfast"
              ? settings.steadfastApiKey
              : settings[item.key];

          const maskKey =
            item.key === "facebook"
              ? "facebookPixelId"
              : item.key === "facebookChat"
              ? "facebookPageId"
              : item.key === "steadfast"
              ? "steadfastApiKey"
              : item.key;

          return (
            <Card
              key={item.key}
              className="shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex gap-3 p-3 md:p-5">
                <div className={`p-2 rounded-lg ${item.color}`}>
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">{item.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {item.desc}
                  </p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 mt-1"
                  >
                    Official Site <ExternalLink size={10} />
                  </a>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="p-3 md:p-6">
                {isConfigured ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200 flex justify-between items-center group">
                      <div className="overflow-hidden">
                        <span className="text-xs uppercase font-bold text-gray-400 block mb-1">
                          {item.idLabel}
                        </span>
                        <span className="font-mono text-gray-700 block truncate">
                          {maskValue(displayValue, maskKey)}
                        </span>
                      </div>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => toggleVisibility(maskKey)}
                      >
                        {showKey[maskKey] ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </Button>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="flat"
                        className="flex-1"
                        startContent={<Settings2 size={16} />}
                        onPress={() => handleEdit(item.key, currentValue)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="flat"
                        color="danger"
                        isIconOnly
                        onPress={() => handleRemove(item.key)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center space-y-4">
                    <p className="text-sm text-gray-500 italic">
                      Not configured yet.
                    </p>
                    <Button
                      color="primary"
                      className="w-full"
                      startContent={<Plus size={18} />}
                      onPress={() => handleEdit(item.key, currentValue)}
                    >
                      Setup Now
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader>
                Configure{" "}
                {integrations.find((i) => i.key === activeService)?.title}
              </ModalHeader>
              <ModalBody>
                {activeService === "facebook" ? (
                  <>
                    <Input
                      label="Facebook Pixel ID"
                      placeholder="123456789..."
                      variant="bordered"
                      {...register("facebookPixelId")}
                    />
                    <Input
                      label="Access Token (CAPI)"
                      placeholder="EAAG..."
                      variant="bordered"
                      {...register("facebookAccessToken")}
                    />
                  </>
                ) : activeService === "facebookChat" ? (
                  <Input
                    label="Page ID (Messenger)"
                    placeholder="Page ID for Chat Plugin"
                    variant="bordered"
                    {...register("facebookPageId")}
                  />
                ) : activeService === "steadfast" ? (
                  <>
                    <Input
                      label="API Key"
                      placeholder="Enter your Steadfast API Key"
                      variant="bordered"
                      {...register("steadfastApiKey")}
                    />
                    <Input
                      label="Secret Key"
                      placeholder="Enter your Steadfast Secret Key"
                      variant="bordered"
                      {...register("steadfastSecretKey")}
                    />
                    <div className="flex items-center gap-2 mt-2">
                       <input 
                           type="checkbox" 
                           id="sf_enabled"
                           {...register("steadfastEnabled")}
                           className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                       />
                       <label htmlFor="sf_enabled" className="text-sm text-gray-700">Enable Automation</label>
                   </div>
                  </>
                ) : (
                  <Input
                    label={
                      integrations.find((i) => i.key === activeService)
                        ?.idLabel || "Tracking ID"
                    }
                    placeholder="Paste your ID or Key here"
                    variant="bordered"
                    {...register(activeService || "")}
                  />
                )}
                <div className="bg-blue-50 p-3 rounded text-xs text-blue-700">
                  <p>
                    Make sure to copy the correct ID from your provider's
                    dashboard.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" isLoading={isUpdating}>
                  Save Changes
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Services;
