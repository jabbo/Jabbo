using System;
using System.Text;
using System.IO;
using System.Web;

using System.Collections.Generic;
using JabboServerCMD.Core;
using JabboServerCMD.Core.Instances.User;
using JabboServerCMD.Core.Systems;
using JabboServerCMD.Core.Managers;
using JabboServerCMD.Core.Sockets.Packets.Website;

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Utilities;

namespace CsHTTPServer
{
    public class MyServer : CsHTTPServer
    {
        public MyServer(int thePort) : base(thePort)
        {
        }

        public override void OnResponse(ref HTTPRequestStruct rq, ref HTTPResponseStruct rp)
        {
            string URL = rq.URL;
            string data = URL.Substring(1, URL.Length - 1);
            Console.WriteLine("[HTTP] RECV " + data);
            StringBuilder sendString = new StringBuilder();

            try
            {
                AvatarPhotoDataReturn[] AvatarArray = new AvatarPhotoDataReturn[RoomManager.getRoom(Convert.ToInt32(data))._Users.Count + RoomManager.getRoom(Convert.ToInt32(data))._Bots.Count];
                int i = 0;
                foreach (ConnectedUser usr in RoomManager.getRoom(Convert.ToInt32(data))._Users.Values)
                {
                    AvatarPhotoDataReturn avatars = new AvatarPhotoDataReturn();

                    avatars.C = usr._Figure;
                    avatars.X = usr._Room_X;
                    avatars.Y = usr._Room_Y;
                    avatars.D = usr._Room_Dir;
                    avatars.Dr = usr._Drink;
                    avatars.S = usr._Room_Sit;
                    avatars.Brb = usr._Brb;
                    if (usr._Room_X != usr._Room_X_Target || usr._Room_Y != usr._Room_Y_Target)
                    {
                        avatars.W = 1;
                    }
                    else
                    {
                        avatars.W = 0;
                    }

                    AvatarArray[i] = avatars;
                    i++;
                }

                foreach (JabboServerCMD.Core.Instances.Room.Users.RoomBot bot in RoomManager.getRoom(Convert.ToInt32(data))._Bots.Values)
                {
                    AvatarPhotoDataReturn avatars = new AvatarPhotoDataReturn();

                    avatars.C = bot._MyFigure;
                    avatars.X = bot._MyX;
                    avatars.Y = bot._MyY;
                    avatars.D = bot._MyZ;
                    avatars.Dr = "";
                    avatars.S = bot._Sit;
                    avatars.Brb = 0;
                    if (bot._MyX != bot.targetX || bot._MyY != bot.targetY)
                    {
                        avatars.W = 1;
                    }
                    else
                    {
                        avatars.W = 0;
                    }

                    AvatarArray[i] = avatars;
                    i++;
                }

                sendString.Append(JsonConvert.SerializeObject(AvatarArray));
            }
            catch
            {
                sendString.Append("error");
            }

            rp.BodyData = Encoding.ASCII.GetBytes(sendString.ToString());
            return;
        }
    }
}