#!/bin/bash
echo "start 拷贝文件"
src_file_list=`ls |grep -v node_modules`
cp -r $src_file_list /c/Workspace/web_stu/jsSourceReadingAndLearning/Example/vue-next-src
echo "end 拷贝文件"
cd /c/Workspace/web_stu
pwd
echo "start 开始上传"
read -t 300 -p "请输入commit:" commit
git add .
git commit -m "vue-next-src: $commit"
git push
echo "end 上传完成"
read -t 30