"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatFileSize = exports.isValidImageExtension = exports.getImageExtension = exports.formatImageInfo = void 0;
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
    return ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff'].includes(extension.toLowerCase());
};
exports.isValidImageExtension = isValidImageExtension;
const formatFileSize = (bytes) => {
    if (bytes === 0)
        return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
exports.formatFileSize = formatFileSize;
//# sourceMappingURL=image.js.map