Entry.skeleton = {};

// index.js 를 제외한 playground/skeleton 디렉토리 하위의 모든 js 를 불러옴
// https://webpack.js.org/guides/dependency-management/#requirecontext
const context = require.context('.', true, /^(?!.*index.[jt]s)(.*\.[jt]s$)/im);
context.keys().forEach(context);
