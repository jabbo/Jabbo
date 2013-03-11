using System;
using System.Text;
using System.Threading;
using System.Collections;

using JabboServerCMD.Core;
using JabboServerCMD.Core.Sockets;
using JabboServerCMD.Core.Managers;
using JabboServerCMD.Core.Sockets.Packets.Game;
using JabboServerCMD.Core.Systems;
using JabboServerCMD.Core.Instances.Room;
using JabboServerCMD.Core.Instances.User;

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Utilities;

namespace JabboServerCMD.Core.Managers
{
    public static class UserManager
    {
        private static Thread pingChecker;
        private static Thread creditsuitdeler;
        public static Hashtable _Users = new Hashtable();
        private static int _peakUserCount;
        private static int _minutesPlayed;
        private static bool _checkedDay;
        private static string _Day;
        
        public static void Init()
        {
            try { pingChecker.Abort(); }
            catch { }
            pingChecker = new Thread(new ThreadStart(checkPings));
            pingChecker.Priority = ThreadPriority.BelowNormal;
            pingChecker.Start();
            creditsuitdeler = new Thread(new ThreadStart(minuteCredits));
            creditsuitdeler.Priority = ThreadPriority.BelowNormal;
            creditsuitdeler.Start();
        }

        public static int[] getUserFriendIDs(int userID)
        {
            try
            {
                ArrayList idBuilder = new ArrayList();
                int[] friendIDs = MySQL.runReadColumn("SELECT friendid FROM messenger_friendships WHERE userid = '" + userID + "'", 0, null);
                for (int i = 0; i < friendIDs.Length; i++)
                    idBuilder.Add(friendIDs[i]);
                friendIDs = MySQL.runReadColumn("SELECT userid FROM messenger_friendships WHERE friendid = '" + userID + "'", 0, null);
                for (int i = 0; i < friendIDs.Length; i++)
                    idBuilder.Add(friendIDs[i]);

                return (int[])idBuilder.ToArray(typeof(int));
            }
            catch
            {
                return new int[0];
            }
        }

        public static void addUser(int userID, ConnectedUser User)
        {
            if (_Users.ContainsKey(userID))
            {
                ConnectedUser oldUser = ((ConnectedUser)_Users[userID]);
                oldUser.Disconnect();
                if (_Users.ContainsKey(userID))
                    _Users.Remove(userID);
            }

            _Users.Add(userID, User);

            Config.Debug.WriteLine("[" + User.connectionID + "]" + " User [" + User._UserID + "] connected.");

            if (_Users.Count > _peakUserCount)
                _peakUserCount = _Users.Count;

            MySQL.runQuery("UPDATE store_values SET value = '" + _Users.Count + "' WHERE name = 'jabbos_online'");
        }

        public static void removeUser(int userID)
        {
            if (_Users.ContainsKey(userID))
            {
                ConnectedUser data = ((ConnectedUser)_Users[userID]);
                if (data._Room != null)
                {
                    data._Room.removeUser(data);
                }
                _Users.Remove(userID);
                if (data.Messenger != null)
                {
                    data.Messenger.goOffline();
                }
                Config.Debug.WriteLine("[" + data.connectionID + "]" + " User [" + userID + "] disconnected.");
            }

            MySQL.runQuery("UPDATE store_values SET value = '" + _Users.Count + "' WHERE name = 'jabbos_online'");
        }

        public static bool containsUser(int userID)
        {
            return _Users.ContainsKey(userID);
        }

        public static bool containsUser(string userName)
        {
            int userID = getUserID(userName);
            return _Users.ContainsKey(userID);
        }

        public static int userCount
        {
            get
            {
                return _Users.Count;
            }
        }

        public static int peakUserCount
        {
            get
            {
                return _peakUserCount;
            }
        }

        public static int getUserID(string userName)
        {
            return MySQL.runRead("SELECT id FROM members WHERE username = '" + userName + "'", null);
        }

        public static string getUserName(int userID)
        {
            return MySQL.runRead("SELECT username FROM members WHERE id = '" + userID + "'");
        }

        public static bool userExists(int userID)
        {
            return MySQL.checkExists("SELECT id FROM members WHERE id = '" + userID + "'");
        }

        public static ConnectedUser getUser(int userID)
        {
            try { return (ConnectedUser)_Users[userID]; }
            catch { return null; }
        }

        public static ConnectedUser getUser(string userName)
        {
            int userID = getUserID(userName);
            return getUser(userID);
        }
 
        public static void sendData(string Data)
        {
            foreach (ConnectedUser User in _Users.Values)
                User.sendData(Data);
        }

        public static void sendToRank(byte Rank, string Data)
        {
            foreach (ConnectedUser User in _Users.Values)
            {
                if (User._Rank != Rank)
                    continue;
                else
                    User.sendData(Data);
            }
        }

        public static void sendToUser(string UserN, string Data)
        {
            foreach (ConnectedUser User in _Users.Values)
            {
                if (User._Username != UserN)
                    continue;
                else
                    User.sendData(Data);
            }
        }

        public static void sendToUser(int UserID, string Data)
        {
            foreach (ConnectedUser User in _Users.Values)
            {
                if (User._UserID != UserID)
                    continue;
                else
                    User.sendData(Data);
            }
        }

        private static void checkPings()
        {
            while (true)
            {
                foreach (ConnectedUser User in ((Hashtable)_Users.Clone()).Values)
                {
                    if (User.pingOK)
                    {
                        User.pingOK = false;
                        User.sendData("005#"); // ping request
                    }
                    else
                    {
                        User.Disconnect();
                    }
                }
                Thread.Sleep(60000);
            }
        }
        private static void minuteCredits()
        {
            while (true)
            {
                foreach (ConnectedUser User in ((Hashtable)_Users.Clone()).Values)
                {
                    try
                    {
                        if (User.active)
                        {
                            _minutesPlayed++;
                            User._Money = int.Parse(MySQL.runRead("SELECT money FROM members WHERE id = '" + User._UserID + "'"));
                            if (User._clubMember)
                            {
                                User._Money = User._Money + 2;
                                User._SessionEarned = User._SessionEarned + 2;
                            }
                            else
                            {
                                User._Money++;
                                User._SessionEarned++;
                            }
                            MySQL.runQuery("UPDATE members SET money = '" + User._Money + "', minutes = '" + ++User._Minutes + "', last_online = NOW() WHERE id = '" + User._UserID + "'");

                            UpdateMoneyPacket UpdateMoney = new UpdateMoneyPacket();
                            UpdateMoney.M = User._Money;
                            UpdateMoney.S = User._SessionEarned;
                            string UpdateMoneyString = JsonConvert.SerializeObject(UpdateMoney);

                            User.sendData("033" + UpdateMoneyString + "#");
                        }
                    }
                    catch { }
                }
                if (_minutesPlayed > 0)
                {
                    string day = String.Format("{0:yyyy-MM-dd}", DateTime.Now);
                    if (_checkedDay) {
                        if (_Day == day) {
                            MySQL.runQuery("UPDATE graph SET minutes = minutes+" + _minutesPlayed + " WHERE day = '" + day + "'");
                        }
                        else {
                            int check = int.Parse(MySQL.runRead("SELECT count(minutes) FROM graph WHERE day='" + day + "'"));
                            if (check == 0)
                            {
                                MySQL.runQuery("INSERT INTO graph SET day = '" + day + "', minutes = '" + _minutesPlayed + "'");
                            }
                            else {
                                MySQL.runQuery("UPDATE graph SET minutes = minutes+" + _minutesPlayed + " WHERE day = '" + day + "'");
                            }
                            _Day = day;
                        }
                    }
                    else {
                        int check = int.Parse(MySQL.runRead("SELECT count(minutes) FROM graph WHERE day='" + day + "'"));
                        if (check == 0)
                        {
                            MySQL.runQuery("INSERT INTO graph SET day = '" + day + "', minutes = '" + _minutesPlayed + "'");
                        }
                        else
                        {
                            MySQL.runQuery("UPDATE graph SET minutes = minutes+" + _minutesPlayed + " WHERE day = '" + day + "'");
                        }
                        _Day = day;
                        _checkedDay = true;
                    }
                    _minutesPlayed = 0;
                }
                Thread.Sleep(60000); // elke minuut
             }
        }
    }
}
