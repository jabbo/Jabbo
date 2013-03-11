using System;
using System.Net;
using System.Collections.Generic;
using System.Threading;
using System.Collections.Concurrent;
using System.Linq;
using Alchemy;
using Alchemy.Classes;
using Newtonsoft.Json;
using JabboServerCMD.Core.Instances.User;

namespace JabboServerCMD.Core.Sockets
{
    public static class SocketServer
    {
         private static int _Port;
         private static int _maxConnections;
         private static int _acceptedConnections;
         private static HashSet<int> _activeConnections;
         private static ConcurrentDictionary<User, string> OnlineUsers = new ConcurrentDictionary<User, string>();

         internal static bool Init(int bindPort, int maxConnections)
         {
             _Port = bindPort;
             _maxConnections = maxConnections;
             _activeConnections = new HashSet<int>();


             try
             {
                 var aServer = new WebSocketServer(_Port, IPAddress.Any)
                 {
                     OnReceive = OnReceive,
                     OnSend = OnSend,
                     OnConnected = OnConnect,
                     OnDisconnect = OnDisconnect,
                     TimeOut = new TimeSpan(0, 5, 0)
                 };
                 aServer.Start();
                 Console.WriteLine("    WebSockets initialized, listining on port: " + _Port + ".");
                 return true;
             }
             catch
             {
                 Console.WriteLine("    failed to initialize WebSockets!");
                 return false;
             }
         }
         private static void OnConnect(UserContext context)
         {
             try
             {
                 int connectionID = 0;
                 for (int i = 1; i < _maxConnections; i++)
                 {
                     if (_activeConnections.Contains(i) == false)
                     {
                         connectionID = i;
                         break;
                     }
                 }

                 if (connectionID > 0)
                 {

                     Config.Debug.WriteLine("[" + connectionID + "] New connection " + context.ClientAddress);

                     _activeConnections.Add(connectionID);
                     _acceptedConnections++;

                     var me = new User { Context = context, ConnectedUser = new ConnectedUser(connectionID, context) };
                     OnlineUsers.TryAdd(me, context.ClientAddress.ToString());
                 }
             }
             catch
             {
             }
         }
         internal static void OnDisconnect(UserContext context)
         {
             try
             {
                 var u = OnlineUsers.Keys.Where(o => o.Context.ClientAddress == context.ClientAddress).Single();
                 var cu = u.ConnectedUser;
                 if (_activeConnections.Contains(cu.connectionID))
                 {
                     _activeConnections.Remove(cu.connectionID);
                     Config.Debug.WriteLine("[" + cu.connectionID + "] Flagged as free.");
                 }
                 string trash; // Concurrent dictionaries make things weird
                 OnlineUsers.TryRemove(u, out trash);
             }
             catch
             {
                 Console.WriteLine("Error while disconnecting a Client!");
             }
             
         }
         private static void OnReceive(UserContext context)
         {
             var u = OnlineUsers.Keys.Where(o => o.Context.ClientAddress == context.ClientAddress).Single();
             var cu = u.ConnectedUser;
             //Console.WriteLine("[" + cu.connectionID + "] " + context.DataFrame.ToString());
             cu.dataArrival(context.DataFrame.ToString());
         }
         private static void OnSend(UserContext context)
         {
             //Console.WriteLine("Data Sent To : " + context.ClientAddress);
         }
         internal static int maxConnections
         {
             get
             {
                 return _maxConnections;
             }
             set
             {
                 _maxConnections = value;
             }
         }
         internal static int acceptedConnections
         {
             get { return _acceptedConnections; }
         }

         public class User
         {
            public UserContext Context { get; set; }
            public ConnectedUser ConnectedUser { get; set; }
         }
    }
}
