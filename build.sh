#!/bin/sh
echo "format: build.sh platform debug/release"
echo "platorm: intorobot/intoyun/77"
if [ $1 = "intoyun" ] ; then     #如果是linux的话打印linux字符串
echo "intoyun"
sed -i "s/^var serverURL.*;/var serverURL = \'http:\/\/112.124.117.64\';/" ./www/js/molmc/utils.js;
sed -i "s/^var serverMQTT.*;/var serverMQTT = \'112.124.120.127\';/" ./www/js/molmc/utils.js;
buildPath="intoyun"
appname="intoyun"
elif [ $1 = "intorobot" ] ; then
echo "intorobot"
sed -i "s/^var serverURL.*;/var serverURL = \'http:\/\/www.intorobot.com\';/" ./www/js/molmc/utils.js;
sed -i "s/^var serverMQTT.*;/var serverMQTT = \'iot.intorobot.com\';/" ./www/js/molmc/utils.js;
buildPath="IntoRobotX5"
appname="intorobot"
elif [ $1 = "77" ] ; then
echo "77"
sed -i "s/^var serverURL.*;/var serverURL = \'http:\/\/192.168.0.77\';/" ./www/js/molmc/utils.js;
sed -i "s/^var serverMQTT.*;/var serverMQTT = \'192.168.0.77\';/" ./www/js/molmc/utils.js;
buildPath="IntoRobot-debug"
appname="intorobot_debug"
else
sed -i "s/^var serverURL.*;/var serverURL = \'http:\/\/192.168.0.77\';/" ./www/js/molmc/utils.js;
sed -i "s/^var serverMQTT.*;/var serverMQTT = \'192.168.0.77\';/" ./www/js/molmc/utils.js;
buildPath="IntoRobot-debug"
appname="intorobot_debug"
fi     #ifend
echo $buildPath

if [ $1 = "intorobot" ] && [ $2 = "release" ] ; then     #如果是linux的话打印linux字符串
./export_to_release.sh
else
rm -rf /home/hhe/workspace/XDK/$buildPath/www
cp -r ./www /home/hhe/workspace/XDK/$buildPath
cp -rf ./temp /home/hhe/workspace/XDK/$buildPath
cp -rf ./res /home/hhe/workspace/XDK/$buildPath/platforms/android
cd /home/hhe/workspace/XDK/$buildPath
cd ./www/js/molmc/
zip -r widgets.zip ./widgets
cd ../../../
rm -rf ./www/js/molmc/widgets
cordova plugin remove com.molmc.intorobot.wificonfig
cordova plugin add ./temp/com.molmc.intorobot.wificonfig
cordova build android
cordova build android -release
#adb uninstall com.molmc.$appname
adb install -r /home/hhe/workspace/XDK/$buildPath/platforms/android/build/outputs/apk/android-$2.apk
fi     #ifend
cd /home/hhe/svn/app_repos/IntoRobotX5
