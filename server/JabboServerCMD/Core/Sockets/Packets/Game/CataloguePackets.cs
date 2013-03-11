using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets.Game
{
    [JsonObject(MemberSerialization.OptOut)]
    public class UpdateMoneyPacket
    {
        public int M;
        public int S;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class BuyFurniPacket
    {
        public int C;
        public string F;
        public int A;
        public string M;
        public string T;
        public string Me;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class BuyAnswerPacket
    {
        public string A;
    }
}
