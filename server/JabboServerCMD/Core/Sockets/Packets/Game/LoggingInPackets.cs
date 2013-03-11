using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD.Core.Sockets.Packets.Game
{
    [JsonObject(MemberSerialization.OptOut)]
    public class LogInPacket
    {
        public string U;
        public string P;
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class LoginFailurePacket
    {
        public string R;
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class RegisterCheckAnswerPacket
    {
        public string A;
    }

    [JsonObject(MemberSerialization.OptOut)]
    public class UserDataPacket
    {
        public int I;
        public string R;
        public int MY;
        public string CB;
        public string[] B;
        public string MM;
        public string C;
        public string M;
        public string UN;
        public FurniturePacket[] ID;
    }
}