import { useToast } from "@/components/ui/use-toast";
import { ApiResponseError } from "@/types";

export const useToastHandler = () => {
  const { toast } = useToast();

  const onErrorHandler = (title: string, error?: ApiResponseError | string) => {
    if (!error) {
      toast({
        title,
        variant: "destructive",
      });
      return;
    }

    console.log({ error });
    

    if (typeof error === "string") {
      toast({
        title,
        description: error,
        variant: "destructive",
      });
      return;
    }

    if (error?.response?.data && error.response?.data.message) {
      toast({
        title,
        description: error.response?.data?.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title,
      description: "Unknown error occurred",
      variant: "destructive",
    });
  };

  const onSuccessHandler = (title: string, message: string) => {
    toast({ title, description: message ?? "success", variant: "default" });
  };

  return { success: onSuccessHandler, error: onErrorHandler };
};
