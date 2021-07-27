# umeng_cocos_creator_plugin
cocos creator ov华米 快游戏打包时导入友盟统计插件
友盟统计官方代码中导入后游戏一直无法运行，
增加try/catch以后报export语法错误,
删除代码中最后一处export default de;以后运行正常。
使用方式：
替换插件目录下的uma.min.js 并删除文件中最后一处 export default de;
项目->友盟设置->勾选需要加入友盟统计的平台->编译项目