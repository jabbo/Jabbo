using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets.Game
{
    [JsonObject(MemberSerialization.OptOut)]
    public class MessengerSendMessagePacket
    {
        public int I;
        public string M;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class MessengerDelMessagePacket
    {
        public int I;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class MessengerMessagePacket
    {
        public int I;
        public int FI;
        public string FN;
        public string C;
        public string M;
        public string D;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class FriendListPacket
    {
        public FriendListArrayPacket[] F;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class FriendListArrayPacket
    {
        public int I;
        public string N;
        public string M;
        public string O;
        public bool F;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class MessengerMissionPacket
    {
        public string M;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class MessengerRequestPacket
    {
        public MessengerRequestArrayPacket[] R;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class MessengerRequestArrayPacket
    {
        public int I;
        public string N;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class MessengerAddBuddyPacket
    {
        public int I;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class MessengerRemoveBuddyPacket
    {
        public int I;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class MessengerRequestAnswer
    {
        public int I;
        public bool A;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class MessengerSearchPacket
    {
        public string N;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class MessengerSearchedPacket
    {
        public int I;
        public string M;
        public string C;
        public string L;
        public bool O;
        public bool A;
    }
}