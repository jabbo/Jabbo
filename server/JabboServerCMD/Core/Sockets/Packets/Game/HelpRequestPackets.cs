using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets.Game
{
    [JsonObject(MemberSerialization.OptOut)]
    public class HelpRequestPacket
    {
        public string M;
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class HelpRequestReplyPacket
    {
        public int ID;
        public int TI;
        public string U;
        public string M;
    }
}