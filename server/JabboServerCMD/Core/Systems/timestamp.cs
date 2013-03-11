using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace JabboServerCMD.Core.Systems
{
    public class timestamp
    {
        public static int get
        {
            get
            {
                //.toUniversalTime weggehaald

                // Compares now with the unix epoch.
                DateTime UnixEpoch = new DateTime(1970, 1, 1, 0, 0, 0, 0);
                TimeSpan TimeSpan = (DateTime.Now - UnixEpoch);

                // Returns the number of seconds that have passed.
                return (int)TimeSpan.TotalSeconds;
            }
        }
    }
}
