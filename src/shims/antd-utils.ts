export const message = {
  success: (msg: string) => console.log('Message Success:', msg),
  error: (msg: string) => console.error('Message Error:', msg),
  warning: (msg: string) => console.warn('Message Warning:', msg),
  info: (msg: string) => console.info('Message Info:', msg),
};

export const notification = message;

