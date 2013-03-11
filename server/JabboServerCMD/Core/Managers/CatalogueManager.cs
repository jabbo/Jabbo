using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using JabboServerCMD.Core.Systems;
using JabboServerCMD.Core.Instances.Room.Furni;

namespace JabboServerCMD.Core.Managers
{
    public static class CatalogueManager
    {
        private static Hashtable itemCache;
        private static List<categoryTemplate> catalogueCache;

        public static void Init()
        {
            itemCache = new Hashtable();

            List<List<string>> fieldValues = MySQL.readArray("SELECT furni, name, descr, afb, soort, action, change_x, change_y, turn_x, turn_y, action_x, action_y, stacking, stackheight, lang, breed FROM furni");
            for (int i = 0; i < fieldValues.Count; i++)
            {
                var thisField = fieldValues[i].ToArray();
                itemCache.Add(i, new ItemTemplate(thisField[0], thisField[1], thisField[2], int.Parse(thisField[3]), thisField[4], int.Parse(thisField[5]), int.Parse(thisField[6]), int.Parse(thisField[7]), int.Parse(thisField[8]), int.Parse(thisField[9]), int.Parse(thisField[10]), int.Parse(thisField[11]), int.Parse(thisField[12]), int.Parse(thisField[13]), int.Parse(thisField[14]), int.Parse(thisField[15])));
            }
            Console.WriteLine("    " + fieldValues.Count + " pieces of furni cached.");

            catalogueCache = new List<categoryTemplate>();
            fieldValues = MySQL.readArray("SELECT id, furni, access FROM shop");
            for (int i = 0; i < fieldValues.Count; i++)
            {
                var thisField = fieldValues[i].ToArray();
                catalogueCache.Add(new categoryTemplate(int.Parse(thisField[0]), thisField[1], thisField[2]));
            }
            Console.WriteLine("    " + fieldValues.Count + " furni collections cached.");
        }

        public static ItemTemplate getTemplate(string templateID)
        {
            foreach (ItemTemplate itm in itemCache.Values)
            {
                if (itm.furni == templateID)
                {
                    return itm;
                }
            }
            return new ItemTemplate();
        }

        public struct ItemTemplate
        {
            internal string furni;
            internal string name;
            internal string descr;
            internal int afb;
            internal string soort;
            internal int action;
            internal int change_x;
            internal int change_y;
            internal int turn_x;
            internal int turn_y; 
            internal int action_x;
            internal int action_y;
            internal int stacking;
            internal int stackheight;
            internal int lang;
            internal int breed;

            public ItemTemplate(string furni, string name, string descr, int afb, string soort, int action, int change_x, int change_y, int turn_x, int turn_y, int action_x, int action_y, int stacking, int stackheight, int lang, int breed)
            {
                this.furni = furni;
                this.name = name;
                this.descr = descr;
                this.afb = afb;
                this.soort = soort;
                this.action = action;
                this.change_x = change_x;
                this.change_y = change_y;
                this.turn_x = turn_x;
                this.turn_y =  turn_y;
                this.action_x = action_x;
                this.action_y = action_y;
                this.stacking = stacking;
                this.stackheight = stackheight;
                this.lang = lang;
                this.breed = breed;
            }
        }

        public struct categoryTemplate
        {
            internal int id;
            internal List<categoryFurniTemplate> furni;
            internal List<byte> access;

            public categoryTemplate(int id, string furni, string access)
            {
                this.id = id;
                this.furni = new List<categoryFurniTemplate>();
                this.access = new List<byte>();
                string[] furniture = furni.Split(';');
                foreach (string thisfurni in furniture)
                {
                    if (thisfurni != "")
                    {
                        this.furni.Add(new categoryFurniTemplate(thisfurni.Split(':')));
                    }
                }
                string[] accessarray = access.Split(';');
                foreach (string thisaccess in accessarray)
                {
                    this.access.Add(byte.Parse(thisaccess));
                }
            }
        }

        public struct categoryFurniTemplate
        {
            internal string furni;
            internal int price;
            internal bool tradeable;
            public categoryFurniTemplate(string[] furni)
            {
                this.furni = furni[0];
                this.price = int.Parse(furni[1]);
                this.tradeable = true;
                if (furni.Length == 3)
                {
                    if (furni[2] == "no")
                    {
                        this.tradeable = false;
                    }
                }
            }
        }

        public static categoryTemplate catalogueGetCat(int id)
        {
            categoryTemplate catTemp = catalogueCache.Find(delegate(categoryTemplate search)
            {
                if (search.id == id)
                {
                    return true;
                }
                return false;
            });
            return catTemp;
        }

        public static bool catalogueCheckAccess(int catid, byte rank)
        {
            try
            {
                return catalogueGetCat(catid).access.Contains(rank);
            }
            catch
            {
                return false;
            }
        }

        public static bool containsFurni(int catid, string furni)
        {
            bool found = false;
            categoryFurniTemplate furniTemp = catalogueGetCat(catid).furni.Find(delegate(categoryFurniTemplate search)
            {
                if (search.furni == furni)
                {
                    found = true;
                    return true;
                }
                return false;
            });
            if (found)
            {
                return true;
            }
            return false;
        }

        public static categoryFurniTemplate getFurni(int catid, string furni)
        {
            categoryFurniTemplate furniTemp = catalogueGetCat(catid).furni.Find(delegate(categoryFurniTemplate search)
            {
                if (search.furni == furni)
                {
                    return true;
                }
                return false;
            });
            return furniTemp;
        }
    }
}
