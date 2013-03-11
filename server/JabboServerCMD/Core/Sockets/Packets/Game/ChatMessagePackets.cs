using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets.Game
{
    [JsonObject(MemberSerialization.OptOut)]
    public class SendMessagePacket
    {
        public string T;
        public string M;
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class SendMessageReplyPacket
    {
        public string U;
        public int I;
        public string M;
    }
}