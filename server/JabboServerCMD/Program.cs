using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Text;
using System.Threading;
using System.Net;
using System.IO;


using System.Collections.Concurrent;
using System.Linq;
using Alchemy;
using Alchemy.Classes;
using Newtonsoft.Json;


using JabboServerCMD;
using JabboServerCMD.Core;
using JabboServerCMD.Core.Sockets;
using JabboServerCMD.Core.Managers;
using JabboServerCMD.Core.Systems;

namespace JabboServerCMD
{
    class Program
    {
       /* static void Main(string[] args)
        {
             if (SocketServer.Init(81, 5) == false) return;
             var command = string.Empty;
             while (command != "exit")
             {
                  command = Console.ReadLine();
             }
        }
    }
}*/

        // TODO:
        // Make a kill switch - load page and if it doesn't exist kill the server
        // 

        private static Thread serverMonitor = new Thread(new ThreadStart(monitorServer));

        static void Main(string[] args)
        {
            Initialise();

            while (true)
            {
                Console.Read();
            }
        }

        static void Initialise()
        {
            Console.WriteLine("=========================================");
            Console.WriteLine(" Jabbo V3.2 Server");
            Console.WriteLine(" (C) Thomas Vermaercke 2006-2013");
            Console.WriteLine("=========================================");
            Console.WriteLine("");
            Console.WriteLine("Starting up...");

            INIFile MyINIFile = new INIFile("settings.ini");

            Config.linux = bool.Parse(MyINIFile.GetValue("config", "linux", "true"));

            if (!Config.linux)
            {
                Console.WindowHeight = Console.LargestWindowHeight - 25;
                Console.WindowWidth = Console.LargestWindowWidth - 25;
                Console.Title = "Jabbo Server";
            }

            Config.debug = bool.Parse(MyINIFile.GetValue("config", "debug", "false"));
            Config.port = int.Parse(MyINIFile.GetValue("config", "port", "3500"));
            Config.maxconn = int.Parse(MyINIFile.GetValue("config", "maxcon", "150"));

            Config.dbHost = MyINIFile.GetValue("mysql", "host", "localhost");
            Config.dbPort = int.Parse(MyINIFile.GetValue("mysql", "port", ""));
            Config.dbUsername = MyINIFile.GetValue("mysql", "username", "root");
            Config.dbPassword = MyINIFile.GetValue("mysql", "password", "");
            Config.dbName = MyINIFile.GetValue("mysql", "database", "jabbo");

            Console.WriteLine("    Options read successfully.");

            if (MySQL.openConnection(Config.dbHost, Config.dbPort, Config.dbName, Config.dbUsername, Config.dbPassword) == false)
                return;

            Console.WriteLine("");

            TextsManager.Init();
            UserManager.Init();
            CatalogueManager.Init();
            RankManager.Init();
            NavigatorManager.Init();

            if (SocketServer.Init(Config.port, Config.maxconn) == false)
                return;
            if (WebsiteSocketServer.Init(Config.port + 1, "127.0.0.1") == false)
                return;

            serverMonitor.Priority = ThreadPriority.Lowest;
            serverMonitor.Start();

            CsHTTPServer.CsHTTPServer HTTPServer;
            HTTPServer = new CsHTTPServer.MyServer(3502);
            HTTPServer.Start();
        }

        private static void monitorServer()
        {
            var startTime = DateTime.Now;
            while (true)
            {
                if (!Config.linux)
                {
                    Console.Title = "Jabbo Server [Memory: " + GC.GetTotalMemory(false) / 1024 + "KB | Uptime: " + (DateTime.Now - startTime) + "]";
                }
                Thread.Sleep(6000);
            }
        }
    }
}