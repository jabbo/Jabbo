using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets
{
    [JsonObject(MemberSerialization.OptOut)]
    public class HR
    {
        public string M;
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class Hr
    {
        public int ID;
        public int TI;
        public string U;
        public string M;
    }
}