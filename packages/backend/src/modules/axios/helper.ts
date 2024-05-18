const list = [
  '42.96.10.104:3128',
  '14.177.236.212:55443',
  '14.161.26.100:8080',
  '123.16.13.146:8080',
  '42.96.10.104:3128',
];

export const getHost = (si = 0) => {
  si++;
  if (si === list.length) si = 0;
  const [host, port] = list[si].split(':');
  return { host, port };
};
