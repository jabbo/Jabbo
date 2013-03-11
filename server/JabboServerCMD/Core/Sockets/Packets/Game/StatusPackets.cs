using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets.Game
{
    [JsonObject(MemberSerialization.OptOut)]
    public class ServerRAMPacket
    {
        public int R;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class UserNotificationPacket
    {
        public int Cr;
        public string M;
        public string C;
        public string B;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class ClubStatusPacket
    {
        public bool S;
        public int D;
        public int PM;
        public int RM;
    }
}
