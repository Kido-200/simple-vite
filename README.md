# simple-vite
vite的出现是因为浏览器已经支持了type=“module”,也就是es module，也就是import export语法，但是他读不懂我们写在文件里的相对路径那种。 
我们需要做的是起一个koa服务器，前端需要啥代码，我返回给他
但是返回js的时候做import做一下特殊处理，因为import模块 的时候路径要改成node_modules里拿。所以用户那拿到的都是’/@modeules/’的路径，我们就再用koa处理一下，返回正确文件。浏览器解析type=“module”的js，遇到import就会自动向koa服务器以那个新路径再次请求，也就实现了按需请求加载。
做完上面的index.html里引入入口js就好了。
