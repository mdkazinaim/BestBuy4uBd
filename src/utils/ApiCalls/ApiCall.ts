import { toast } from "sonner";

interface Props {
  endpoint: any;
  payload: any;
  successMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
}
export const ApiCall = async (props: Props) => {
  const toastId = toast.loading(props.loadingMessage || "Loading ...");
  try {
    const response = await props.endpoint(props.payload).unwrap();
    console.log(response, "Response");
    if (response.success) {
      toast.success(props.successMessage, { id: toastId });
    }
    return response;
  } catch (error: any) {
    console.log(error, "Catch Error");
    toast.error(props.errorMessage, { id: toastId });
    throw error;
  }
};
