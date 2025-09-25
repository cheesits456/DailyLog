#!/usr/bin/env bash

output_folder="./dist/DailyLog-linux-x64"
echo "Moving binary to new path"
mv "${output_folder}/DailyLog" "${output_folder}/binary"
echo "Creating new launcher file"
cp "./compilers/launcher.sh" "${output_folder}/DailyLog"
echo "Done!"