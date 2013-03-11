using System;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Collections;

//using System.Text;

namespace CsHTTPServer
{
    /// <summary>
    /// Summary description for CsHTTPServer.
    /// </summary>
    public abstract class CsHTTPServer
    {
        private int portNum = 8080;
        private TcpListener listener;
        System.Threading.Thread Thread;

        public Hashtable respStatus;

        public string Name = "JabboV3Server";

        public bool IsAlive
        {
            get
            {
                return this.Thread.IsAlive;
            }
        }

        public CsHTTPServer(int thePort)
        {
            portNum = thePort;
            respStatusInit();
        }

        private void respStatusInit()
        {
            respStatus = new Hashtable();

            respStatus.Add(200, "200 Ok");
            respStatus.Add(201, "201 Created");
            respStatus.Add(202, "202 Accepted");
            respStatus.Add(204, "204 No Content");

            respStatus.Add(301, "301 Moved Permanently");
            respStatus.Add(302, "302 Redirection");
            respStatus.Add(304, "304 Not Modified");

            respStatus.Add(400, "400 Bad Request");
            respStatus.Add(401, "401 Unauthorized");
            respStatus.Add(403, "403 Forbidden");
            respStatus.Add(404, "404 Not Found");

            respStatus.Add(500, "500 Internal Server Error");
            respStatus.Add(501, "501 Not Implemented");
            respStatus.Add(502, "502 Bad Gateway");
            respStatus.Add(503, "503 Service Unavailable");
        }

        public void Listen()
        {

            listener = new TcpListener(IPAddress.Parse("127.0.0.1"), portNum);

            listener.Start();

            Console.WriteLine("    Website HTTP initialized, listening on port: " + portNum.ToString() + ".");
            Console.WriteLine("Server is running!");
            Console.WriteLine("");
            while (true)
            {
                CsHTTPRequest newRequest = new CsHTTPRequest(listener.AcceptTcpClient(), this);
                Thread Thread = new Thread(new ThreadStart(newRequest.Process));
                Thread.Name = "HTTP Request";
                Thread.Start();
            }

        }

        public void Start()
        {
            this.Thread = new Thread(new ThreadStart(this.Listen));
            this.Thread.Start();
        }

        public abstract void OnResponse(ref HTTPRequestStruct rq, ref HTTPResponseStruct rp);

    }
}
