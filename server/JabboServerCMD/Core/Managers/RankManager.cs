using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using JabboServerCMD.Core.Systems;

namespace JabboServerCMD.Core.Managers
{
    public static class RankManager
    {
        private static Hashtable userRanks;
        public static void Init()
        {
            userRanks = new Hashtable();

            int rankCount = int.Parse(MySQL.runRead("SELECT count(id) FROM ranks"));
            for (byte i = 1; i <= rankCount; i++)
                userRanks.Add(i, new userRank(i));

            Console.WriteLine("    Ranks initialized.");
        }
        public static string Rights(byte rankID)
        {
            string[] rights = ((userRank)userRanks[rankID]).rights;
            StringBuilder strBuilder = new StringBuilder();

            for (int i = 0; i < rights.Length; i++)
                strBuilder.Append(rights[i] + ";");

            return strBuilder.ToString();
        }
        public static bool containsRight(byte rankID, string right)
        {
            userRank objRank = ((userRank)userRanks[rankID]);
            for (int i = 0; i < objRank.rights.Length; i++)
                if (objRank.rights[i] == right)
                    return true;

            return false;
        }
        private struct userRank
        {
            internal string[] rights;
            internal userRank(byte rankID)
            {
                rights = MySQL.runReadColumn("SELECT `right` FROM `rank_rights` WHERE `minrank` <= " + rankID + "", 0);
            }
        }
    }
}