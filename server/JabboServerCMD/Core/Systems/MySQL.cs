using System;
using System.Data.Odbc;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;

namespace JabboServerCMD.Core.Systems
{
    public static class MySQL
    {
        private static string strConnection;

        static void dbConnection_StateChange(object sender, StateChangeEventArgs ev)
        {
            if (ev.CurrentState == ConnectionState.Broken)
            {
                System.Threading.Thread.Sleep(1000);
                dbConnection.Close();
            }

            if (ev.CurrentState == ConnectionState.Closed)
            {
                System.Threading.Thread.Sleep(1000);

                dbConnection = new MySqlConnection(strConnection);
                dbConnection.StateChange += new System.Data.StateChangeEventHandler(dbConnection_StateChange);
                System.Threading.Thread.Sleep(1000);
                dbConnection.Open();
            }
        }

        private static MySqlConnection dbConnection;
        public static bool openConnection(string dbHost, int dbPort, string dbName, string dbUsername, string dbPassword)
        {
            try
            {
                strConnection = "server=" + dbHost + ";" + "database=" + dbName + ";" + "uid=" + dbUsername + ";" + "password=" + dbPassword;
                dbConnection = new MySqlConnection(strConnection);
                dbConnection.StateChange += new System.Data.StateChangeEventHandler(dbConnection_StateChange);
                dbConnection.Open();
                Console.WriteLine("    Connected to MySQL.");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("    Couldn't connect to MySQL! The error:");
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        public static void closeConnection()
        {
            try
            {
                dbConnection.Close();
            }
            catch
            {

            }
        }

        public static void checkConnection()
        {
            if (dbConnection.State != ConnectionState.Open)
            {
                openConnection(Config.dbHost, Config.dbPort, Config.dbName, Config.dbUsername, Config.dbPassword);
            }
        }

        public static void runQuery(string Query)
        {
            checkConnection();

            try { new MySqlCommand(Query, dbConnection).ExecuteScalar(); }
            catch { }
        }

        public static int insertGetLast(string Query)
        {
            checkConnection();
            return int.Parse((new MySqlCommand(Query + "; SELECT LAST_INSERT_ID();", dbConnection).ExecuteScalar()).ToString());
        }

        public static string runRead(string Query)
        {
            checkConnection();

            try { return new MySqlCommand(Query + " LIMIT 1", dbConnection).ExecuteScalar().ToString(); }
            catch
            {
                return "";
            }
        }

        public static int runRead(string Query, object Tick)
        {
            checkConnection();

            try { return Convert.ToInt32(new MySqlCommand(Query + " LIMIT 1", dbConnection).ExecuteScalar()); }
            catch
            {
                return 0;
            }
        }

        public static string[] runReadColumn(string Query, int maxResults)
        {
            checkConnection();

            MySqlCommand Command = null;
            MySqlDataReader Reader = null;

            if (maxResults > 0)
                Query += " LIMIT " + maxResults;

            try
            {
                Command = dbConnection.CreateCommand();
                Command.CommandText = Query;
                Reader = Command.ExecuteReader();
                if (Reader.HasRows)
                {
                    ArrayList columnBuilder = new ArrayList();
                    while (Reader.Read())
                    {
                        try { columnBuilder.Add(Reader[0].ToString()); }
                        catch { columnBuilder.Add(""); }
                    }
                    return (string[])columnBuilder.ToArray(typeof(string));
                }
                else
                {
                    return new string[0];
                }
            }
            catch(MySqlException Ex)
            {
                if (Command != null)
                {
                    Console.WriteLine("[MySQL] Error!\n\r" + Command.CommandText, Ex);
                }
                else
                {
                    Console.WriteLine("[MySQL] Error!", Ex);
                }
            }
            finally
            {
                // Close the reader/command if they are active.
                if (Reader != null)
                {
                    Reader.Close();
                    Reader.Dispose();
                }
                if (Command != null)
                {
                    Command.Dispose();
                }
            }
            return new string[0];
        }

        public static int[] runReadColumn(string Query, int maxResults, object Tick)
        {
            checkConnection();

            MySqlCommand Command = null;
            MySqlDataReader Reader = null;

            if (maxResults > 0)
                Query += " LIMIT " + maxResults;

            try
            {
                Command = dbConnection.CreateCommand();
                Command.CommandText = Query;
                Reader = Command.ExecuteReader();
                if (Reader.HasRows)
                {
                    ArrayList columnBuilder = new ArrayList();
                    while (Reader.Read())
                    {
                        try { columnBuilder.Add(Reader.GetInt32(0)); }
                        catch { columnBuilder.Add(0); }
                    }
                    return (int[])columnBuilder.ToArray(typeof(int));
                }
                else
                {
                    return new int[0];
                }
            }
            catch (MySqlException Ex)
            {
                if (Command != null)
                {
                    Console.WriteLine("[MySQL] Error!\n\r" + Command.CommandText, Ex);
                }
                else
                {
                    Console.WriteLine("[MySQL] Error!", Ex);
                }
            }
            finally
            {
                // Close the reader/command if they are active.
                if (Reader != null)
                {
                    Reader.Close();
                    Reader.Dispose();
                }
                if (Command != null)
                {
                    Command.Dispose();
                }
            }
            return new int[0];
        }

        public static string[] runReadRow(string Query)
        {
            checkConnection();

            MySqlCommand Command = null;
            MySqlDataReader Reader = null;

            try
            {
                Command = dbConnection.CreateCommand();
                Command.CommandText = Query + " LIMIT 1";
                Reader = Command.ExecuteReader();
                if (Reader.HasRows)
                {
                    ArrayList rowBuilder = new ArrayList();
                    while (Reader.Read())
                    {
                        for (int i = 0; i < Reader.FieldCount; i++)
                        {
                            try { rowBuilder.Add(Reader[i].ToString()); }
                            catch { rowBuilder.Add(""); }
                        }
                    }
                    return (string[])rowBuilder.ToArray(typeof(string));
                }
                else
                {
                    return new string[0];
                }
            }
            catch (MySqlException Ex)
            {
                if (Command != null)
                {
                    Console.WriteLine("[MySQL] Error!\n\r" + Command.CommandText, Ex);
                }
                else
                {
                    Console.WriteLine("[MySQL] Error!", Ex);
                }
            }
            finally
            {
                // Close the reader/command if they are active.
                if (Reader != null)
                {
                    Reader.Close();
                    Reader.Dispose();
                }
                if (Command != null)
                {
                    Command.Dispose();
                }
            }
            return new string[0];
        }

        public static int[] runReadRow(string Query, object Tick)
        {
            checkConnection();

            MySqlCommand Command = null;
            MySqlDataReader Reader = null;

            try
            {
                Command = dbConnection.CreateCommand();
                Command.CommandText = Query + " LIMIT 1";
                Reader = Command.ExecuteReader();
                if (Reader.HasRows)
                {
                    ArrayList rowBuilder = new ArrayList();
                    while (Reader.Read())
                    {
                        for (int i = 0; i < Reader.FieldCount; i++)
                        {
                            try { rowBuilder.Add(Reader.GetInt32(i)); }
                            catch { rowBuilder.Add(0); }
                        }
                    }
                    return (int[])rowBuilder.ToArray(typeof(int));
                }
                else
                {
                    return new int[0];
                }
            }
            catch (MySqlException Ex)
            {
                if (Command != null)
                {
                    Console.WriteLine("[MySQL] Error!\n\r" + Command.CommandText, Ex);
                }
                else
                {
                    Console.WriteLine("[MySQL] Error!", Ex);
                }
            }
            finally
            {
                // Close the reader/command if they are active.
                if (Reader != null)
                {
                    Reader.Close();
                    Reader.Dispose();
                }
                if (Command != null)
                {
                    Command.Dispose();
                }
            }
            return new int[0];
        }


        public static bool checkExists(string Query)
        {
            checkConnection();
            try { return new MySqlCommand(Query + " LIMIT 1", dbConnection).ExecuteReader().HasRows; }
            catch
            {
                return false;
            }
        }

        public static List<List<string>> readArray(string Query)
        {
            MySqlCommand Command = null;
            MySqlDataReader Reader = null;
            try
            {
                // Create the command.
                Command = MySQL.dbConnection.CreateCommand();
                Command.CommandText = Query;

                // Read the result.
                Reader = Command.ExecuteReader();

                // Store the incomming fields.
                List<List<string>> fieldValues = new List<List<string>>();

                // Read all the data.
                while (Reader.Read())
                {
                    // Create a new field values to hold the data.
                    List<string> Buffer = new List<string>();

                    // Add the field values.
                    for (int i = 0; i < Reader.FieldCount; i++)
                    {
                        Buffer.Add(Reader[i].ToString());
                    }

                    // Add it too our overall data.
                    fieldValues.Add(Buffer);
                }
                return fieldValues;
            }
            catch (MySqlException Ex)
            {
                if (Command != null)
                {
                    Console.WriteLine("[MySQL] Error!\n\r" + Command.CommandText, Ex);
                }
                else
                {
                    Console.WriteLine("[MySQL] Error!", Ex);
                }
                return null;
            }
            finally
            {
                // Close the reader/command if they are active.
                if (Reader != null)
                {
                    Reader.Close();
                    Reader.Dispose();
                }
                if (Command != null)
                {
                    Command.Dispose();
                }
            }
        }


        public static string Stripslash(string Query)
        {
            try { return Query.Replace(@"\", "\\").Replace("'", @"\'"); }
            catch { return ""; }
        }
    }
}