using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets.Game
{
    [JsonObject(MemberSerialization.OptOut)]
    public class NavigatorPacket
    {
        public PublicDataPacket[] P;
        public RoomDataPacket[] R;
        public RoomDataPacket[] O;
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class RoomDataPacket
    {
        public int I;
        public string N;
        public string D;
        public string O;
        public int U;
        public int M;
        public string T;
        public int S;
        public int F;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class PublicDataPacket
    {
        public int I;
        public string N;
        public string D;
        public int U;
        public int M;
        public string T;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class SearchClientPacket
    {
        public string S;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class SearchAnswerPacket
    {
        public RoomDataPacket[] R;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class CreateRoomPacket
    {
        public string N;
        public string D;
        public int T;
        public int S;
        public string P;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class CreateRoomAnswerPacket
    {
        public string A;
    }
}