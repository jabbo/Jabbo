using System;
using System.Text;
using System.Threading;
using System.Collections;
using System.Collections.Generic;

using JabboServerCMD.Core;
using JabboServerCMD.Core.Sockets;
using JabboServerCMD.Core.Managers;
using JabboServerCMD.Core.Sockets.Packets.Game;
using JabboServerCMD.Core.Systems;
using JabboServerCMD.Core.Instances.Room;
using JabboServerCMD.Core.Instances.User;

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Utilities;

namespace JabboServerCMD.Core.Managers
{
    public static class NavigatorManager
    {
        private static Thread naviUpdater;
        private static RoomDataPacket[] guestRooms;
        private static PublicDataPacket[] publicRooms;

        public static void Init()
        {
            naviUpdater = new Thread(new ThreadStart(updateNaviThread));
            naviUpdater.Start();
            Console.WriteLine("    Navigator initialized.");
        }
        public static int getUserID(string userName)
        {
            return MySQL.runRead("SELECT id FROM members WHERE username = '" + userName + "'", null);
        }

        public static string getUserName(int userID)
        {
            return MySQL.runRead("SELECT username FROM members WHERE id = '" + userID + "'");
        }
        public static string dataPacket(ConnectedUser user)
        {
            int[] RoomIDs = MySQL.runReadColumn("SELECT id FROM rooms WHERE owner='"+user._UserID+"'", 0, null);
            RoomDataPacket[] ownRooms = new RoomDataPacket[RoomIDs.Length];
            for (int i = 0; i < RoomIDs.Length; i++)
            {
                string[] roomData = MySQL.runReadRow("SELECT name, descr, max, safe FROM rooms WHERE id = '" + RoomIDs[i] + "'");
                RoomDataPacket getr = new RoomDataPacket();
                getr.I = RoomIDs[i];
                getr.N = roomData[0];
                getr.D = roomData[1];
                getr.O = user._Username;
                if (RoomManager.containsRoom(RoomIDs[i]))
                {
                    getr.U = RoomManager.getRoom(RoomIDs[i]).countUsers();
                }
                else
                {
                    getr.U = 0;
                }
                getr.M = int.Parse(roomData[2]);
                getr.T = "private";
                getr.S = int.Parse(roomData[3]);
                getr.F = 0; //FAVORIET?

                ownRooms[i] = getr;
            }

            NavigatorPacket AllRooms = new NavigatorPacket();
            AllRooms.P = publicRooms;
            AllRooms.R = guestRooms;
            AllRooms.O = ownRooms;
            string AllRoomsString = JsonConvert.SerializeObject(AllRooms);
            return AllRoomsString;
        }

        public static void updateNaviThread()
        {
            while (true)
            {
                try
                {
                    updateNavi();
                }
                catch
                {
                    Console.WriteLine("NAVIGATOR UPDATE THREAD ERROR");
                }
                Thread.Sleep(15000); // elke 15 seconden
            }
        }

        public static void updateNavi()
        {
            int[] PublicIDs = MySQL.runReadColumn("SELECT id FROM rooms WHERE type='public'", 20, null);
            publicRooms = new PublicDataPacket[PublicIDs.Length];
            for (int i = 0; i < PublicIDs.Length; i++)
            {
                string[] roomData = MySQL.runReadRow("SELECT name, descr, max FROM rooms WHERE id = '" + PublicIDs[i] + "'");
                PublicDataPacket getr = new PublicDataPacket();
                getr.I = PublicIDs[i];
                getr.N = roomData[0];
                getr.D = roomData[1];
                if (RoomManager.containsRoom(PublicIDs[i]))
                {
                    getr.U = RoomManager.getRoom(PublicIDs[i]).countUsers();
                }
                else
                {
                    getr.U = 0;
                }
                getr.M = int.Parse(roomData[2]);
                getr.T = "public";
                publicRooms[i] = getr;
            }

            List<int> roomIDs = new List<int>();
            int[] rooms = new int[RoomManager._Rooms.Count];
            RoomManager._Rooms.Keys.CopyTo(rooms, 0);
            int[] users = new int[RoomManager._Rooms.Count];
            int count = 0;
            foreach (PrivateRoom room in RoomManager._Rooms.Values)
            {
                users[count++] = room.countUsers();
            }
            Array.Sort(users, rooms);
            Array.Reverse(rooms);

            int maxActiveRooms = 10;
            foreach (int roomID in rooms)
            {
                if (maxActiveRooms-- > 0)
                {
                    roomIDs.Add(roomID);
                }
            }

            int maxPopularRooms = 10;
            int[] popularIDs = MySQL.runReadColumn("SELECT * FROM `rooms` WHERE `type`='private' AND safe='1' ORDER BY score DESC", maxPopularRooms, null);
            for (int i = 0; i < popularIDs.Length; i++)
            {
                if (!roomIDs.Contains(popularIDs[i]))
                {
                    roomIDs.Add(popularIDs[i]);
                }
            }

            int[] RoomIDs = roomIDs.ToArray();
            guestRooms = new RoomDataPacket[RoomIDs.Length];
            for (int i = 0; i < RoomIDs.Length; i++)
            {
                string[] roomData = MySQL.runReadRow("SELECT name, descr, owner, max, safe FROM rooms WHERE id = '" + RoomIDs[i] + "'");
                RoomDataPacket getr = new RoomDataPacket();
                getr.I = RoomIDs[i];
                getr.N = roomData[0];
                getr.D = roomData[1];
                getr.O = getUserName(int.Parse(roomData[2]));
                if (RoomManager.containsRoom(RoomIDs[i]))
                {
                    getr.U = RoomManager.getRoom(RoomIDs[i]).countUsers();
                }
                else
                {
                    getr.U = 0;
                }
                getr.M = int.Parse(roomData[3]);
                getr.T = "private";
                getr.S = int.Parse(roomData[4]);
                getr.F = 0; //FAVORIET?

                guestRooms[i] = getr;
            }
        }
    }
}
