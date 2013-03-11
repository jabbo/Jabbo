using System;
using System.Text;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Collections;
using System.Text.RegularExpressions;

using JabboServerCMD.Core;
using JabboServerCMD.Core.Sockets;
using JabboServerCMD.Core.Managers;
using JabboServerCMD.Core.Sockets.Packets.Game;
using JabboServerCMD.Core.Systems;
using JabboServerCMD.Core.Instances.Room;

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Utilities;
namespace JabboServerCMD.Core.Instances.User
{
    class Buddy
    {
        /// <summary>
        /// The database ID of this user.
        /// </summary>
        internal int userID;
        internal string userName;
        internal string mission;
        internal string lastVisit;

        /// <summary>
        /// Intializes a virtual buddy.
        /// </summary>
        /// <param name="userID">The database ID of this buddy.</param>
        internal Buddy(int userID, string userName, string mission, string lastVisit)
        {
            this.userID = userID;
            this.userName = userName;
            this.mission = mission;
            this.lastVisit = lastVisit;
        }

        /// <summary>
        /// Important to check the 'Updated' bool first. Returns the status string for a virtual buddy based on the statistics of the last call of 'Updated'.
        /// </summary>
        /// <param name="includeUsername">Specifies if to include the username in the string. Only required at first sending of packet in session of client.</param>
        internal FriendListArrayPacket BuddyPacket()
        {
            FriendListArrayPacket output = new FriendListArrayPacket();
            bool Followable = false;
            string onlineText;
            //containsUser
            if (UserManager.containsUser(userID))
            {
                onlineText = "online";
                if (UserManager.getUser(userID)._Room != null)
                {
                    Followable = true;
                }
            }
            else
            {
                onlineText = lastVisit;
            }
            output.I = userID;
            output.N = userName;
            output.M = mission;
            output.O = onlineText;
            output.F = Followable;
            return output;
        }
    }
}
