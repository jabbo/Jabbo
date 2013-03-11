using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets.Game
{
    [JsonObject(MemberSerialization.OptOut)]
    public class RoomLoadDataPacket
    {
        public int I;
        public string N;
        public string D;
        public int O;
        public string ON;
        public int Fl;
        public int Wl;
        public int L;
        public int B;
        public string Do;
        public string M;
        public bool R;
        public string[] H;
        public bool V;
        public int S;
        public FurniturePacket[] F;
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class RoomChangePacket
    {
        public int I;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class RoomVotePacket
    {
        public string V;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class RoomScorePacket
    {
        public int S;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class RoomRightsPacket
    {
        public int I;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class RoomSendRightsPacket
    {
        public int I;
        public bool R;
    }
}
