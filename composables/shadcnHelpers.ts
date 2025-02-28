import { useToast } from '~/components/ui/toast';
import { h } from 'vue'
import { ToastAction } from '@/components/ui/toast'

type errorData = {
  title: string,
  message: string
}

export const useShadcnHelpers = () => {
  const { toast } = useToast()
  const runErrorToast = (errorData: errorData) => {
    toast({
      title: errorData.title,
      description: errorData.message,
      variant: 'destructive',
      action: h(ToastAction, {
        altText: 'Close',
      }, {
        default: () => 'Close',
      }),
    });
  }
  const runToast = (description: string) => {
    toast({
      description
    })
  }
  return { runErrorToast, runToast }
}
