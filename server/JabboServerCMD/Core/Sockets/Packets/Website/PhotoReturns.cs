using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets.Website
{
    [JsonObject(MemberSerialization.OptOut)]
    public class AvatarPhotoDataReturn
    {
        public string C;
        public int X;
        public int Y;
        public int D;
        public string Dr;
        public string S;
        public int Brb;
        public int W;
    }
}