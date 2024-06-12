const fs = require('fs');
const { resolve } = require('path');

const deleteFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleteting File: ', err);
                return reject(err);
            }
            resolve();
        });
    });
}

module.exports = { deleteFile };