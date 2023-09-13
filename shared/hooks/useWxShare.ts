import { getJsSDKConfigApi } from "@/api/index";
import { useWxSDK, WxConfig } from "@/hooks/useWxSDK";

export function useWxShare(shareConfig: {
  title: string;
  imgUrl: string;
  desc: string;
  link: string;
}) {
  const { initConfig, setShareInfo } = useWxSDK();

  const jssdkUrl = window.location.origin;

  const shareUrl = window.location.href.split("#")[0];
  // const signatureUrl = isiOSWechat()
  //   ? commonStore.commonState.visitUrl
  //   : shareUrl;

  getJsSDKConfigApi(jssdkUrl, shareUrl).then((config: WxConfig) => {
    initConfig(config).then(() => {
      setShareInfo({
        ...shareConfig
      });
    });
  });
}
