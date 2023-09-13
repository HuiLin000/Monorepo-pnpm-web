import { http } from "@/service";
/**
 * 获取jssdk配置相关参数
 * @param url 需要签名的页面url
 * @param jssdkurl
 * @returns
 */
export function getJsSDKConfigApi(
  jssdkurl: string,
  url: string | undefined,
  params?: any
) {
  const url_a = jssdkurl + "/Public/php/jssdk.php?get=js&gid=1&url=" + url;
  return http.get(url_a, params);
}
