echo Welcome to server creator! This script will help you create your very own minecraft server!
echo Creating server in directory $(pwd), if you do not wish for you server to be here, press Control + C in the next 5 seconds.
sleep 5
echo Starting...
echo Enter the name for your server. This is only visible to you. Make sure to use a unique name that isn\'t used by any other files in this folder.
read dirname
mkdir $dirname
cd $dirname
echo Downloading jar for 1.19.2...
echo If you get an error, please install wget
curl https://piston-data.mojang.com/v1/objects/f69c284232d7c7580bd89a5a4931c3581eae1378/server.jar > server.jar
echo Please ensure that java 17 or later is installed, check your java version with java --version
echo Please wait...
java -jar server.jar --initSettings
echo Creating start script...
echo How much ram should your server be able to use? Depending on how much ram your computer has, you might want to use 2, 4, 8, or even 16 but you should leave enough ram for your system to run.
read wam
echo "cd $(pwd); exec java -Xmx"$wam"G -Xms"$wam"G -jar server.jar" > start.sh
chmod +x start.sh
curl https://pikapower9080.github.io/fun/minecraft/createserver/info.txt > readme.txt
echo Complete!
echo Open eula.txt and change false to true.
echo "If you don't want the gui to show up when starting your server, open start.sh and add nogui to the end."
echo Start your server by running start.sh the same way you ran this script.
echo To make changes to or start your server, make sure to type cd "$dirname" before doing anything.
echo "I downloaded a file into your server folder called readme.txt. It contains instructions for just about everything you could want to do with your new server. From connecting to it to changing settings."
