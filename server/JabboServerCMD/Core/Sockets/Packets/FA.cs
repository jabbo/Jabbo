using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets
{
    [JsonObject(MemberSerialization.OptOut)]
    public class FA
    {
        public int I;
        public string T;
        public int S;
        public int X;
        public int Y;
        public int H;
        public string A;
        public string F;
    }
}