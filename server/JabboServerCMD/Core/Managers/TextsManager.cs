using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using JabboServerCMD.Core.Systems;
using MySql.Data.MySqlClient;

namespace JabboServerCMD.Core.Managers
{
    public static class TextsManager
    {
        public static Hashtable texts;

        public static void Init()
        {
            texts = new Hashtable();
            List<List<string>> fieldValues = MySQL.readArray("SELECT name, en FROM texts");
            for (int i = 0; i < fieldValues.Count; i++)
            {
                var thisField = fieldValues[i].ToArray();
                texts.Add(thisField[0].ToString(), thisField[1].ToString());
            }
            Console.WriteLine("    " + fieldValues.Count + " external texts cached.");
        }

        public static string get(string name)
        {
            try
            {
                return (String)texts[name];
            }
            catch
            {
                return "undefined";
            }
        }
    }
}
