const Koa = require('koa');
const app = new Koa();
const fs = require('fs');
const path = require('path');
app.use(async ctx => {
  const {url,query} = ctx;
  // console.log('url:' + url,'query type' + query.type);
  // 首页
  if(url === '/'){
    ctx.type = 'text/html';
    let content = fs.readFileSync('./index.html','utf-8');
    content = content.replace("<script "
    ,`
    <script>
      window.process = {env:{NODE_ENV:'dev'}}
      </script>
      <script
    `)
    ctx.body = content;

    // 响应获取js文件
  }else if(url.endsWith('.js')){
    const p = path.resolve(__dirname, url.slice(1));
    // console.log('path',p)

    ctx.type = 'application/javascript';
    const content = fs.readFileSync(p,'utf-8');
    
    // 改写js文件中import React from 'react' 这种从node_modules里取文件的import
    // 改成了改写js文件中import React from '/@modules/react'
    // 所以前端那边会请求/@modules/react 这个路径,这样才能找到
    ctx.body = rewriteImport(content);
  }else if(url.startsWith('/@modules/')){
    //  /@modules/react => node_modules/react  esmodule的入口
    // package.json的module字段指向的文件
    const prefix = path.resolve(__dirname,'node_modules',url.replace('/@modules/',''));
    console.log('prefix',prefix);
    const module = require(prefix + '/package.json').module;
    const p = path.resolve(prefix,module);
    const ret = fs.readFileSync(p,'utf-8');
    ctx.type = 'application/javascript';
    ctx.body = rewriteImport(ret);
  }
})

app.listen(3000, () => {
  console.log('Vite start at 3000');
})

function rewriteImport(content) {
  return content.replace(/ from ['|"]([^'"]+)['|"]/g,function(s0,s1){
    console.log("s",s0,s1);
    // . ../ ./开头都是相对路径
    if(s1[0] !== '.' && s1[0] !== '/'){
      return ` from '/@modules/${s1}'`
    } else{
      return s0;
    }
  })
}