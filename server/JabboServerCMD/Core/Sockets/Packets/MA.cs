using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets
{
    [JsonObject(MemberSerialization.OptOut)]
    public class MA
    {
        public int I;
        public int X;
        public int Y;
        public bool N;
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class mA
    {
        public int X;
        public int Y;
    }
}