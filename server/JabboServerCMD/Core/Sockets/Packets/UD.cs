using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets
{
    [JsonObject(MemberSerialization.OptOut)]
    public class UD
    {
        public int I;
        public string F;
        public int MY;
        public string CB;
        public string[] B;
        public string E;
        public string C;
        public string M;
        public string UN;
        public string S;

        public ID[] ID;
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class ID
    {
        public int I;
        public string T;
        public int S;
        public int X;
        public int Y;
        public int H;
        public string A;
        public string F;
        public int RID;
    }
}
