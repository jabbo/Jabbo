using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets.Game
{
    [JsonObject(MemberSerialization.OptOut)]
    public class MessagePacket
    {
        public string M;
        public string T;
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class GlobalAlertPacket
    {
        public string M;
    }
}