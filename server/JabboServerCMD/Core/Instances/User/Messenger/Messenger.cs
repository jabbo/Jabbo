using System;
using System.Text;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Collections;
using System.Collections.Generic;
using System.Text.RegularExpressions;

using JabboServerCMD.Core;
using JabboServerCMD.Core.Sockets;
using JabboServerCMD.Core.Managers;
using JabboServerCMD.Core.Sockets.Packets.Game;
using JabboServerCMD.Core.Systems;
using JabboServerCMD.Core.Instances.Room;

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Utilities;
namespace JabboServerCMD.Core.Instances.User.Messenger
{
    public class Messenger
    {
        private int userID;
        private Hashtable Buddies;

        internal Messenger(int userID)
        {
            this.userID = userID;
            this.Buddies = new Hashtable();
        }

        internal string messagesInit()
        {
            string toReturn = "";
            List<List<string>> fieldValues = MySQL.readArray("SELECT messageid, friendid, message, sent_on FROM messenger_messages WHERE `userid`='" + User._UserID + "' AND `read`='0' ORDER BY messageid ASC");
            for (int i = 0; i < fieldValues.Count; i++)
            {
                var thisField = fieldValues[i].ToArray();
                toReturn += message(int.Parse(thisField[0]), int.Parse(thisField[1]), thisField[2], thisField[3]);
            }
            return toReturn;
        }
        internal FriendListArrayPacket[] friendListInit()
        {
            int[] userIDs = UserManager.getUserFriendIDs(userID);
            FriendListArrayPacket[] Buddylist = new FriendListArrayPacket[userIDs.Length];
            Buddy Me = new Buddy(userID, User._Username, User._MessengerMission, "");
            for (int i = 0; i < userIDs.Length; i++)
            {
                string[] buddyInfo = MySQL.runReadRow("SELECT username, messenger, last_online FROM members WHERE id = '" + userIDs[i] + "'");
                Buddy Buddy = new Buddy(userIDs[i], buddyInfo[0], buddyInfo[1], buddyInfo[2]);
                try
                {
                    if (UserManager.containsUser(Buddy.userID))
                        UserManager.getUser(userIDs[i]).Messenger.addBuddy(Me);
                    Buddies.Add(userIDs[i], Buddy);
                }
                catch { }
                Buddylist[i] = Buddy.BuddyPacket();
            }
            return Buddylist;
        }
        internal MessengerRequestArrayPacket[] friendRequests()
        {
            List<List<string>> fieldValues = MySQL.readArray("SELECT userid_from, requestid FROM messenger_friendrequests WHERE userid_to = '" + this.userID + "' ORDER by requestid ASC");
            MessengerRequestArrayPacket[] Requests = new MessengerRequestArrayPacket[fieldValues.Count];
            for (int i = 0; i < fieldValues.Count; i++)
            {
                var thisField = fieldValues[i].ToArray();
                MessengerRequestArrayPacket request = new MessengerRequestArrayPacket();
                request.I = int.Parse(thisField[1]);
                request.N = MySQL.runRead("SELECT username FROM members WHERE id = '" + thisField[0] + "'");
                Requests[i] = request;
            }
            return Requests;
        }

        internal void incomingMessage(int messageID)
        {
            string[] messageData = MySQL.runReadRow("SELECT friendid, message, sent_on FROM messenger_messages WHERE messageid='" + messageID + "'");
            User.sendData(message(messageID, int.Parse(messageData[0]), messageData[1], messageData[2]));
        }
        internal string message(int messageID, int buddyID, string message, string date)
        {
            string[] senderData = MySQL.runReadRow("SELECT username, figure FROM members WHERE id='" + buddyID + "'");
            MessengerMessagePacket messagePacket = new MessengerMessagePacket();
            messagePacket.I = messageID;
            messagePacket.FI = buddyID;
            messagePacket.FN = senderData[0];
            messagePacket.C = senderData[1];
            messagePacket.M = message;
            messagePacket.D = date;
            return "031"+JsonConvert.SerializeObject(messagePacket)+"#";
        }

        internal void addBuddy(Buddy Buddy)
        {
            if (Buddies.ContainsKey(Buddy.userID) == false)
                Buddies.Add(Buddy.userID, Buddy);
            User.sendData("029" + getUpdates() + "#");
        }
        /// <summary>
        /// Deletes a buddy from the friendlist and virtual messenger of this user, but leaves the database row untouched.
        /// </summary>
        /// <param name="ID">The database ID of the buddy to delete from the friendlist.</param>
        internal void removeBuddy(int ID)
        {
            if (Buddies.Contains(ID))
                Buddies.Remove(ID);
            User.sendData("029" + getUpdates() + "#");
        }
        internal string getUpdates()
        {
            FriendListPacket FriendList = new FriendListPacket();
            FriendListArrayPacket[] Buddylist = new FriendListArrayPacket[Buddies.Count];
            int count = 0;
            foreach (Buddy Buddy in Buddies.Values)
            {
                Buddylist[count++] = Buddy.BuddyPacket();
            }
            FriendList.F = Buddylist;
            return JsonConvert.SerializeObject(FriendList);
        }

        public void goOffline()
        {
            foreach (Buddy Buddy in Buddies.Values)
            {
                if(UserManager.containsUser(Buddy.userID))
                {
                    ConnectedUser thisBuddy = UserManager.getUser(Buddy.userID);
                    thisBuddy.sendData("029" + thisBuddy.Messenger.getUpdates() + "#");
                }
            }
        }

        public void changeMission(string newMission)
        {
            foreach (Buddy Buddy in Buddies.Values)
            {
                if(UserManager.containsUser(Buddy.userID))
                {
                    ConnectedUser thisBuddy = UserManager.getUser(Buddy.userID);
                    ((Buddy)thisBuddy.Messenger.Buddies[User._UserID]).mission = newMission;
                    thisBuddy.sendData("029" + thisBuddy.Messenger.getUpdates() + "#");
                }
            }
        }

        /// <summary>
        /// Returns a boolean that indicates if the messenger contains a certain buddy, and this buddy is online.
        /// </summary>
        /// <param name="userID">The database ID of the buddy to check.</param>
        internal bool containsOnlineBuddy(int userID)
        {
            if (Buddies.ContainsKey(userID) == false)
                return false;
            else
                return UserManager.containsUser(userID);
        }
        /// <summary>
        /// Returns a bool that indicates if there is a friendship between the parent virtual user and a certain user.
        /// </summary>
        /// <param name="userID">The database ID of the user to check.</param>
        internal bool hasFriendship(int userID)
        {
            return Buddies.ContainsKey(userID);
        }
        /// <summary>
        /// Returns a bool that indicates if there are friend requests hinth and forth between the the parent virtual user and a certain user.
        /// </summary>
        /// <param name="userID">The database ID of the user to check.</param>
        internal bool hasFriendRequests(int userID)
        {
            if (int.Parse(MySQL.runRead("SELECT count(requestid) FROM messenger_friendrequests WHERE (userid_to = '" + this.userID + "' AND userid_from = '" + userID + "') OR (userid_to = '" + userID + "' AND userid_from = '" + this.userID + "')")) > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        #region Object management
        /// <summary>
        /// Returns the parent user instance of this virtual messenger.
        /// </summary>
        internal ConnectedUser User
        {
            get
            {
                return UserManager.getUser(this.userID);
            }
        }
        #endregion
    }
}
