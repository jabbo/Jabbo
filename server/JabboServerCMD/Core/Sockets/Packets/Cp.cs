using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets
{
    [JsonObject(MemberSerialization.OptOut)]
    public class Cp
    {
        public string C;
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class CF
    {
        public string E;
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class CA
    {
        public int M;
    }
}