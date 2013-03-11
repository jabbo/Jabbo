using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets
{
    [JsonObject(MemberSerialization.OptOut)]
    public class Rd
    {
        public int I;
        public int V;
        public string N;
        public string D;
        public int O;
        public int Fl;
        public int Wl;
        public int L;
        public int B;
        public string M;
        public int Bg;
        public int U;
        public bool R;

         public Fa[] F;
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class Fa
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
