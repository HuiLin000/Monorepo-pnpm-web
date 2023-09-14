import { http } from '@manage/shared';

export const testApi = (data: object | undefined) => {
  return http.post('manage/login', data);
};
