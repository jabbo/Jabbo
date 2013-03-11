using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using JabboServerCMD.Core.Managers;

namespace JabboServerCMD.Core.Instances.Room.Furni
{
    public class ItemStack
    {
        /*private Hashtable Items;

        public ItemStack()
        {
            Items = new Hashtable();
        }

        public void Add(FurniManager.Item aItem)
        {
            for (int i = 0; i < Items.Count; i++)
            {
                if (Items[i] == null)
                {
                    Items[i] = aItem;
                    return;
                }
            }
        }

        public void Remove(FurniManager.Item aItem)
        {
            foreach (int xItem in Items.Values)
            {
                foreach(int xI in Items.Keys)
                {
                    if (xItem == aItem.ID)
                    {
                        Items.Remove(xI);
                    }
                }
            }
        }

        public int ComputeHeight()
        {
            return 0;
        }

        public bool Contains(int aItemID)
        {
            return Items.Contains(aItemID);
        }

        public bool Contains(FurniManager.Item aItem)
        {
            return Items.Contains(aItem.ID);
        }

        public int Count
        {
            get
            {
                return Items.Count;
            }
        }*/
    }
}
