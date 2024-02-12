# EDIT SPEEDBOOSTER

## ABOUT

The plugin is dedicated to users editing in Adobe Premiere Pro,
who want to speed up certain actions repeated multiple times for specific or all selected files.
The goal of this tool is to automate actions that previously required dedicated macros.

## HOW TO USE

This plugin isn't officially available in the Adobe Plugins Store. To use it on your PC, you need to first add a registry entry:
### Windows:
1) Open regedit.exe
2) Navigate to HKEY_CURRENT_USER\Software\Adobe\CSXS.11\
3) Create a new entry named: "PlayerDebugMode" 
4) Set the value of the new entry to: "1"

All files will be working after You paste it in plugins directory:
```
C:\Program Files (x86)\Common Files\Adobe\CEP\extensions
```
### MAC:
```sh
defaults write /Users/<userprofile>/Library/Preferences/com.adobe.CSXS.11.plist PlayerDebugMode 1
```
All files will be working after You paste it in plugins directory:
```
Hard Drive/Library/Application Support/Adobe/CEP/extensions/
```
---

The app will be available in Premiere Pro under "Window > Extensions > SIMPLE QUEUE TOOL"