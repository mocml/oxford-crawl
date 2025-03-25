import { translate } from '@vitalets/google-translate-api';
import { HttpProxyAgent } from 'http-proxy-agent';
const agent = new HttpProxyAgent('http://4.175.200.138:8080');
const translateToVietnamese = (text) => {
  translate('The YMCA offers a variety of fitness classes for all ages.', {
    to: 'vi',
    fetchOptions: { agent }
  }).then(res => {
    console.log(res);
  })
};

translateToVietnamese()