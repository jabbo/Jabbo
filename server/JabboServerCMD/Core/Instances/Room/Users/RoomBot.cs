using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

using JabboServerCMD.Core.Instances.Room;
using JabboServerCMD.Core.Instances.User;
using JabboServerCMD.Core.Instances.Room.Pathfinding;
using JabboServerCMD.Core.Systems;

namespace JabboServerCMD.Core.Instances.Room.Users
{
    public class RoomBot
    {
        public string _MyName;
        public string _MyFigure;
        public string _MyMission;
        public int _MyX;
        public int _MyY;
        public int _MyZ;
        public string _Sit;
        public bool _CanRoam;
        public bool startDoor;
        public Room _MyRoom;
        public int _MyAvatarID;

        internal int lastMessageID;

        public bool walking;

        public int targetX;
        public int targetY;
        
        private chatTrigger[] chatTriggers;
        private string[] sayings;
        public Thread aiHandler;

        private bool firstAI = true;

        public RoomBot(Room Room, int botID, int botTemplate)
        {
            _MyRoom = Room;
            _Sit = "";
            _MyAvatarID = botID - botID * 2;

            string[] botData = MySQL.runReadRow("SELECT name, mission, figure, x, y, z, freeroam, startdoor FROM roombots WHERE id = '" + botTemplate + "'");
            if (botData[0] != "")
            {
                _MyName = botData[0];
            }
            else
            {
                _MyName = "Bot " + botID;
            }
            _MyMission = botData[1];
            _MyFigure = botData[2];
            _CanRoam = (botData[6] == "1");
            startDoor = (botData[7] == "1");
            if (startDoor)
            {
                _MyX = Room.door_x;
                _MyY = Room.door_y;
                _MyZ = Room.door_dir*2;
            }
            else
            {
                _MyX = int.Parse(botData[3]);
                _MyY = int.Parse(botData[4]);
                _MyZ = int.Parse(botData[5]);
            }
            
            targetX = _MyX;
            targetY = _MyY;

            sayings = MySQL.runReadColumn("SELECT text FROM roombots_texts WHERE id = '" + botTemplate + "'", 0);

            string[] triggerWords = MySQL.runReadColumn("SELECT words FROM roombots_texts_triggers WHERE id = '" + botTemplate + "'", 0);
            if (triggerWords.Length > 0)
            {
                string[] triggerReplies = MySQL.runReadColumn("SELECT replies FROM roombots_texts_triggers WHERE id = '" + botTemplate + "'", 0);

                this.chatTriggers = new chatTrigger[triggerWords.Length];
                for (int i = 0; i < triggerWords.Length; i++)
                    this.chatTriggers[i] = new chatTrigger(triggerWords[i].Split('}'), triggerReplies[i].Split('}'));
            }

            if (sayings.Length > 0)
            {
                aiHandler = new Thread(new ThreadStart(AI));
                aiHandler.Priority = ThreadPriority.BelowNormal;
                aiHandler.Start();
            }
            walking = false;
        }


        public void DoChat(string Message, ConnectedUser User)
        {
            Message = Message.ToLower();
            string[] messageWords = Message.Split(' ');

            if (chatTriggers != null)
            {
                foreach (chatTrigger Trigger in chatTriggers)
                {
                    for (int i = 0; i < messageWords.Length; i++)
                    {
                        if (messageWords[i] != " " && messageWords[i] != "")
                        {
                            if (Trigger.containsWord(messageWords[i]))
                            {
                                _MyRoom.sendChat(_MyAvatarID, Trigger.Reply, _MyName);
                            }
                        }
                    }
                }
            }
        }


        private void AI()
        {
            Random RND = new Random(_MyAvatarID * DateTime.Now.Millisecond);
            while (true)
            {
                if (firstAI)
                {
                    firstAI = false;
                }
                else
                {
                    if (sayings.Length > 0)
                    {
                        int messageID = RND.Next(0, sayings.Length);
                        if (sayings.Length > 1)
                        {
                            while (messageID == lastMessageID)
                                messageID = RND.Next(0, sayings.Length);
                            lastMessageID = messageID;
                        }
                        _MyRoom.sendChat(_MyAvatarID, sayings[messageID], _MyName);
                    }
                }
                Thread.Sleep(25000);
            }
        }

        private class chatTrigger
        {
            private string[] Words;
            private string[] Replies;

            internal chatTrigger(string[] Words, string[] Replies)
            {
                this.Words = Words;
                this.Replies = Replies;
            }

            internal bool containsWord(string Word)
            {
                if (Word.Substring(Word.Length - 1, 1) == "?")
                    Word = Word.Substring(0, Word.Length - 1);

                for (int i = 0; i < Words.Length; i++)
                    if (Words[i] == Word)
                        return true;
                return false;
            }

            internal string Reply
            {
                get
                {
                    return Replies[new Random(DateTime.Now.Millisecond).Next(0, Replies.Length)];
                }
            }
        }
    }
}