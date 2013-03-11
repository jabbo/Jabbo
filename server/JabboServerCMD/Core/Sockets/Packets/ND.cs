using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets
{
    [JsonObject(MemberSerialization.OptOut)]
    public class ND
    {
        public RD[] R;
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class RD
    {
        public int I;
        public string N;
        public string D;
        public string O;
        public int U;
    }
}