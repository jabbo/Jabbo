using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace JabboServerCMD.Core
{
    public static class Config
    {
        public static bool linux;

        public static bool debug;

        public static int port;
        public static int maxconn;

        public static string dbHost;
        public static int dbPort;
        public static string dbName;
        public static string dbUsername;
        public static string dbPassword;

        public static class Debug
        {
            public static void WriteLine(string text)
            {
                if(Config.debug)
                {
                    Console.WriteLine(text);
                }
            }
        }
    }
}
