import Root from './root.component';
import appConfig from '../app.config.json';
import { initCore, initQiankunPublicPath } from '@fs-web-kits/core';
import { createReactAdapter } from '@fs-web-kits/mfe-react-18-adapter';

// Khởi tạo public path
initQiankunPublicPath();

// Tạo adapter cho React 18
const adapter = createReactAdapter(Root, {
    rootId: 'root', // ID của element root trong index.html
    basePath: process.env.REACT_APP_PUBLIC_PATH || '/',
    enableStandalone: true, // Cho phép chạy độc lập khi phát triển
});

// Export lifecycle và axios instance cho main app
export const { axios, bootstrap, mount, unmount } = initCore(appConfig.name, adapter);
