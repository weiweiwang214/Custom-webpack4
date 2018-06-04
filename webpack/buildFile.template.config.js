const fs = require('fs');
const path = require("path");
const mkdir = ['entry', 'sass','pages','fonts','images','video','lib']; //创建入口目录、scss文件目录、页面文件目录


/***************************
 **********入口文件名*********
 ***************************/
const fileName = [
    'index','about',
];

const entryData = "import 'jquery'";// 入口文件写入初始内容
const scssDate = '';//scss文件写入初始内容
const htmlData = fs.readFileSync(rootDir(`template.html`));//返回模板HTML内容
mkdir.forEach((v) => {
  fs.mkdir(v, (err) => {
  });
});
//创建目录
fileName.forEach((v) => {
  fs.writeFileSync(rootDir(`entry/${v}.js`), entryData +`\nimport 'sass/layout.scss'` +`\nimport 'pages/${v}.html'`);//创建入口文件并写入初始内容
  fs.writeFileSync(rootDir(`sass/${v}.scss`), scssDate);//创建scss文件并写入初始内容
  fs.appendFileSync(rootDir(`sass/layout.scss`), `@import '${v}.scss';\n`);//创建主scss文件并写入其它页面scss文件
   fs.writeFile(rootDir(`pages/${v}.html`), htmlData, (err) => {
    if (err) {
      throw err;
    } else {
      console.log(`${v}.html、${v}.js、${v}.scss构建完成,下一步开启devSever服务器`);
    }
  });//根据入口文件数量批量创建HTML
});

function rootDir(src) {
  return path.join(__dirname,'..', src);
}