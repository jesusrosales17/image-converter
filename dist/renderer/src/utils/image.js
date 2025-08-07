"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidImageExtension = exports.getImageExtension = exports.formatImageInfo = void 0;
const formatImageInfo = (path) => {
    // obtener nombre sin extensión
    const fileName = path.split('/').pop() || '';
    // const fileName = path.split('/').pop()?.split('.')[0] || '';
    return {
        path,
        name: fileName
    };
};
exports.formatImageInfo = formatImageInfo;
const getImageExtension = (fileName) => {
    return fileName.split('.').pop() || '';
};
exports.getImageExtension = getImageExtension;
const isValidImageExtension = (extension) => {
    return ['jpg', 'jpeg', 'png', 'webp', 'avif', 'bmp', 'tiff'].includes(extension.toLowerCase());
};
exports.isValidImageExtension = isValidImageExtension;
//# sourceMappingURL=image.js.map