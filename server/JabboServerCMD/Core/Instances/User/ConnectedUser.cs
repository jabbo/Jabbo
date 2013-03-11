using System;
using System.Text;
using System.Net;
using System.Threading;
using System.Collections.Generic;
using System.Text.RegularExpressions;

using System.Collections.Concurrent;
using System.Linq;
using Alchemy;
using Alchemy.Classes;

using JabboServerCMD.Core.Instances.User;
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

namespace JabboServerCMD.Core.Instances.User
{
    public class ConnectedUser
    {
        private delegate void timedDisconnector(int ms);
        public int connectionID;
        public UserContext context;

        private byte[] dataBuffer = new byte[1024];
        private bool _isDisconnected;
        private bool _isLoggedIn = false;
        internal bool active = true;
        internal bool pingOK;
        private int logintry;

        internal int _UserID;
        internal string _Username;
        internal byte _Rank;
        internal Room.Room _Room;
        internal int _Money;
        internal int _SessionEarned;
        internal int _Minutes;
        internal int _Logins;

        internal int _Room_X_Target = 0;
        internal int _Room_Y_Target = 0;
        internal int _Room_X = 0;
        internal int _Room_Y = 0;
        internal int _Room_Z = 0;
        internal int _Room_Dir = 0;
        internal string _Room_Sit = "";

        internal bool _Room_Voted = false;
        internal bool _HasRights = false;
        internal int _Brb = 0;

        internal string _Figure;
        internal string _Mission;
        internal string _MessengerMission;
        internal string _Badge;
        internal string _Drink = "";
        internal string[] _Badges;
        
        internal bool _clubMember;

        internal int lastmessage;

        internal Messenger.Messenger Messenger;

        public ConnectedUser(int connectionID, UserContext context)
        {
            this.connectionID = connectionID;
            this.context = context;

            try
            {
                pingOK = true;
                sendData("001#"); // connection accepted
            }
            catch { }
        }

        internal void Disconnect()
        {
            if (_isDisconnected)
            {
                GC.Collect();
                return;
            }
            else
            {
                trySendData("002#"); // Disconnect packet

                try { context.Disconnect(); }
                catch { }
                
                UserManager.removeUser(_UserID);
                _isDisconnected = true;
            }
        }

        internal void Disconnect(int ms)
        {
            new timedDisconnector(delDisconnectTimed).BeginInvoke(ms, null, null);
        }
        private void delDisconnectTimed(int ms)
        {
            Thread.Sleep(ms);
            Disconnect();
        }

        internal string connectionRemoteIP
        {
            get
            {
                return context.ClientAddress.ToString().Split(':')[0];
            }
        }

        public void dataArrival(string connectionData)
        {
            string[] connectionDataPart = connectionData.Split('#');
            if (connectionData.IndexOf("#") != -1)
            {
                for (int i = 0; i < connectionDataPart.Length - 1; i++)
                {
                    processPacket(connectionDataPart[i]);
                }
            }
        }

        internal void sendData(string Data)
        {
            Config.Debug.WriteLine("[" + connectionID + "] SENT " + Data);
            try
            {
                context.Send(Data);
            }
            catch
            {
                Disconnect();
            }
        }

        internal void trySendData(string Data)
        {
            Config.Debug.WriteLine("[" + connectionID + "] SENT " + Data);
            try
            {
                context.Send(Data);
            }
            catch
            {

            }
        }

        public string notify(string message, string title)
        {
            MessagePacket packet = new MessagePacket();
            packet.M = message;
            packet.T = title;
            string packetString = JsonConvert.SerializeObject(packet);
            return "013" + packetString + "#";
        }

        public FurniturePacket[] getInventoryData()
        {
            List<List<string>> fieldValues = MySQL.readArray("SELECT id, tile, stacknr, stackheight, turn, action, furni FROM items WHERE owner='" + _UserID + "' AND tile='inv'");
            FurniturePacket[] Items = new FurniturePacket[fieldValues.Count]; 
            for (int i = 0; i < fieldValues.Count; i++)
            {
                var thisField = fieldValues[i].ToArray();
                FurniturePacket getf = new FurniturePacket();
                getf.I = int.Parse(thisField[0]);
                getf.T = thisField[1];
                getf.S = int.Parse(thisField[2]);
                getf.SH = int.Parse(thisField[3]);
                getf.H = int.Parse(thisField[4]);
                getf.A = int.Parse(thisField[5]);
                getf.F = thisField[6];
                Items[i] = getf;
            }
            return Items;
        }

        internal string refreshClub()
        {
            string returnString = "";
            string[] subscrDetails = MySQL.runReadRow("SELECT jc_monthsgone, jc_daysleft, jc_monthsleft, jc_lastcheck FROM members WHERE id = '" + _UserID + "'");
            int jc_monthsgone = int.Parse(subscrDetails[0]);
            int jc_daysleft = int.Parse(subscrDetails[1]);
            int jc_monthsleft = int.Parse(subscrDetails[2]);
            
            /*if (subscrDetails[3] != "") {
                DateTime jc_lastcheck = DateTime.ParseExact(subscrDetails[3], "dd/MM/yyyy HH:mm:ss", null);
                if (jc_lastcheck < DateTime.Now.AddDays(-1))
                {
                    TimeSpan span = DateTime.Now.Subtract(jc_lastcheck);
                    for (int i = 1; i <= span.Days; i++)
                    {
                        jc_daysleft--;
                        if (jc_daysleft <= 0)
                        {
                            jc_daysleft = 0;
                            jc_monthsgone++;
                            if (jc_monthsleft > 0)
                            {
                                jc_monthsleft--;
                                jc_daysleft = 31;
                            }
                        }
                    }
                    if (jc_daysleft > 0)
                    {
                        _clubMember = true;
                    }
                    else
                    {
                        _clubMember = false;
                    }

                    DateTime MyDateTime = new DateTime.Now();
                    String MyString;
                    MyString = MyDateTime.ToString("yyyy-MM-dd HH:mm tt");

                    jc_lastcheck = DateTime.Now;


                    MySQL.runQuery("UPDATE members SET jc_monthsgone='" + jc_monthsgone + ", jc_daysleft='" + jc_daysleft + ", jc_monthsleft='" + jc_monthsleft + ", jc_lastcheck='" + jc_lastcheck + " WHERE id='" + _UserID + "'");
                }
            }
            int totalDays = jc_daysleft + jc_monthsleft * 31;

            ClubStatusPacket clubStatus = new ClubStatusPacket();
            clubStatus.S = _clubMember;
            clubStatus.D = jc_daysleft;
            clubStatus.PM = jc_monthsgone;
            clubStatus.RM = jc_monthsleft;
            returnString += "072" + JsonConvert.SerializeObject(clubStatus) + "#";

            if (totalDays > 0 && totalDays < 7)
            {
                returnString += notify(TextsManager.get("club_expires_soon"), "Jabbo Club");
            }
            */
            return returnString;
        }

        private void processPacket(string currentPacket)
        {
            Config.Debug.WriteLine("[" + connectionID + "] RECV " + currentPacket);

            int packetHeader = int.Parse(currentPacket.Substring(0, 3));
            string packetBody = currentPacket.Substring(3);

            if (_isLoggedIn == false)
            {
                switch (packetHeader)
                {
                    case 2:
                        // client: connection is about to be closed
                        Disconnect();
                        break;

                    case 5:
                        // ping request
                        sendData("006#");
                        break;

                    case 6:
                        // ping answer
                        pingOK = true;
                        break;
                    #region Login
                    case 17:
                        LogInPacket LoginRequest = (LogInPacket)JsonConvert.DeserializeObject(packetBody, typeof(LogInPacket));

                        LoginRequest.U = MySQL.Stripslash(LoginRequest.U);
                        LoginRequest.P = MySQL.Stripslash(LoginRequest.P);

                        if (logintry < 3)
                        {
                            int myID = MySQL.runRead("SELECT id FROM members WHERE username = '" + LoginRequest.U + "' AND password = '" + LoginRequest.P + "'", null);
                            if (myID == 0)
                            {
                                LoginFailurePacket LoginMessage = new LoginFailurePacket();

                                LoginMessage.R = "wrong";

                                string LoginMessageString = JsonConvert.SerializeObject(LoginMessage);
                                sendData("019" + LoginMessageString + "#");

                                logintry++;
                                return;
                            }
                            else if (MySQL.runRead("SELECT ban FROM members WHERE username = '" + LoginRequest.U + "' AND password = '" + LoginRequest.P + "'") == "yes")
                            {
                                LoginFailurePacket LoginMessage = new LoginFailurePacket();
                                
                                LoginMessage.R = "ban";

                                string LoginMessageString = JsonConvert.SerializeObject(LoginMessage);
                                sendData("019" + LoginMessageString + "#");

                                logintry++;
                                return;
                            }
                            /*
                            else if (MySQL.runRead("SELECT activated FROM members WHERE username = '" + LoginRequest.U + "' AND password = '" + LoginRequest.P + "'") == "nee")
                            {
                                LF LoginMessage = new LF();

                                LoginMessage.R = "mail";

                                string LoginMessageString = JsonConvert.SerializeObject(LoginMessage);
                                sendData("019" + LoginMessageString + "#");

                                logintry++;
                                return;
                            }
                            */
                            else if (SocketServer.acceptedConnections > Config.maxconn - 10)
                            {
                                LoginFailurePacket LoginMessage = new LoginFailurePacket();

                                LoginMessage.R = "full";

                                string LoginMessageString = JsonConvert.SerializeObject(LoginMessage);
                                sendData("019" + LoginMessageString + "#");

                                Disconnect(2000);
                                
                                return;
                            }
                            else if (myID != 0)
                            {
                                string[] userData = MySQL.runReadRow("SELECT username, rank, money, logins, minutes, mission, figure, badge, messenger FROM members WHERE id = '" + myID + "'");
                                _UserID = myID;
                                _Username = userData[0];
                                _Rank = byte.Parse(userData[1]);
                                _Money = int.Parse(userData[2]);
                                _Logins = int.Parse(userData[3]);
                                _Minutes = int.Parse(userData[4]);

                                _Mission = userData[5];
                                _Figure = userData[6];
                                _Badge = userData[7];
                                _MessengerMission = userData[8];
                                _Badges = MySQL.runReadRow("SELECT badge FROM badges WHERE owner = '" + _UserID + "'");

                                UserManager.addUser(_UserID, this);
                                _isLoggedIn = true;

                                UserDataPacket UserData = new UserDataPacket();
                                UserData.I = _UserID;
                                UserData.R = RankManager.Rights(_Rank);
                                UserData.MY = _Money;
                                UserData.CB = _Badge;
                                UserData.B = _Badges;
                                UserData.MM = _MessengerMission;
                                UserData.C = _Figure;
                                UserData.M = _Mission;
                                UserData.UN = _Username;
                                UserData.ID = getInventoryData();
                                
                                Messenger = new Messenger.Messenger(_UserID);
                                
                                string UserDataString = JsonConvert.SerializeObject(UserData);
                                sendData("020" + UserDataString + "#" + "018#");

                                MySQL.runQuery("UPDATE members SET logins = '" + ++_Logins + "' WHERE id = '" + _UserID + "'");
                                return;
                            }
                            else
                            {
                                LoginFailurePacket LoginMessage = new LoginFailurePacket();
                                LoginMessage.R = "error";
                                string LoginMessageString = JsonConvert.SerializeObject(LoginMessage);
                                sendData("019" + LoginMessageString + "#");
                            }
                        }
                        else
                        {
                            LoginFailurePacket LoginMessage = new LoginFailurePacket();
                            LoginMessage.R = "try";
                            string LoginMessageString = JsonConvert.SerializeObject(LoginMessage);
                            sendData("019" + LoginMessageString + "#");
                            return;
                        }
                        break;
                    #endregion

                    #region Registering
                    case 15:
                        RegisterCheckAnswerPacket RegisterCheckAnswer = new RegisterCheckAnswerPacket();
                        RegisterCheckAnswer.A = "closed";
                        string RegisterCheckAnswerString = JsonConvert.SerializeObject(RegisterCheckAnswer);
                        sendData("016" + RegisterCheckAnswerString + "#");
                        break;
                    #endregion

                    default:
                        sendData("003#");
                        Disconnect(2000);
                        break;
                }
            }
            else
            {
                switch (packetHeader)
                {
                    case 2:
                        // client: connection is about to be closed
                        Disconnect();
                        break;

                    case 5:
                        // ping request
                        sendData("006#");
                        break;

                    case 6:
                        // ping ok
                        pingOK = true;
                        break;

                    case 9:
                        // user is inactive
                        active = false;
                        if (_Room != null)
                        {
                            _Room.updateBrb(1, this);
                        }
                        break;
                    case 10:
                        // user is active again
                        active = true;
                        if (_Room != null)
                        {
                            _Room.updateBrb(0, this);
                        }
                        break;

                    #region Mod tools
                    case 11:
                        // request server RAM
                        if (RankManager.containsRight(_Rank, "server_ram"))
                        {
                            long memUsage = GC.GetTotalMemory(false) / 1024;
                            ServerRAMPacket ServerRam = new ServerRAMPacket();
                            ServerRam.R = (int)memUsage;
                            string ServerRamString = JsonConvert.SerializeObject(ServerRam);
                            sendData("012" + ServerRamString + "#");
                        }
                        break;

                    case 14:
                        // global alert
                        GlobalAlertPacket GlobalAlertdata = (GlobalAlertPacket)JsonConvert.DeserializeObject(packetBody, typeof(GlobalAlertPacket));
                        if (RankManager.containsRight(_Rank, "global_alert"))
                        {
                            MessagePacket GlobalAlert = new MessagePacket();
                            GlobalAlert.M = GlobalAlertdata.M;
                            GlobalAlert.T = "";
                            string GlobalAlertString = JsonConvert.SerializeObject(GlobalAlert);

                            UserManager.sendData("013" + GlobalAlertString + "#");
                        }
                        else
                        {
                            sendData("003#");
                            Disconnect(2000);
                        }
                        break;
                    case 62:
                        // open the chatbox
                        if (RankManager.containsRight(_Rank, "open_chatbox_forall"))
                        {
                            UserManager.sendData("063#");
                        }
                        else
                        {
                            sendData("003#");
                            Disconnect(2000);
                        }
                        break;
                    #endregion;

                    #region Logged in
                    case 21:
                        FriendListPacket FriendList = new FriendListPacket();
                        FriendList.F = Messenger.friendListInit();
                        string FriendListString = JsonConvert.SerializeObject(FriendList);

                        MessengerRequestPacket MessengerRequests = new MessengerRequestPacket();
                        MessengerRequests.R = Messenger.friendRequests();
                        string MessengerRequestsString = JsonConvert.SerializeObject(MessengerRequests);

                        sendData(refreshClub()+Messenger.messagesInit()+"029" + FriendListString + "#027" + MessengerRequestsString + "#040" + NavigatorManager.dataPacket(this) + "#");
                        break;
                    #endregion

                    #region Messenger

                    case 23: // Messenger - search
                        MessengerSearchPacket searchPacket = (MessengerSearchPacket)JsonConvert.DeserializeObject(packetBody, typeof(MessengerSearchPacket));
                        string[] userData = MySQL.runReadRow("SELECT id, messenger, figure, last_online FROM members WHERE username = '" + MySQL.Stripslash(searchPacket.N) + "'");
                        if (userData.Length == 0)
                        {
                            MessengerSearchedPacket MessengerPacket = new MessengerSearchedPacket();
                            MessengerPacket.I = 0;
                            MessengerPacket.M = "";
                            MessengerPacket.C = "";
                            MessengerPacket.L = "";
                            MessengerPacket.O = false;
                            MessengerPacket.A = false;
                            string MessengerPacketString = JsonConvert.SerializeObject(MessengerPacket);
                            sendData("024" + MessengerPacketString + "#");
                        }
                        else
                        {
                            int searchId = int.Parse(userData[0]);
                            bool addable = false;
                            if (searchId != _UserID)
                            {
                                if ((!Messenger.hasFriendship(searchId)) && (!Messenger.hasFriendRequests(searchId)))
                                {
                                    addable = true;
                                }
                            }
                            MessengerSearchedPacket MessengerPacket = new MessengerSearchedPacket();
                            MessengerPacket.I = searchId;
                            MessengerPacket.M = userData[1];
                            MessengerPacket.C = userData[2];
                            MessengerPacket.L = userData[3];
                            MessengerPacket.O = UserManager.containsUser(searchId);
                            MessengerPacket.A = addable;
                            string MessengerPacketString = JsonConvert.SerializeObject(MessengerPacket);
                            sendData("024" + MessengerPacketString + "#");
                        }
                        break;
                    case 25: // Messenger - request user as a friend
                        MessengerAddBuddyPacket addBuddyPacket = (MessengerAddBuddyPacket)JsonConvert.DeserializeObject(packetBody, typeof(MessengerAddBuddyPacket));
                        if (addBuddyPacket.I > 0 && Messenger.hasFriendRequests(addBuddyPacket.I) == false && Messenger.hasFriendship(addBuddyPacket.I) == false)
                        {
                            int requestID = MySQL.runRead("SELECT MAX(requestid) FROM messenger_friendrequests WHERE userid_to = '" + addBuddyPacket.I + "'", null) + 1;

                            MySQL.runQuery("INSERT INTO messenger_friendrequests(userid_to,userid_from,requestid) VALUES ('" + addBuddyPacket.I + "','" + _UserID + "','" + requestID + "')");

                            MessengerRequestArrayPacket[] request = new MessengerRequestArrayPacket[1];
                            MessengerRequestArrayPacket newRequest = new MessengerRequestArrayPacket();
                            newRequest.I = requestID;
                            newRequest.N = _Username;
                            request[0] = newRequest;
                            MessengerRequestPacket NewMessengerRequest = new MessengerRequestPacket();
                            NewMessengerRequest.R = request;
                            string NewMessengerRequestString = JsonConvert.SerializeObject(NewMessengerRequest);
                            UserManager.sendToUser(addBuddyPacket.I, "027" + NewMessengerRequestString + "#");
                        }
                        break;
                    case 22: // Messenger - change mission
                        MessengerMissionPacket missionPacket = (MessengerMissionPacket)JsonConvert.DeserializeObject(packetBody, typeof(MessengerMissionPacket));
                        string newMission = Regex.Replace(missionPacket.M, "<(.|\n)*?>", ""); // html check, removes tags
                        if (missionPacket.M.Length < 22)
                        {
                            MySQL.runQuery("UPDATE members SET messenger = '" + MySQL.Stripslash(newMission) + "' WHERE id = '" + _UserID + "'");
                        }
                        Messenger.changeMission(newMission); // let the others know!
                        break;
                    case 28: // Messenger - accept/decline friendrequest
                        MessengerRequestAnswer requestAnswer = (MessengerRequestAnswer)JsonConvert.DeserializeObject(packetBody, typeof(MessengerRequestAnswer));
                        if (requestAnswer.A)
                        {
                            // friendship accepted
                            Buddy Me = new Buddy(_UserID, _Username, _MessengerMission, "");
                            int fromUserID = MySQL.runRead("SELECT userid_from FROM messenger_friendrequests WHERE userid_to = '" + this._UserID + "' AND requestid = '" + requestAnswer.I + "'", null);
                            if (fromUserID == 0) // Corrupt data
                                return;
                            string[] buddyInfo = MySQL.runReadRow("SELECT username, messenger, last_online FROM members WHERE id = '" + fromUserID + "'");
                            Buddy Buddy = new Buddy(fromUserID, buddyInfo[0], buddyInfo[1], buddyInfo[2]);
                            Messenger.addBuddy(Buddy);
                            if (UserManager.containsUser(fromUserID))
                            {
                                UserManager.getUser(fromUserID).Messenger.addBuddy(Me);
                            }
                            MySQL.runQuery("INSERT INTO messenger_friendships(userid,friendid) VALUES ('" + fromUserID + "','" + this._UserID + "')");
                            MySQL.runQuery("DELETE FROM messenger_friendrequests WHERE userid_to = '" + this._UserID + "' AND requestid = '" + requestAnswer.I + "' LIMIT 1");
                        }
                        else
                        {
                            // friendship declined
                            MySQL.runQuery("DELETE FROM messenger_friendrequests WHERE userid_to = '" + this._UserID + "' AND requestid = '" + requestAnswer.I + "' LIMIT 1");
                        }
                        break;
                    case 26: // Messenger - remove buddy
                        MessengerRemoveBuddyPacket removeBuddyPacket = (MessengerRemoveBuddyPacket)JsonConvert.DeserializeObject(packetBody, typeof(MessengerRemoveBuddyPacket));
                        Messenger.removeBuddy(removeBuddyPacket.I);
                        if (UserManager.containsUser(removeBuddyPacket.I))
                        {
                            UserManager.getUser(removeBuddyPacket.I).Messenger.removeBuddy(_UserID);
                        }
                        MySQL.runQuery("DELETE FROM messenger_friendships WHERE (userid = '" + _UserID + "' AND friendid = '" + removeBuddyPacket.I + "') OR (userid = '" + removeBuddyPacket.I + "' AND friendid = '" + _UserID + "') LIMIT 1");
                        break;
                    case 30: // Messenger - send message to buddy
                        MessengerSendMessagePacket sendMessagePacket = (MessengerSendMessagePacket)JsonConvert.DeserializeObject(packetBody, typeof(MessengerSendMessagePacket));
                        if (Messenger.hasFriendship(sendMessagePacket.I))
                        {
                            MySQL.runQuery("INSERT INTO messenger_messages SET userid=" + sendMessagePacket.I + ", friendid='" + _UserID + "', sent_on=NOW(), message='" + MySQL.Stripslash((Regex.Replace(sendMessagePacket.M, "<(.|\n)*?>", "")).Replace("\n", "<br>")) + "';");
                            int messageID = int.Parse(MySQL.runRead("SELECT MAX(messageid) FROM messenger_messages"));
                            if (UserManager.containsUser(sendMessagePacket.I))
                            {
                                UserManager.getUser(sendMessagePacket.I).Messenger.incomingMessage(messageID);
                            }
                        }
                        break;
                    case 32: // Messenger - delete message
                        MessengerDelMessagePacket delMessagePacket = (MessengerDelMessagePacket)JsonConvert.DeserializeObject(packetBody, typeof(MessengerDelMessagePacket));
                        MySQL.runQuery("UPDATE messenger_messages SET `read`='1' WHERE messageid=" + delMessagePacket.I + " AND userid='" + _UserID + "' AND `read`='0' LIMIT 1;");
                        break;
                    #endregion

                    #region Rooms
                    #region Change room
                    case 42:
                        RoomChangePacket ChangeRoomRequest = (RoomChangePacket)JsonConvert.DeserializeObject(packetBody, typeof(RoomChangePacket));

                        if (_Room != null)
                        {
                            _Room.removeUser(this);
                            _Room = null;
                        }

                        if (MySQL.runRead("SELECT id FROM rooms WHERE id = '" + MySQL.Stripslash(ChangeRoomRequest.I.ToString()) + "'", null) == 0)
                        {
                            sendData("043#");
                            return;
                        }
                        else
                        {
                           _Room = RoomManager.joinRoom(this, ChangeRoomRequest.I);
                        }
                        break;
                    #endregion

                    #region Room Leave
                    case 46:
                        _Room.removeUser(this);
                        _Room = null;
                        break;
                        #endregion

                    #region Room chat
                    case 51:
                        if (_Room == null)
                            return;

                        SendMessagePacket ChatMessage = (SendMessagePacket)JsonConvert.DeserializeObject(packetBody, typeof(SendMessagePacket));

                        DateTime epochh = new DateTime(1970, 1, 1, 0, 0, 0, 0).ToLocalTime();
                        TimeSpan spann = (DateTime.Now.ToLocalTime() - epochh);

                        if (((int)spann.TotalSeconds - lastmessage) > 0.5)
                        {
                            if (ChatMessage.M.Substring(0, 1) != ":")
                            {
                                if (ChatMessage.T == "R")
                                {
                                    _Room.userChat(this, Regex.Replace(ChatMessage.M, "<(.|\n)*?>", ""), _Username);
                                }
                                else
                                {
                                    if (UserManager.containsUser(ChatMessage.T))
                                    {
                                        SendMessageReplyPacket ToSendChatMessage = new SendMessageReplyPacket();

                                        ToSendChatMessage.U = _Username;
                                        ToSendChatMessage.M = Regex.Replace(ChatMessage.M, "<(.|\n)*?>", "");

                                        string ToSendChatMessageString = JsonConvert.SerializeObject(ToSendChatMessage);

                                        UserManager.sendToUser(ChatMessage.T, "052" + ToSendChatMessageString + "#");
                                    }
                                }

                                lastmessage = (int)spann.TotalSeconds;
                            }
                            else
                            {
                                string[] args = ChatMessage.M.Substring(1).Split(' ');
                                switch (args[0])
                                {
                                    case "whereami":
                                        string IAmIn;

                                        try { IAmIn = _Room.RoomID.ToString(); }
                                        catch { IAmIn = "Nowhere"; }

                                        MessagePacket IAmInAlertMessage = new MessagePacket();

                                        IAmInAlertMessage.T = "User warning";
                                        IAmInAlertMessage.M = IAmIn;
                                        
                                        string IAmInAlertMessageString = JsonConvert.SerializeObject(IAmInAlertMessage);

                                        UserManager.sendData("013" + IAmInAlertMessageString + "#");

                                        break;

                                    case "roomalert":
                                        if (RankManager.containsRight(_Rank, "room_alert"))
                                        {
                                            if (_Room != null)
                                            {
                                                MessagePacket AlertMessage = new MessagePacket();

                                                AlertMessage.T = "Room watrnint";
                                                AlertMessage.M = ChatMessage.M.Substring(7);
                                                
                                                string AlertMessageString = JsonConvert.SerializeObject(AlertMessage);

                                                _Room.sendData("013" + AlertMessageString + "#");
                                            }
                                        }
                                        break;

                                    case "globalalert":
                                        if (RankManager.containsRight(_Rank, "global_alert"))
                                        {
                                            MessagePacket GlobalAlertMessage = new MessagePacket();

                                            GlobalAlertMessage.T = "";
                                            GlobalAlertMessage.M = ChatMessage.M.Substring(13);
                                            
                                            string GlobalAlertMessageString = JsonConvert.SerializeObject(GlobalAlertMessage);

                                            UserManager.sendData("013" + GlobalAlertMessageString + "#");
                                        }
                                        break;

                                    case "alertuser":
                                        if (RankManager.containsRight(_Rank, "alert_user") && args.Length > 1)
                                        {
                                            if (UserManager.containsUser(args[1]))
                                            {
                                                MessagePacket UserAlertMessage = new MessagePacket();

                                                UserAlertMessage.T = "";
                                                UserAlertMessage.M = ChatMessage.M.Substring(10 + args[1].Length + 1);
                                                
                                                string UserAlertMessageString = JsonConvert.SerializeObject(UserAlertMessage);

                                                UserManager.sendToUser(args[1], "013" + UserAlertMessageString + "#");
                                            }
                                        }
                                        break;

                                    case "ban":
                                        if (RankManager.containsRight(_Rank, "ban_user") && args.Length > 1)
                                        {
                                            if (UserManager.containsUser(args[1]))
                                            {
                                                MySQL.runQuery("UPDATE members SET ban = 'yes' WHERE username = '" + MySQL.Stripslash(args[1]) + "'");
                                                UserManager.getUser(args[1]).Disconnect();
                                            }
                                        }
                                        break;

                                    case "online":
                                        StringBuilder onlineUsers = new StringBuilder();
                                        onlineUsers.Append("Peak online: "+UserManager.peakUserCount+"<br>Bots online: "+RoomManager.countBots()+"<br>Users online: <br><br>");
                                        foreach (ConnectedUser User in UserManager._Users.Values)
                                        {
                                            onlineUsers.Append(User._Username + "<br>");
                                        }
                                        sendData(notify(onlineUsers.ToString(), "Users online"));
                                        break;

                                    case "kick":
                                        if (RankManager.containsRight(_Rank, "kick_user") && args.Length > 1)
                                        {
                                            try
                                            {
                                                MessagePacket KickAlertMessage = new MessagePacket();

                                                KickAlertMessage.T = "kick";
                                                KickAlertMessage.M = "gekicked";

                                                string KickAlertMessageString = JsonConvert.SerializeObject(KickAlertMessage);

                                                UserManager.sendToUser(args[1], "045#" + "013" + KickAlertMessageString + "#");
                                                _Room.removeUser(UserManager.getUser(UserManager.getUserID(args[1])));
                                            }
                                            catch
                                            {
                                            }
                                        }
                                        break;
                                    case "bots":
                                        if (RankManager.containsRight(_Rank, "spawn_bots"))
                                        {
                                            _Room.loadBots(int.Parse(args[1]));
                                        }
                                        break;
                                    case "kickbots":
                                        if (RankManager.containsRight(_Rank, "kick_all_bots"))
                                        {
                                            _Room.kickAllBots();
                                        }
                                        break;
                                    case "pickallup":
                                        // pick up all furniture
                                        if (_Room != null)
                                        {
                                           _Room.pickAllUp(this);
                                        }
                                        break;

                                    default:
                                        break;
                                }
                            }
                        }
                        else
                        {
                            sendData("053" + "#");
                        }
                        break;
                    #endregion

                    #region Avatar
                    case 59: // move avatar
                        MoveAvatarClientPacket movepacket = (MoveAvatarClientPacket)JsonConvert.DeserializeObject(packetBody, typeof(MoveAvatarClientPacket));
                        if (movepacket.X != _Room_X || movepacket.Y != _Room_Y)
                        {
                            if (_Room.checkWalk(_Room_X, _Room_Y, movepacket.X, movepacket.Y))
                            {
                                _Room_X_Target = movepacket.X;
                                _Room_Y_Target = movepacket.Y;
                            }
                        }
                        break;
                    case 73: // get drink
                        GetDrinkPacket drinkPacket = (GetDrinkPacket)JsonConvert.DeserializeObject(packetBody, typeof(GetDrinkPacket));
                        if (_Room != null)
                        {
                            _Room.getDrink(drinkPacket.D, this);
                        }
                        break;
                    #endregion

                    #region Kick Bot
                    case 61:
                        if (RankManager.containsRight(_Rank, "kick_bot"))
                        {
                            KickBotPacket kickBotPacket = (KickBotPacket)JsonConvert.DeserializeObject(packetBody, typeof(KickBotPacket));
                            if (_Room != null)
                            {
                                _Room.removeBot(kickBotPacket.I);
                            }
                        }
                        break;
                    #endregion

                    #region Vote
                    case 65:
                        RoomVotePacket roomVote = (RoomVotePacket)JsonConvert.DeserializeObject(packetBody, typeof(RoomVotePacket));
                        if (_Room != null)
                        {
                            _Room.vote(roomVote.V, this);
                        }
                        break;
                    #endregion

                    #region Rights
                    case 77:
                        // give rights
                        RoomRightsPacket roomGiveRights = (RoomRightsPacket)JsonConvert.DeserializeObject(packetBody, typeof(RoomRightsPacket));
                        if (_Room != null)
                        {
                            if (_Room.RoomOwner == _UserID && _Room.containsUser(roomGiveRights.I))
                            {
                                ConnectedUser targetUser = UserManager.getUser(roomGiveRights.I);
                                if (!RankManager.containsRight(targetUser._Rank, "always_rights"))
                                {
                                    if (!targetUser._HasRights)
                                    {
                                        MySQL.runQuery("INSERT INTO room_rights SET roomid='" + _Room.RoomID + "', userid='" + roomGiveRights.I + "';");
                                        targetUser._HasRights = true;

                                        foreach (ConnectedUser usr in _Room._Users.Values)
                                        {
                                            RoomSendRightsPacket sendRightsPacket = new RoomSendRightsPacket();

                                            sendRightsPacket.I = roomGiveRights.I;
                                            sendRightsPacket.R = true;

                                            string sendString = JsonConvert.SerializeObject(sendRightsPacket);

                                            usr.sendData("079" + sendString + "#");
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    case 78:
                        // take rights
                        RoomRightsPacket roomTakeRights = (RoomRightsPacket)JsonConvert.DeserializeObject(packetBody, typeof(RoomRightsPacket));
                        if (_Room != null)
                        {
                            if (_Room.RoomOwner == _UserID && _Room.containsUser(roomTakeRights.I))
                            {
                                ConnectedUser targetUser = UserManager.getUser(roomTakeRights.I);
                                if (!RankManager.containsRight(targetUser._Rank, "always_rights"))
                                {
                                    if (targetUser._HasRights)
                                    {
                                        MySQL.runQuery("DELETE FROM room_rights WHERE roomid = '" + _Room.RoomID + "' AND userid = '" + roomTakeRights.I + "';");
                                        targetUser._HasRights = false;

                                        foreach (ConnectedUser usr in _Room._Users.Values)
                                        {
                                            RoomSendRightsPacket sendRightsPacket = new RoomSendRightsPacket();

                                            sendRightsPacket.I = roomTakeRights.I;
                                            sendRightsPacket.R = false;

                                            string sendString = JsonConvert.SerializeObject(sendRightsPacket);

                                            usr.sendData("079" + sendString + "#");
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    #endregion

                    #region Furniture
                    case 49:
                        // turn
                        if (_Room != null)
                        {
                            FurnitureTurnPacket furni = (FurnitureTurnPacket)JsonConvert.DeserializeObject(packetBody, typeof(FurnitureTurnPacket));
                            _Room.turnFurni(this, furni.I);
                        }
                        break;
                    case 69:
                        // action
                        if (_Room != null)
                        {
                            FurnitureActionPacket furni = (FurnitureActionPacket)JsonConvert.DeserializeObject(packetBody, typeof(FurnitureActionPacket));
                            _Room.actionFurni(this, furni.I);
                        }
                        break;
                    case 50:
                        // move
                        if (_Room != null)
                        {
                            FurnitureMoveClientPacket furni = (FurnitureMoveClientPacket)JsonConvert.DeserializeObject(packetBody, typeof(FurnitureMoveClientPacket));
                            _Room.doFurni(this, furni.I, furni.T);
                        }
                        break;
                    case 75:
                        // client asks picture info
                        if (_Room != null)
                        {
                            PictureAskPacket ask = (PictureAskPacket)JsonConvert.DeserializeObject(packetBody, typeof(PictureAskPacket));
                            string[] pictureData = MySQL.runReadRow("SELECT code, caption FROM camera WHERE id = '" + ask.I + "'");
                            PictureShowPacket showString = new PictureShowPacket();
                            showString.C = pictureData[0];
                            showString.CA = pictureData[1];
                            sendData("076" + JsonConvert.SerializeObject(showString) + "#");

                        }
                        break;
                    #endregion

                    #endregion

                    #region Navigator
                    case 39:
                        sendData("040" + NavigatorManager.dataPacket(this) + "#");
                        break;
                    case 67: // Navigator - perform guestroom search on name/owner with a given criticeria
                            SearchClientPacket searchClientPacket = (SearchClientPacket)JsonConvert.DeserializeObject(packetBody, typeof(SearchClientPacket));
                            string searchString = MySQL.Stripslash(searchClientPacket.S);
                            int ownerID = MySQL.runRead("SELECT id FROM members WHERE username = '" + searchString.ToLower() + "'", null);
                            string[] roomIDsDB = MySQL.runReadColumn("SELECT id FROM rooms WHERE type='private' AND (owner = '" + ownerID + "' OR name LIKE '%" + searchString + "%') ORDER BY score ASC", 0);
                            
                            List<int> roomIDs = new List<int>();
                            for (int i = 0; i < roomIDsDB.Length; i++)
                            {
                                int furniCount = int.Parse(MySQL.runRead("SELECT count(id) FROM items WHERE room='" + roomIDsDB[i] + "'"));
                                if (furniCount > 0) {
                                    roomIDs.Add(int.Parse(roomIDsDB[i]));
                                }
                            }
                            roomIDs.ToArray();
                            RoomDataPacket[] searchRooms = new RoomDataPacket[roomIDs.Count];
                            for (int i = 0; i < roomIDs.Count; i++)
                            {
                                string[] roomData = MySQL.runReadRow("SELECT name, descr, owner, max, safe FROM rooms WHERE id = '" + roomIDs[i] + "'");
                                RoomDataPacket getr = new RoomDataPacket();
                                int roomID = roomIDs[i];
                                getr.I = roomID;
                                getr.N = roomData[0];
                                getr.D = roomData[1];
                                getr.O = NavigatorManager.getUserName(int.Parse(roomData[2]));
                                if (RoomManager.containsRoom(roomID))
                                {
                                    getr.U = RoomManager.getRoom(roomID).countUsers();
                                }
                                else
                                {
                                    getr.U = 0;
                                }
                                getr.M = int.Parse(roomData[3]);
                                getr.T = "private";
                                getr.S = int.Parse(roomData[4]);
                                getr.F = 0; //FAVORIET?

                                searchRooms[i] = getr;
                            }
                            SearchAnswerPacket searchAnswerPacket = new SearchAnswerPacket();
                            searchAnswerPacket.R = searchRooms;
                            string searchPacketString = JsonConvert.SerializeObject(searchAnswerPacket);
                            sendData("068" + searchPacketString + "#");
                            break;
                    case 70:
                        // Create Room

                        string[] holes = new string[6];
                        string[] doors = new string[6];
                        string[] lang = new string[6];
                        string[] breed = new string[6];
                        holes[0] = "";
                        holes[1] = "1_1;2_1;3_1;4_1;1_2;2_2;3_2;4_2;1_3;2_3;3_3;4_3;1_4;2_4;3_4;4_4";
                        holes[2] = "";
                        holes[3] = "";
                        holes[4] = "";
                        holes[5] = "1_1;2_1;3_1;4_1;5_1;6_1;1_2;2_2;3_2;4_2;5_2;6_2;1_3;2_3;1_4;2_4;1_5;2_5;1_6;2_6";
                        doors[0] = "5_0";
                        doors[1] = "5_0";
                        doors[2] = "3_0";
                        doors[3] = "7_0";
                        doors[4] = "3_0";
                        doors[5] = "5_2";
                        lang[0] = "8";
                        lang[1] = "11";
                        lang[2] = "6";
                        lang[3] = "6";
                        lang[4] = "10";
                        lang[5] = "10";
                        breed[0] = "13";
                        breed[1] = "10";
                        breed[2] = "6";
                        breed[3] = "14";
                        breed[4] = "8";
                        breed[5] = "10";

                        CreateRoomPacket CreateRoomPacket = (CreateRoomPacket)JsonConvert.DeserializeObject(packetBody, typeof(CreateRoomPacket));
                        if (CreateRoomPacket.T > 0 && CreateRoomPacket.T < 7)
                        {
                            int arr_type = CreateRoomPacket.T - 1;
                            int room_ID = MySQL.insertGetLast("INSERT INTO rooms SET name='" + MySQL.Stripslash(Regex.Replace(CreateRoomPacket.N, "<(.|\n)*?>", "")) + "', descr='" + MySQL.Stripslash(Regex.Replace(CreateRoomPacket.D, "<(.|\n)*?>", "")) + "', owner='" + _UserID + "', type='private', lang='" + lang[arr_type] + "', breed='" + breed[arr_type] + "', door='" + doors[arr_type] + "', holes='" + holes[arr_type] + "' ");
                            sendData("040" + NavigatorManager.dataPacket(this) + "#");

                            CreateRoomAnswerPacket createRoomAnswer = new CreateRoomAnswerPacket();
                            createRoomAnswer.A = room_ID.ToString();
                            string createRoomAnswerString = JsonConvert.SerializeObject(createRoomAnswer);
                            sendData("071" + createRoomAnswerString + "#");
                        }
                        else
                        {
                            CreateRoomAnswerPacket createRoomAnswer = new CreateRoomAnswerPacket();
                            createRoomAnswer.A = "error";
                            string createRoomAnswerString = JsonConvert.SerializeObject(createRoomAnswer);
                            sendData("071" + createRoomAnswerString + "#");
                        }
                        break;

                    #endregion

                    #region Help Request
                   case 54:
                         HelpRequestPacket data = (HelpRequestPacket)JsonConvert.DeserializeObject(packetBody, typeof(HelpRequestPacket));

               
                            HelpRequestReplyPacket tosend = new HelpRequestReplyPacket();

                            DateTime epoch = new DateTime(1970, 1, 1, 0, 0, 0, 0).ToLocalTime();
                            TimeSpan span = (DateTime.Now.ToLocalTime() - epoch);

                            tosend.ID = _UserID;
                            tosend.TI = (int)span.TotalSeconds;
                            tosend.U = _Username;
                            tosend.M = Regex.Replace(data.M, "<(.|\n)*?>", "");

                            UserManager.sendToRank(4, "055" + JsonConvert.SerializeObject(tosend) + "#");
                        

                        break;
                   #endregion
        
                    #region Credit Codes
                    case 36:
                        RedeemCouponPacket coupondata = (RedeemCouponPacket)JsonConvert.DeserializeObject(packetBody, typeof(RedeemCouponPacket));

                        int code_check = int.Parse(MySQL.runRead("SELECT count(*) FROM credit_codes WHERE code='" + coupondata.C + "'"));
                        if (code_check == 1)
                        {
                            string[] code_data = MySQL.runReadRow("SELECT type, value FROM credit_codes WHERE code = '" + coupondata.C + "'");
                            string type = code_data[0];

                            if (type == "credits")
                            {
                                int value = int.Parse(code_data[1]);
                                if (value != 0)
                                {
                                    _Money += value;

                                    UserNotificationPacket toupdate = new UserNotificationPacket();
                                    toupdate.Cr = _Money;
                                    toupdate.M = _Mission;
                                    toupdate.C = _Figure;
                                    toupdate.B = _Badge;
                                    string toupdatestring = JsonConvert.SerializeObject(toupdate);
                                    sendData("008" + toupdatestring + "#");
                                    sendData("037#"); //coupon code accepted

                                    string cr_text;
                                    if (value == 1)
                                    {
                                        cr_text = TextsManager.get("money1");
                                    }
                                    else
                                    {
                                        cr_text = TextsManager.get("money2");
                                    }
                                    sendData(notify(TextsManager.get("voucher_success1")+" "+value+" "+cr_text+" "+TextsManager.get("voucher_success2"), ""));

                                    MySQL.runQuery("DELETE FROM credit_codes WHERE code = '" + coupondata.C + "'");
                                    MySQL.runQuery("UPDATE members SET money = '" + _Money + "' WHERE id = '" + _UserID + "'");
                                }
                                else
                                {
                                    CouponFailedPacket failmessage = new CouponFailedPacket();
                                    failmessage.E = TextsManager.get("voucher_novalue");
                                    string packettosend = JsonConvert.SerializeObject(failmessage);
                                    sendData("038" + packettosend + "#");
                                    MySQL.runQuery("DELETE FROM credit_codes WHERE code = '" + coupondata.C + "'");
                                }
                            }
                            else if (type == "furni")
                            {
                                CouponFailedPacket failmessage = new CouponFailedPacket();
                                failmessage.E = "Het spijt ons, meubels kunnen nog niet ontvangen<br>worden met Credit Codes. Uw Code blijft bewaard.";
                                string packettosend = JsonConvert.SerializeObject(failmessage);
                                sendData("038" + packettosend + "#");
                            }
                            else
                            {
                                CouponFailedPacket failmessage = new CouponFailedPacket();
                                failmessage.E = TextsManager.get("voucher_error");
                                string packettosend = JsonConvert.SerializeObject(failmessage);
                                sendData("038" + packettosend + "#");
                            }
                        }
                        else
                        {
                            CouponFailedPacket failmessage = new CouponFailedPacket();
                            failmessage.E = TextsManager.get("voucher_incorrect");
                            string packettosend = JsonConvert.SerializeObject(failmessage);
                            sendData("038" + packettosend + "#");
                        }
                        break;
                    #endregion

                    #region Buy Furniture
                    case 34:
                        BuyFurniPacket buyfurni = (BuyFurniPacket)JsonConvert.DeserializeObject(packetBody, typeof(BuyFurniPacket));
                        string answer = "error";
                        string newFurniPacketString = "";
                        if (CatalogueManager.catalogueCheckAccess(buyfurni.C, _Rank) && CatalogueManager.containsFurni(buyfurni.C, buyfurni.F) && buyfurni.A > 0)
                        {
                            CatalogueManager.categoryFurniTemplate catFurniData = CatalogueManager.getFurni(buyfurni.C, buyfurni.F);
                            int amount = buyfurni.A;
                            if (buyfurni.M == "present")
                            {
                                amount = 1;
                            }
                            int price = catFurniData.price * amount;
                            if (_Money >= price || RankManager.containsRight(_Rank, "dont_pay"))
                            {
                                answer = "ok";
                                bool pay = true;
                                bool tradeable = catFurniData.tradeable;
                                if (RankManager.containsRight(_Rank, "dont_pay"))
                                {
                                    pay = false;
                                    if (!RankManager.containsRight(_Rank, "dont_pay_tradeable")) // staff kan spullen die gekocht zijn met te weinig geld niet ruilen
                                    {
                                        tradeable = false;
                                    }
                                }
                                string tradeable_text = "0";
                                if (tradeable)
                                {
                                    tradeable_text = "1";
                                }
                                for (int i = 0; i < amount; i++)
					            {
                                    if (buyfurni.M == "self")
                                    {
                                        int newFurniID = MySQL.insertGetLast("INSERT INTO items SET owner='" + _UserID + "', furni='" + buyfurni.F + "', tradeable='" + tradeable_text + "'");
                                        MySQL.runQuery("INSERT INTO furni_history SET id='" + newFurniID + "', `date`='" + timestamp.get + "', `type`='cata', `from`='0', `to`='" + _UserID + "', credits='" + catFurniData.price + "';");

                                        FurniturePacket newFurni = new FurniturePacket();
                                        newFurni.I = newFurniID;
                                        newFurni.T = "inv";
                                        newFurni.S = 1;
                                        newFurni.SH = 0;
                                        newFurni.H = 1;
                                        newFurni.A = 0;
                                        newFurni.F = buyfurni.F;

                                        newFurniPacketString += "047"+JsonConvert.SerializeObject(newFurni)+"#";
                                    }
                                }
                                if (pay)
                                {
                                    _Money = int.Parse(MySQL.runRead("SELECT money FROM members WHERE id = '" + _UserID + "'"));
                                    _Money = _Money - price;
                                    MySQL.runQuery("UPDATE members SET money = '" + _Money + "' WHERE id = '" + _UserID + "'");
                                    UpdateMoneyPacket UpdateMoney = new UpdateMoneyPacket();
                                    UpdateMoney.M = _Money;
                                    UpdateMoney.S = _SessionEarned;
                                    string UpdateMoneyString = JsonConvert.SerializeObject(UpdateMoney);
                                    sendData("033" + UpdateMoneyString + "#");
                                }
                             }
                             else
                             {
                                answer = "price";
                             }
                        }
                        BuyAnswerPacket buyFurniAnswer = new BuyAnswerPacket();
                        buyFurniAnswer.A = answer;
                        string buyFurniAnswerString = JsonConvert.SerializeObject(buyFurniAnswer);
                        sendData(newFurniPacketString+"035" + buyFurniAnswerString + "#");
                        break;
                    #endregion

                    default:
                        sendData("003#");
                        Disconnect(2000);
                        break;
                }
            }
        }
    }
}