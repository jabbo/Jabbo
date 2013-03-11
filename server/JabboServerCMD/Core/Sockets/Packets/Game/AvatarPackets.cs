using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets.Game
{
    [JsonObject(MemberSerialization.OptOut)]
    public class AddAvatarPacket
    {
        public int I;
        public string U;
        public string M;
        public string C;
        public string B;
        public string D;
        public string S;
        public int Brb;
        public int X;
        public int Y;
        public int H;
        public bool F;
        public bool R;
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class RemoveAvatarPacket
    {
        public int I;
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class MoveAvatarPacket
    {
        public int I;
        public int X;
        public int Y;
        public int H;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class StopAvatarPacket
    {
        public int I;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class MoveAvatarClientPacket
    {
        public int X;
        public int Y;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class KickBotPacket
    {
        public int I;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class GetDrinkPacket
    {
        public string D;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class GiveDrinkPacket
    {
        public int I;
        public string D;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class SetSitPacket
    {
        public int I;
        public string S;
    }
    [JsonObject(MemberSerialization.OptOut)]
    public class UpdateBrbPacket
    {
        public int I;
        public int Brb;
    }
}