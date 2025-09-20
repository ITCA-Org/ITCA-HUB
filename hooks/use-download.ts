import { useState } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/utils/api';

const useDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadResource = async (fileUrl: string, fileName: string, title: string) => {
    setIsDownloading(true);

    try {
      let downloadUrl = fileUrl;

      try {
        /**============================================
         * Get direct download URL from Jeetix
         ============================================*/
        const jeetixFileInfo = await apiClient.getJeetixFileInfo(fileName);

        if (jeetixFileInfo?.data?.metadata?.mediaLink) {
          downloadUrl = jeetixFileInfo.data.metadata.mediaLink;
        }
      } catch (jeetixError) {
        console.warn('Using fallback URL:', jeetixError);
      }

      /**==============================================
       * Download file with resource title as filename
       ==============================================*/
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const fileExtension = fileName.split('.').pop() || '';
      const downloadFileName = `${title}.${fileExtension}`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Download completed', {
        description: `${title} has been downloaded.`,
      });
    } catch (error) {
      console.error('Error downloading resource:', error);
      toast.error('Download failed', {
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadResource, isDownloading };
};

export default useDownload;
