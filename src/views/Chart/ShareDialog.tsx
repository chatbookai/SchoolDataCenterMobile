import { useState, useEffect, useRef, Fragment } from 'react'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

// ** MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import html2canvas from 'html2canvas'

import { Capacitor } from '@capacitor/core'
import { Share } from '@capacitor/share'

import Icon from 'src/@core/components/icon'
import { Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'

const platform = Capacitor.getPlatform();
import AnalyticsStudent from "src/views/Chart/AnalyticsStudent"
import AnalyticsClass from "src/views/Chart/AnalyticsClass"
import StatisticsStudentsbyClass from "src/views/Chart/StatisticsStudentsbyClass"
import StatisticsStudentsbyIndividual from "src/views/Chart/StatisticsStudentsbyIndividual"


const ShareDialogModel = ({pageModel, viewPageShareStatus, handSetViewPageShareStatus}: any) => {

  const printRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState<boolean>(false)

  const handleDownloadImage = async () => {

    try {
      const element = printRef.current;
      const canvas = await html2canvas(element as HTMLElement, {
          scale: 2, // 提高分辨率
          useCORS: true, // 允许跨域图片
          allowTaint: false, // 不允许跨域图片污染
      });
      const imageBase64Text = canvas.toDataURL('image/png');

      if (platform === 'android' || platform === 'ios') {
        // 将 dataURL 转换为 Blob
        const response = await fetch(imageBase64Text);
        const blob = await response.blob();

        // 将 Blob 转换为 ArrayBuffer
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // 保存文件到设备的本地存储
        const fileName = `${pageModel}.png`;
        const fileBlob = new Blob([uint8Array], { type: 'image/png' });
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: fileBlob,
          directory: Directory.Documents,
        });
        console.log('File saved:', savedFile);
        const fileUrl = savedFile.uri;
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.textContent = '点击下载图片 android ios';
        document.body.appendChild(link);
      }

      if (platform === 'web') {
        if (!previewImage) return;
        const fileName = `${pageModel}.png`;
        const link = document.createElement('a');
        link.href = previewImage;
        link.download = fileName;
        link.click();
      }

    } catch (error) {
        console.error('Error generating or saving image:', error);
    }

  };

  const handleShareImageToOther = async () => {

    const element = printRef.current;
    const canvas = await html2canvas(element as HTMLElement, {
      scale: 2, // 提高分辨率
      useCORS: true, // 允许跨域图片
      allowTaint: false, // 不允许跨域图片污染
    });

    const imageBase64 = canvas.toDataURL('image/png');

    // 2. 将 Base64 数据转为二进制字符串
    const base64Data = imageBase64.split(',')[1];

    // 3. 使用 Filesystem 保存图片到本地
    const fileName = `shared-image-${Date.now()}.png`;
    const fileResult = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Cache, // 缓存目录，适合临时文件
      encoding: Encoding.UTF8,
    });

    // 4. 获取文件路径（Capacitor 文件 URL）
    const filePath = fileResult.uri;

    if (platform === 'android' || platform === 'ios') {

      // 5. 使用 Share 插件分享文件
      await Share.share({
        title: filePath,
        text: filePath,
        url: filePath, // 分享文件路径
        dialogTitle: '分享图片',
      });

    }

    //URL.revokeObjectURL(blobUrl);

  };

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleGenerateShareImage = async () => {
    setLoading(true)
    if (!printRef.current) return;
    const canvas = await html2canvas(printRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
    });
    const dataURL = canvas.toDataURL('image/png');
    setPreviewImage(dataURL);
    setLoading(false)
  };

  const handleShareToWeChat = async () => {
    if (!previewImage) return;
    try {
      if (platform === 'android' || platform === 'ios') {
        await Share.share({
          title: 'Check out this image!',
          text: 'I generated this image using my app.',
          url: previewImage,
          dialogTitle: 'Share this image',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  interface ShareDialogProps {
    previewImage: string | null;
    onClose: () => void;
    onSave: () => void;
    onShareToWeChat: () => void;
    onMoreOptions: () => void;
  }

  const ShareDialog: React.FC<ShareDialogProps> = ({
    previewImage,
    onClose,
    onSave,
    onShareToWeChat,
    onMoreOptions,
  }) => {
    return (
      <Dialog open={!!previewImage} onClose={onClose} sx={{mt: 10, mx: 5}}>
        <DialogTitle sx={{ textAlign: 'left', my: 1, py: 1, mx: 1, px: 2 }}>
          <Typography variant='body2' sx={{ marginRight: '1rem' }}>分享图片</Typography>
        </DialogTitle>
        <DialogContent sx={{mb: 1}}>
          {previewImage && <img src={previewImage} alt="Preview" style={{ width: '100%' }} />}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', mb: 1, pb: 1, mx: 3 }}>
          <Button startIcon={<SaveIcon />} onClick={onSave}>
            保存
          </Button>
          <Button startIcon={<Icon icon={'ic:baseline-wechat'} />} onClick={onShareToWeChat}>
            微信
          </Button>
          <Button startIcon={<MoreHorizIcon />} onClick={onMoreOptions}>
            更多
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  useEffect(() => {
    if (viewPageShareStatus) {
      handleGenerateShareImage()
    }
  }, [viewPageShareStatus]);

  console.log("viewPageShareStatus", viewPageShareStatus)

  return (
    <Fragment>
      {viewPageShareStatus == true && (
        <Fragment>
          <ShareDialog
            previewImage={previewImage}
            onClose={() => {
              setPreviewImage(null)
              handSetViewPageShareStatus(false)
            }}
            onSave={handleDownloadImage}
            onShareToWeChat={handleShareToWeChat}
            onMoreOptions={handleShareImageToOther}
          />
        </Fragment>
      )}
      {loading && (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true} >
          <CircularProgress color="inherit" size={45}/>
        </Backdrop>
      )}
      <div ref={printRef}>
        {pageModel == 'AnalyticsStudent' && (<AnalyticsStudent />)}
        {pageModel == 'AnalyticsClass' && (<AnalyticsClass />)}
        {pageModel == 'StatisticsStudentsbyClass' && (<StatisticsStudentsbyClass />)}
        {pageModel == 'StatisticsStudentsbyIndividual' && (<StatisticsStudentsbyIndividual />)}
      </div>
    </Fragment>
  )
}

export default ShareDialogModel
