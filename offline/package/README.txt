ONE DHS / ONE DSD PEOPLE, ACCESS AND CULTURE — OFFLINE EDITION
================================================================

This folder is the complete program. It runs on a Windows computer with no
internet connection and nothing to install. Every page, course, resource,
download and audio recording works offline, and you can edit the program
and keep your changes.


START AND STOP
--------------
  Start One DHS PAC.cmd    Double-click to start. The program opens in your
                           web browser, signed in to the Consultant
                           Workspace. Keep the black window open while the
                           program is in use.

  Stop One DHS PAC.cmd     Stops the program. Closing the black window or
                           pressing Ctrl+C in it also stops it.

  Open as owner.cmd        Opens the Consultant Workspace again, for example
                           after closing the browser.

The first start takes a minute or two while the program prepares its
database on this computer. Later starts are quicker. The first page after
each start can take up to 30 seconds to appear; after that pages are fast.


SHARE WITH OTHER PEOPLE
-----------------------
While the program is running, anyone on the same network (the same office
or home Wi-Fi or wired network) can open it in their own browser.

  Copy share link.cmd      Shows the link and copies it to your clipboard,
                           for example  http://10.0.0.177:3100
                           Paste it into an email, chat or browser.

The Share button on every page also copies a link others can open.

  * The first time you start the program, Windows may ask whether Node.js
    can use the network. Choose "Private networks" and select Allow.
    If you choose Cancel, only this computer can open the program.
  * Shared links work only while this computer is on and the program is
    running.
  * People who open a shared link see the program as staff do. Editing and
    API connections are available only on this computer.
  * The link uses this computer's network address, which can change when
    it reconnects to a network. Use Copy share link.cmd to get the current
    link.
  * People outside your network (for example at home when the program is
    running at the office) cannot open the link. For that, use the hosted
    program, or ask for help setting up a secure online tunnel.


EDIT THE PROGRAM
----------------
In the Consultant Workspace, choose "Turn on page editing and open the site".
Click any text to change it, then choose Save changes. Your changes are kept
on this computer and are shown to everyone who opens the program here.


AUDIO RECORDINGS
----------------
All podcasts, course introductions and listening examples are stored in
this folder and play without the internet.


API CONNECTIONS (AI AND RESEARCH)
---------------------------------
In the Consultant Workspace, choose "API connections" to add Anthropic,
OpenAI or Perplexity keys, turn AI answers or external research on, and set
a monthly research spending limit. The program restarts by itself in a few
seconds to use the new settings.

  * Keys are saved in your Windows user folder on this computer, never in
    this program folder, and are never shown again in full.
  * Connections are used only while the computer is online. Everything else
    works without them.


BACK UP AND MOVE YOUR EDITS
---------------------------
  Back up edits.cmd        Saves all edits and saved work to the "backups"
                           folder here.

  Restore edits.cmd        Replaces all edits and saved work on this
                           computer with a backup. Stop the program first,
                           then drag a backup file onto Restore edits.cmd.

To move to another computer: back up, copy this whole folder (including the
backups folder) to the other computer, start the program once, stop it, and
restore the backup there.


WHERE THINGS ARE KEPT
---------------------
This folder:   the program, its content, audio, and the Node.js and
               PostgreSQL software it runs on.
Your Windows user folder (%LOCALAPPDATA%\OneDHS-PAC-Offline):
               the database with your edits, the workspace access key,
               API keys, and logs. Nothing here is copied with the folder.

If something does not start, the logs folder above says why.


WHAT NEEDS THE INTERNET
-----------------------
Links to outside websites, AI answers and external research. Everything
else in the program works offline.
