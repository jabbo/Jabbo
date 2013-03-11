using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets
{
    [JsonObject(MemberSerialization.OptOut)]
    public class Un
    {
        public int K;
        public string M;
        public string C;
        public string B;
        public string S;
    }
}