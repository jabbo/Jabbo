using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets.Game
{
    [JsonObject(MemberSerialization.OptOut)]
    public class RedeemCouponPacket
    {
        public string C;
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class CouponFailedPacket
    {
        public string E;
    }
}