


// const BASE_URL = '10.0.0.160';
const BASE_URL = 'localhost';

export const URLS = {
    // projector: 'http://10.0.0.160:18080/',
    projector: 'http://' + BASE_URL + ':18080/',
    shots: 'http://' + BASE_URL + ':18081/',
    graphics: 'http://' + BASE_URL + ':18082/',
    layouts: 'http://' + BASE_URL + ':18083/',
    image: 'http://' + BASE_URL + ':18084/',
    attempts: 'http://' + BASE_URL + ':18085/',
    config: 'http://' + BASE_URL + ':18086/',
}

export const APIS = [{
    label: 'Shots',
    url: URLS.shots
}, {
    label: 'Configuration',
    url: URLS.config
}, {
    label: 'Image Processing',
    url: URLS.image
}, {
    label: 'Layouts',
    url: URLS.layouts
}, {
    label: 'Graphics',
    url: URLS.graphics
}, {
    label: 'Projector',
    url: URLS.projector
}, {
    label: 'Attempts',
    url: URLS.attempts
}];
