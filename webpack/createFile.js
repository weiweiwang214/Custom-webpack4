const fs = require('fs')

//在三个目录中新增文件
const dirs = new Map([
    ['pages','html'],
    ['sass','scss'],
    ['entry','js']
])

const creatFiles = function (fileName) {

    for (let [key,value] of dirs.entries()){

        fs.writeFile(`../${key}/${fileName}.${value}`, "", err => {
            if (err) throw err

            console.log('创建成功');
        })

    }
}

//在js和sass中引入需要的文件
const
    text =
    "import 'sass/layout.scss'"

const appendFiles = function(fileName){

    fs.appendFile(`../entry/${fileName}.js`,text, function (err) {
        if (err) throw err

        console.log('js写入成功')
    })

    fs.appendFile('../sass/layout.scss',`@import '${fileName}.scss';`, err => {
        if (err) throw err

        console.log('scss加入成功')
    })

}


const fileTodo = function (fileName) {
    appendFiles(`${fileName}`)
    creatFiles(`${fileName}`)
}
fileTodo('header')



