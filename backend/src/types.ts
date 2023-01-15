export type Event ={
  rawUrl: string; // 'https://chuck.fail/.netlify/functions/vacation',
  rawQuery: string; // '',
  path: string; // '/.netlify/functions/vacation',
  httpMethod: string; // 'GET',
  headers: {
    accept: string; // '*/*,image/webp',
    'accept-encoding': string; // 'br',
    'accept-language': string; // 'en-US,en;q=0.9',
    'cache-control': string; // 'no-cache',
    host: string; // 'chuck.fail',
    pragma: string; // 'no-cache',
    referer: string; // 'https://chuck.fail/',
    'sec-ch-ua': string; // '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
    'sec-ch-ua-mobile': string; // '?0',
    'sec-ch-ua-platform': string; // '"macOS"',
    'sec-fetch-dest': string; // 'empty',
    'sec-fetch-mode': string; // 'cors',
    'sec-fetch-site': string; // 'same-origin',
    'user-agent': string; // 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'x-country': string; // 'US',
    'x-forwarded-for': string; // '174.163.4.226, 100.64.0.200',
    'x-forwarded-proto': string; // 'https',
    'x-language': string; // 'en-US',
    'x-nf-client-connection-ip': string; // '174.163.4.226',
    'x-nf-request-id': string; // '01GPVRR4TN9E6VV3EAQ73J68B9'
  };
  multiValueHeaders: {
    Accept: string[];
    'Accept-Encoding': string[];
    'Accept-Language': string[];
    'Cache-Control': string[];
    Pragma: string[];
    Referer: string[];
    'Sec-Ch-Ua': string[];
    'Sec-Ch-Ua-Mobile': string[];
    'Sec-Ch-Ua-Platform': string[];
    'Sec-Fetch-Dest': string[];
    'Sec-Fetch-Mode': string[];
    'Sec-Fetch-Site': string[];
    'User-Agent': string[];
    'X-Country': string[];
    'X-Forwarded-For': string[];
    'X-Forwarded-Proto': string[];
    'X-Language': string[];
    'X-Nf-Client-Connection-Ip': string[];
    'X-Nf-Request-Id': string[];
    host: string[];  
  },
  queryStringParameters: {
    [key: string]: string;
  },
  multiValueQueryStringParameters: {
    [key: string]: string;
  },
  body: string;
  isBase64Encoded: boolean;
}