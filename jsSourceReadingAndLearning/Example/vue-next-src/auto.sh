#!/bin/bash
src_file_list=`ls |grep -v node_modules`
cp -r $src_file_list /c/Workspace/web_stu/jsSourceReadingAndLearning/Example/vue-next-src
cd /c/Workspace/web_stu
pwd
read -t 30 -p "请输入commit:" commit
git add .
git commit -m "vue-next-src: $commit"
# git push
read