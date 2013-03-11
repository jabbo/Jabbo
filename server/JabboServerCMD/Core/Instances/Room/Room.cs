using System;
using System.Text;
using System.Threading;
using System.Collections;
using System.Collections.Generic;

using JabboServerCMD.Core.Systems;
using JabboServerCMD.Core.Instances.Room.Users;
using JabboServerCMD.Core.Instances.User;
using JabboServerCMD.Core.Sockets.Packets.Game;
using JabboServerCMD.Core.Instances.Room.Pathfinding;
using JabboServerCMD.Core.Instances.Room.Furni;
using JabboServerCMD.Core.Managers;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Instances.Room
{
    public class Room
    {
        public int RoomID;
        public string RoomName;
        public string RoomDescr;
        public int RoomOwner = 0;
        public string RoomOwnerName = "";
        public string RoomSize;
        public int floorType;
        public int wallType;
        public string door;
        public int door_x;
        public int door_y;
        public int lang;
        public int breed;
        public int doorstep_x;
        public int doorstep_y;
        public int door_dir;
        public string[] holes;
        public int score;
        public int max_users;

        public Hashtable _Users = new Hashtable();
        public Hashtable _Bots = new Hashtable();

        public Hashtable furniture;

        public bool[,] _sqUnit;
        public byte[,] _sqHeight;
        public byte[,] _sqRot;
        public string[,] _sqTile;
        public ItemStack[,] _sqStack;
        public squareState[,] _sqState;

        public int botAmount = 0;

        public int countUsers()
        {
            return _Users.Count + _Bots.Count;
        }

        public enum squareState
        {
            Open = 0,
            Blocked = 1,
            Stackable = 2,
            Seat = 3,
            Door = 4
        };

        delegate void WaitDelegate(ConnectedUser User);
        public void sendRoomData(ConnectedUser User)
        {
            WaitDelegate X = new WaitDelegate(sendRoomData2);
            IAsyncResult ar = X.BeginInvoke(User, null, null);
            ar.AsyncWaitHandle.WaitOne(1000, false);
            if (ar.IsCompleted)
            {
                X.EndInvoke(ar);
            }
        }

        public void sendRoomData2(ConnectedUser User)
        {
            string sendText = "";
            foreach (ConnectedUser usr in _Users.Values)
            {
                AddAvatarPacket avatars = new AddAvatarPacket();

                avatars.I = usr._UserID;
                avatars.U = usr._Username;
                avatars.M = usr._Mission;
                avatars.C = usr._Figure;
                avatars.B = usr._Badge;
                avatars.D = usr._Drink;
                avatars.Brb = usr._Brb;
                avatars.S = usr._Room_Sit;
                avatars.X = usr._Room_X;
                avatars.Y = usr._Room_Y;
                avatars.H = usr._Room_Dir;
                avatars.F = false;
                avatars.R = usr._HasRights;
                
                string stringavatars = JsonConvert.SerializeObject(avatars);

                sendText += "056" + stringavatars + "#";
            }

            foreach (RoomBot bot in _Bots.Values)
            {
                // TODO: make it have a better id and different id
                AddAvatarPacket avatars = new AddAvatarPacket();

                avatars.I = bot._MyAvatarID;
                avatars.U = bot._MyName;
                avatars.M = bot._MyMission;
                avatars.C = bot._MyFigure;
                avatars.B = "7"; // bot badge
                avatars.D = "";
                avatars.Brb = 0;
                avatars.S = bot._Sit;
                avatars.X = bot._MyX;
                avatars.Y = bot._MyY;
                avatars.H = bot._MyZ;
                avatars.F = false;
                avatars.R = false;

                string stringavatars = JsonConvert.SerializeObject(avatars);

                sendText += "056" + stringavatars + "#";
            }
            sendText += "044" + "#";
            User.sendData(sendText);
        }

        private int RandomNumber(int min, int max)
        {
            Random random = new Random();
            return random.Next(min, max);
        }

        public void sendData(string Data)
        {
            foreach (ConnectedUser User in _Users.Values)
            {
                User.sendData(Data);
            }
        }

        public void sendDataButNotTo(ConnectedUser NotTo, string Data)
        {
            foreach (ConnectedUser User in _Users.Values)
            {
                if (User != NotTo)
                {
                    User.sendData(Data);
                }
            }
        }

        public void userChat(ConnectedUser sender, string message, string userName)
        {
            sendChat(sender._UserID, message, userName);
            foreach (RoomBot Bot in _Bots.Values)
            {
                Bot.DoChat(message, sender);
            }
        }

        public void sendChat(int senderID, string message, string userName)
        {
            SendMessageReplyPacket ToSendChatMessage = new SendMessageReplyPacket();

            ToSendChatMessage.U = userName;
            ToSendChatMessage.I = senderID;
            ToSendChatMessage.M = message;

            string ToSendChatMessageString = JsonConvert.SerializeObject(ToSendChatMessage);

            foreach (ConnectedUser User in _Users.Values)
                User.sendData("052" + ToSendChatMessageString + "#");
        }

        public void addUser(ConnectedUser User)
        {
            removeUser(User); // just a check

            int users = countUsers();
            if (users < max_users)
            {
                User._Room_X = door_x;
                User._Room_Y = door_y;
                User._Room_Z = 0;
                User._Room_Dir = door_dir * 2;
                User._Room_X_Target = door_x;
                User._Room_Y_Target = door_y;
                User._Drink = "";
                User._Brb = 0;
                User._Room_Sit = "";

                if (RoomOwner == User._UserID || RankManager.containsRight(User._Rank, "always_rights"))
                {
                    User._HasRights = true;
                }
                else
                {
                    if (MySQL.runRead("SELECT userid FROM room_rights WHERE roomid = '" + RoomID + "' AND userid = '" + User._UserID + "'", null) == 0)
                    {
                        User._HasRights = false;
                    }
                    else
                    {
                        User._HasRights = true;
                    }
                }

                loadRoomPacket(User);
                
                foreach (ConnectedUser usr in _Users.Values)
                {
                    AddAvatarPacket avatars = new AddAvatarPacket();

                    avatars.I = User._UserID;
                    avatars.U = User._Username;
                    avatars.M = User._Mission;
                    avatars.C = User._Figure;
                    avatars.B = User._Badge;
                    avatars.D = User._Drink;
                    avatars.Brb = User._Brb;
                    avatars.S = User._Room_Sit;
                    avatars.X = User._Room_X;
                    avatars.Y = User._Room_Y;
                    avatars.H = User._Room_Dir;
                    avatars.F = User._HasRights;
                    
                    string stringavatars = JsonConvert.SerializeObject(avatars);

                    usr.sendData("056" + stringavatars + "#");
                }

                _Users.Add(User._UserID, User);

                sendRoomData(User);
            }
            else
            {
                // room is full
                sendData("061#");
            }
        }

        public void removeUser(ConnectedUser userToRemove)
        {
            if (!containsUser(userToRemove._UserID))
            {
                return;
            }

            _Users.Remove(userToRemove._UserID);

            foreach (ConnectedUser usr in _Users.Values)
            {
                RemoveAvatarPacket toremove = new RemoveAvatarPacket();
                toremove.I = userToRemove._UserID;
                string stringtoremove = JsonConvert.SerializeObject(toremove);
                usr.sendData("058" + stringtoremove + "#");
            }

            if (!(userToRemove._Room_X == doorstep_x && userToRemove._Room_Y == doorstep_y))
            {
                try { _sqUnit[userToRemove._Room_X, userToRemove._Room_Y] = false; } catch { }
            }

            userToRemove._Room_X = 0;
            userToRemove._Room_Y = 0;
            userToRemove._Room_X_Target = 0;
            userToRemove._Room_Y_Target = 0;
            userToRemove._HasRights = false;
            userToRemove._Drink = "";
            userToRemove._Brb = 0;
            userToRemove._Room_Sit = "";

            if ((countUsers()) == 0)
            {
                _Users.Clear();
                _Bots.Clear();
                RoomManager.removeRoom(RoomID);
            }
        }

        internal bool containsUser(int UserID)
        {
            return _Users.ContainsKey(UserID);
        }

        internal bool containsBot(int botID)
        {
            return _Bots.ContainsKey(botID);
        }

        public virtual void loadRoomPacket(ConnectedUser User)
        {

        }

        public virtual void doFurni(ConnectedUser User, int I, string T)
        {

        }

        public virtual void turnFurni(ConnectedUser User, int I)
        {

        }

        public virtual void actionFurni(ConnectedUser User, int I)
        {

        }

        public virtual void pickAllUp(ConnectedUser User)
        {

        }

        internal void refreshCoord(int X, int Y)
        {

        }

        internal void loadBots(int amount)
        {
            string sendText = "";
            int users = countUsers();
            for (int i = 0; i < amount; i++)
            {
                if (users++ < max_users)
                {
                    int botID = ++botAmount;
                    RoomBot roomBot = new RoomBot(this, botID, 0);
                    this._Bots.Add(botID, roomBot);
                    if (!roomBot.startDoor)
                    {
                        _sqUnit[roomBot._MyX, roomBot._MyY] = true;
                    }
                    AddAvatarPacket avatars = new AddAvatarPacket();
                    avatars.I = roomBot._MyAvatarID;
                    avatars.U = roomBot._MyName;
                    avatars.M = roomBot._MyMission;
                    avatars.C = roomBot._MyFigure;
                    avatars.B = "7";
                    avatars.D = "";
                    avatars.Brb = 0;
                    avatars.S = roomBot._Sit;
                    avatars.X = roomBot._MyX;
                    avatars.Y = roomBot._MyY;
                    avatars.H = roomBot._MyZ;
                    avatars.F = false;
                    avatars.R = false;
                    string stringavatars = JsonConvert.SerializeObject(avatars);
                    sendText += "056" + stringavatars + "#";
                }
            }
            foreach (ConnectedUser usr in _Users.Values)
            {
                usr.sendData(sendText);
            }
        }

        public void removeBot(int botID)
        {
            if (!containsBot(botID))
                return;
            
            RoomBot botToRemove = (RoomBot)_Bots[botID];
            _Bots.Remove(botID);

            int avatarID = botID - botID * 2;

            foreach (ConnectedUser usr in _Users.Values)
            {
                RemoveAvatarPacket toremove = new RemoveAvatarPacket();
                toremove.I = botToRemove._MyAvatarID;
                string stringtoremove = JsonConvert.SerializeObject(toremove);
                usr.sendData("058" + stringtoremove + "#");
            }

            if (((botToRemove._MyX + 1).ToString()) + "_" + ((botToRemove._MyY + 1).ToString()) != door)
            {
                _sqUnit[botToRemove._MyX, botToRemove._MyY] = false;
            }

            if ((countUsers()) == 0)
            {
                _Users.Clear();
                _Bots.Clear();
                RoomManager.removeRoom(RoomID);
            }
        }

        public void kickAllBots()
        {
            List<int> removeIDs = new List<int>();
            foreach (RoomBot bot in _Bots.Values)
            {
                try
                {
                    bot.aiHandler.Abort();
                }
                catch { }
                removeIDs.Add(-bot._MyAvatarID);
            }
            removeIDs.ToArray();
            foreach (int botID in removeIDs)
            {
                removeBot(botID);
            }
        }

        public void vote(string vote, ConnectedUser user)
        {
            if (user._UserID != RoomOwner && !user._Room_Voted)
            {
                if (vote == "up")
                {
                    MySQL.runQuery("UPDATE rooms SET score = " + ++score + " WHERE id = '" + RoomID + "'");
                }
                else if (vote == "down")
                {
                    MySQL.runQuery("UPDATE rooms SET score = " + --score + " WHERE id = '" + RoomID + "'");
                }
                MySQL.runQuery("INSERT INTO room_votes SET user='" + user._UserID + "', room='" + RoomID + "'");
                user._Room_Voted = true;
            }
            RoomScorePacket toremove = new RoomScorePacket();
            toremove.S = score;
            string scorePacketString = JsonConvert.SerializeObject(toremove);
            user.sendData("066" + scorePacketString + "#");
        }


        public void getDrink(string drink, ConnectedUser user)
        {
            if (drink == "" || drink == "camera")
            {
                user._Drink = drink;
                GiveDrinkPacket giveDrink = new GiveDrinkPacket();
                giveDrink.I = user._UserID;
                giveDrink.D = drink;
                string giveDrinkString = JsonConvert.SerializeObject(giveDrink);
                string sendText = "074" + giveDrinkString + "#";
                foreach (ConnectedUser usr in _Users.Values)
                {
                    usr.sendData(sendText);
                }
            }
        }

        public void updateBrb(int brb, ConnectedUser user)
        {
            if (brb == 0 || brb == 1)
            {
                user._Brb = brb;
                UpdateBrbPacket updateBrb = new UpdateBrbPacket();
                updateBrb.I = user._UserID;
                updateBrb.Brb = brb;
                string updateBrbString = JsonConvert.SerializeObject(updateBrb);
                string sendText = "082" + updateBrbString + "#";
                foreach (ConnectedUser usr in _Users.Values)
                {
                    usr.sendData(sendText);
                }
            }
        }

        public struct Item
        {
            internal int id;
            internal int owner;
            internal int room;
            internal string tile;
            internal int stacknr;
            internal int stackheight;
            internal int turn;
            internal int action;
            internal string furni;
            internal int tradeable;

            public Item(int id, int owner, int room, string tile, int stacknr, int stackheight, int turn, int action, string furni, int tradeable)
            {
                this.id = id;
                this.owner = owner;
                this.room = room;
                this.tile = tile;
                this.stacknr = stacknr;
                this.stackheight = stackheight;
                this.turn = turn;
                this.action = action;
                this.furni = furni;
                this.tradeable = tradeable;
            }
        }

        public Item getItem(int id)
        {
            foreach (Item itm in furniture.Values)
            {
                if (itm.id == id)
                {
                    return itm;
                }
            }
            return new Item();
        }

        public squareState[,] avatarStateMap(int targetX, int targetY)
        {
            squareState[,] stateMap = (squareState[,])_sqState.Clone();
            try
            {
                if (_sqState[targetX, targetY] == squareState.Seat)
                    stateMap[targetX, targetY] = squareState.Open;
                if (_sqUnit[targetX, targetY])
                    stateMap[targetX, targetY] = squareState.Blocked;
            }
            catch { }
            for (int y = 0; y < lang; y++)
            {
                for (int x = 0; x < breed; x++)
                {
                    if (stateMap[x, y] == squareState.Door)
                    {
                        stateMap[x, y] = squareState.Open;
                    }
                }
            }
            return stateMap;
        }

        public byte[,] GenerateGrid(int targetX, int targetY)
        {
            // Store the actual room cols.
            int ActualCols = lang;
            int ActualRows = breed;
            // Store the updated cols.
            int GeneratedCols = lang;
            int GeneratedRows = breed;

            // Make sure the room size is a power of 2.
            while (Math.Log(GeneratedCols, 2) != (int)Math.Log(GeneratedCols, 2))
            {
                GeneratedCols++;
            }
            while (Math.Log(GeneratedRows, 2) != (int)Math.Log(GeneratedRows, 2))
            {
                GeneratedRows++;
            }

            // Make sure the room is square.
            if (GeneratedCols > GeneratedRows)
            {
                GeneratedRows = GeneratedCols;
            }
            else if (GeneratedRows > GeneratedCols)
            {
                GeneratedCols = GeneratedRows;
            }

            // Create our buffer grid.
            byte[,] GeneratedGrid = new byte[GeneratedRows, GeneratedCols];

            // Create statemap
            squareState[,]  stateMap = avatarStateMap(targetX, targetY);

            // Create the grid.
            for (int y = 0; y < ActualCols; y++)
            {
                for (int x = 0; x < ActualRows; x++)
                {
                    // Find if the tile is free.
                    if (stateMap[x, y] == squareState.Open && (!_sqUnit[x,y]))
                    {
                        // The tile is free.
                        GeneratedGrid[x, y] = 1;
                    }
                    else
                    {
                        // The tile is not free.
                        GeneratedGrid[x, y] = 0;
                    }
                }
            }

            // Return the generated grid.
            return GeneratedGrid;
        }

        public bool checkWalk(int startX, int startY, int targetX, int targetY)
        {
            if (startX == door_x && startY == door_y)
            {
                return true;
            }
            else
            {
                if ((!(targetX == door_x && targetY == door_y)) && targetX >= 0 && targetY >= 0 && targetX < breed && targetY < lang)
                {
                    PathFinderFast Pathfinder = new PathFinderFast(GenerateGrid(targetX, targetY));
                    List<PathFinderNode> Path = Pathfinder.FindPath(new Point(startX, startY), new Point(targetX, targetY));
                    if (Path == null || Path.Count == 0)
                    {
                        return false;
                    }
                    else
                    {
                        return true;
                    }
                }
                else
                {
                    return false;
                }
            }
        }
    }
}
