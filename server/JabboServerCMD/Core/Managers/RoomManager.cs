using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections;

using JabboServerCMD.Core.Sockets;
using JabboServerCMD.Core.Systems;
using JabboServerCMD.Core.Instances.User;
using JabboServerCMD.Core.Instances.Room;

namespace JabboServerCMD.Core.Managers
{
    public static class RoomManager
    {
        public static Hashtable _Rooms = new Hashtable();

        public static Room joinRoom(ConnectedUser User, int roomID)
        {
            if (!containsRoom(roomID))
            {
                addRoom(roomID, new PrivateRoom(roomID));
                getRoom(roomID).addUser(User);
                return getRoom(roomID);
            }
            else
            {
                getRoom(roomID).addUser(User);
                return getRoom(roomID);
            }
        }

        public static void addRoom(int roomID, Room Room)
        {
            _Rooms.Add(roomID, Room);
        }

        public static void removeRoom(int roomID)
        {
            _Rooms.Remove(roomID);
            GC.Collect();
        }

        public static bool containsRoom(int roomID)
        {
            return _Rooms.ContainsKey(roomID);
        }

        public static Room getRoom(int roomID)
        {
            return (Room)_Rooms[roomID];
        }

        public static int countBots()
        {
            int onlineBots = 0;
            foreach (Room room in _Rooms.Values)
            {
                onlineBots += room._Bots.Count;
            }
            return onlineBots;
        }
    }
}
