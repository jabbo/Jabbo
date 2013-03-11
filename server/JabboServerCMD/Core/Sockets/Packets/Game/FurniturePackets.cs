using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets.Game
{
    [JsonObject(MemberSerialization.OptOut)]
    public class FurniturePacket
    {
        public int I;
        public string T;
        public int S;
        public int SH;
        public int H;
        public int A;
        public string F;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class FurnitureRemovePacket
    {
        public int I;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class FurnitureMoveClientPacket
    {
        public int I;
        public string T;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class FurnitureTurnPacket
    {
        public int I;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class FurnitureActionPacket
    {
        public int I;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class PictureAskPacket
    {
        public int I;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class PictureShowPacket
    {
        public string C;
        public string CA;
    }
}