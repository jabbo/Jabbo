using System;
using System.Net;
using System.Net.Sockets;
using System.Collections.Generic;

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

namespace JabboServerCMD.Core.Sockets
{

    public static class WebsiteSocketServer
    {
        private static Socket socketHandler;
        private static int _Port;
        private static string _musHost;

        internal static bool Init(int bindPort, string musHost)
        {
            _Port = bindPort;
            _musHost = musHost;
            socketHandler = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);

            try
            {
                socketHandler.Bind(new IPEndPoint(IPAddress.Any, bindPort));
                socketHandler.Listen(25);
                socketHandler.BeginAccept(new AsyncCallback(connectionRequest), socketHandler);

                Console.WriteLine("    Website Sockets initialized, listening on port: " + bindPort + ".");
                return true;
            }

            catch
            {
                return false;
            }
        }
        private static void connectionRequest(IAsyncResult iAr)
        {
            Socket newSocket = ((Socket)iAr.AsyncState).EndAccept(iAr);
            if (newSocket.RemoteEndPoint.ToString().Split(':')[0] != _musHost)
            {
                newSocket.Close();
                socketHandler.BeginAccept(new AsyncCallback(connectionRequest), socketHandler);
                return;
            }
            WebsiteConnection newConnection = new WebsiteConnection(newSocket);
            socketHandler.BeginAccept(new AsyncCallback(connectionRequest), socketHandler);
        }

        private class WebsiteConnection
        {
            private Socket Connector;
            private byte[] dataBuffer = new byte[10001];
            private bool killing = false;

            internal WebsiteConnection(Socket Connector)
            {
                this.Connector = Connector;
                Connector.BeginReceive(dataBuffer, 0, dataBuffer.Length, SocketFlags.None, new AsyncCallback(dataArrival), null);
            }

            internal void sendData(string Data)
            {
                Config.Debug.WriteLine("[WEB] SENT " + Data);

                try
                {
                    byte[] dataBytes = System.Text.Encoding.Default.GetBytes(Data);
                    Connector.BeginSend(dataBytes, 0, dataBytes.Length, 0, new AsyncCallback(sentData), null);
                }
                catch
                {
                    killConnection();
                }
            }

            private void sentData(IAsyncResult iAr)
            {
                try { Connector.EndSend(iAr); }
                catch { killConnection(); }
            }

            private void dataArrival(IAsyncResult iAr)
            {
                try
                {
                    int bytesReceived = Connector.EndReceive(iAr);
                    string data = System.Text.Encoding.Default.GetString(dataBuffer, 0, bytesReceived);
                    string[] dataPart = data.Split('#');
                    for (int i = 0; i < dataPart.Length - 1; i++)
                    {
                        processPacket(dataPart[i]);
                    }
                }
                catch { Console.WriteLine("[WEB] Error!"); }
                finally { killConnection(); }
            }

            private void processPacket(string currentPacket)
            {
                int musHeader = int.Parse(currentPacket.Substring(0, 3));
                string musData = currentPacket.Substring(3);
                Console.WriteLine("[WEB] RECV " + currentPacket);
                switch (musHeader)
                {
                    default:
                        sendData("ERR!");
                        break;
                    case 1:
                        sendData("error");
                        break;
                    case 2:
                        string answer = "error";

                        int userID = int.Parse(musData.Split((char)2)[0]);
                        string caption = musData.Split((char)2)[1];
                        string code = musData.Split((char)2)[2];

                        string newFurniPacketString = "";

                        ConnectedUser user = UserManager.getUser(userID);

                        int price = 1;
                        if (user._Money >= price || RankManager.containsRight(user._Rank, "dont_pay"))
                        {
                            answer = "ok";
                            bool pay = true;
                            bool tradeable = true;
                            if (RankManager.containsRight(user._Rank, "dont_pay"))
                            {
                                pay = false;
                                if (!RankManager.containsRight(user._Rank, "dont_pay_tradeable")) // staff kan spullen die gekocht zijn met te weinig geld niet ruilen
                                {
                                    tradeable = false;
                                }
                            }
                            string tradeable_text = "0";
                            if (tradeable)
                            {
                                tradeable_text = "1";
                            }
                                    
                            int newFurniID = MySQL.insertGetLast("INSERT INTO items SET owner='" + user._UserID + "', furni='picture', tradeable='" + tradeable_text + "'");
                            MySQL.runQuery("INSERT INTO furni_history SET id='" + newFurniID + "', `date`='" + timestamp.get + "', `type`='cata', `from`='0', `to`='" + user._UserID + "', credits='" + price + "';");
                            MySQL.runQuery("INSERT INTO camera SET id='" + newFurniID + "', `caption`='" + caption + "', `code`='" + code + "';");

                            Packets.Game.FurniturePacket newFurni = new Packets.Game.FurniturePacket();
                            newFurni.I = newFurniID;
                            newFurni.T = "inv";
                            newFurni.S = 1;
                            newFurni.SH = 0;
                            newFurni.H = 1;
                            newFurni.A = 0;
                            newFurni.F = "picture";

                            newFurniPacketString += "047"+JsonConvert.SerializeObject(newFurni)+"#";        
                                  

                            if (pay)
                            {
                                user._Money = int.Parse(MySQL.runRead("SELECT money FROM members WHERE id = '" + user._UserID + "'"));
                                user._Money = user._Money - price;
                                MySQL.runQuery("UPDATE members SET money = '" + user._Money + "' WHERE id = '" + user._UserID + "'");
                                Packets.Game.UpdateMoneyPacket UpdateMoney = new Packets.Game.UpdateMoneyPacket();
                                UpdateMoney.M = user._Money;
                                UpdateMoney.S = user._SessionEarned;
                                string UpdateMoneyString = JsonConvert.SerializeObject(UpdateMoney);
                                user.sendData("033" + UpdateMoneyString + "#");
                             }
                        }
                        else
                        {
                            answer = "price";
                        }
                        Packets.Game.BuyAnswerPacket buyFurniAnswer = new Packets.Game.BuyAnswerPacket();
                        buyFurniAnswer.A = answer;
                        string buyFurniAnswerString = JsonConvert.SerializeObject(buyFurniAnswer);
                        user.sendData(newFurniPacketString + "035" + buyFurniAnswerString + "#");

                        break;
                }
            }

            private void killConnection()
            {
                if (!killing)
                {
                    try { Connector.Close(); Console.WriteLine("[WEB] Connection Closed"); killing = true; }
                    catch { }
                }
            }
        }
    }
}
