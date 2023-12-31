import axios from "axios";
import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse
} from "axios";
import { showDialog } from "vant";
/* 服务器返回数据的的类型，根据接口文档确定 */
export interface Result<T = any> {
  code: number;
  message: string;
  data: T;
}

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000
});

/* 请求拦截器 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    //  伪代码
    // if (user.token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: AxiosError) => {
    // Message.error(error.message);
    showDialog({ message: error.message });
    return Promise.reject(error);
  }
);

/* 响应拦截器 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message, data } = response.data;

    // 根据自定义错误码判断请求是否成功
    if (code === 200) {
      // 将组件用的数据返回
      // return data
      return Promise.resolve(data);
    } else {
      // 处理业务错误。
      // Message.error(message)
      showDialog({ message: message });
      return Promise.reject(new Error(message));
    }
  },
  (error: AxiosError) => {
    // 处理 HTTP 网络错误
    let message = "";
    // HTTP 状态码
    const status = error.response?.status;
    switch (status) {
      case 401:
        message = "token 失效，请重新登录";
        // 这里可以触发退出的 action
        break;
      case 403:
        message = "拒绝访问";
        break;
      case 404:
        message = "请求地址错误";
        break;
      case 500:
        message = "服务器故障";
        break;
      default:
        message = "网络连接故障";
    }
    showDialog({ message: message });
    // Message.error(message)

    return Promise.reject(error);
  }
);

/* 导出封装的请求方法 */
export const http = {
  get<T = any>(
    url: string,
    params?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<T> {
    return service.get(url, { params, ...config });
  },

  post<T = any>(
    url: string,
    data?: object,
    config?: InternalAxiosRequestConfig
  ): Promise<T> {
    return service.post(url, data, config);
  },

  put<T = any>(
    url: string,
    data?: object,
    config?: InternalAxiosRequestConfig
  ): Promise<T> {
    return service.put(url, data, config);
  },

  delete<T = any>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<T> {
    return service.delete(url, config);
  }
};

// export const apiGet = <T>({
//   url,
//   params,
//   config
// }: {
//   url: string;
//   params?: T;
//   config?: InternalAxiosRequestConfig;
// }): Promise<Request> => {
//   return new Promise((resolve, reject) => {
//     service.get(url, { params: params, ...config }).then(
//       (response: any) => {
//         if (typeof response === "string") {
//           const ret: Request = eval(response);
//           resolve(ret);
//         } else {
//           resolve(response);
//         }
//       },
//       response => {
//         reject(response);
//       }
//     );
//   });
// };

// export const apiPost = ({
//   url,
//   data,
//   config
// }: {
//   url: string;
//   data?: object;
//   config?: InternalAxiosRequestConfig;
// }): Promise<Request> => {
//   return new Promise((resolve, reject) => {
//     service
//       .post(url, data, { ...config })
//       .then((response: any) => {
//         resolve(response);
//       })
//       .catch(response => {
//         reject(response);
//         console.log("post error", response);
//       });
//   });
// };

/* 导出 axios 实例 */
export default service;
