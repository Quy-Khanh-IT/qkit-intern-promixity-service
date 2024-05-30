import env from '../config/config.env';

export const listProxy = env.PROXY.split(',');

const newList = new Map(listProxy.map((item) => [item, true]));

console.log(newList);
