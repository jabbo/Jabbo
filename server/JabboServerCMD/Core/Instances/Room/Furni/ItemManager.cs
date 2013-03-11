using System;
using System.Text;
using System.Threading;
using System.Collections;
using System.Collections.Generic;

using JabboServerCMD.Core.Managers;
using JabboServerCMD.Core.Systems;

namespace JabboServerCMD.Core.Instances.Room.Items
{
    internal class FloorItemManager
    {
        private Room _Room;
        private Hashtable _Items = new Hashtable();
        
        public FloorItemManager(Room Room)
        {
            this._Room = Room;
        }

        internal void Clear()
        {
            try { _Items.Clear(); }
            catch { }
            _Room = null;
            _Items = null;
        }

        internal void addItem(int itemID, int templateID, int X, int Y, int Z, int H, string Var)
        {
            CatalogueManager.itemTemplate Template = CatalogueManager.getTemplate(templateID);

            int Length = 0;
            int Width = 0;
            if (Z == 2 || Z == 6)
            {
                Length = Template.Length;
                Width = Template.Width;
            }
            else
            {
                Length = Template.Width;
                Width = Template.Length;
            }

            for (int jX = X; jX < X + Width; jX++)
                for (int jY = Y; jY < Y + Length; jY++)
                {
                    ItemStack Stack = _Room._sqStack[jX, jY];
                    if (Stack == null)
                    {
                        if (Template.typeID != 2 && Template.typeID != 3)
                        {
                            Stack = new ItemStack();
                            Stack.Add(itemID);
                        }
                    }
                    else
                        Stack.Add(itemID);

                    _Room._sqState[jX, jY] = (Room.squareState)Template.typeID;
                    if (Template.typeID == 2 || Template.typeID == 3)
                    {
                        _Room._sqItemHeight[jX, jY] = H + Template.Height;
                        _Room._sqItemRot[jX, jY] = Convert.ToByte(Z);
                    }
                    else
                    {
                        if (Template.typeID == 4)
                            _Room._sqItemHeight[jX, jY] = H;
                    }
                    _Room._sqStack[jX, jY] = Stack;
                }
            FloorItem Item = new FloorItem(itemID, templateID, X, Y, Z, H, Var);
            _Items.Add(itemID, Item);
        }

        internal void placeItem(int itemID, int templateID, int X, int Y, byte typeID, byte Z)
        {
            if (_Items.ContainsKey(itemID))
                return;

            try
            {
                CatalogueManager.itemTemplate Template = CatalogueManager.getTemplate(templateID);

                int Length = 0;
                int Width = 0;
                if (Z == 2 || Z == 6)
                {
                    Length = Template.Length;
                    Width = Template.Width;
                }
                else
                {
                    Length = Template.Width;
                    Width = Template.Length;
                }

                int testH = _Room._sqHeight[X, Y];
                int H = testH;
                if (_Room._sqStack[X, Y] != null)
                {
                    FloorItem topItem = (FloorItem)_Items[_Room._sqStack[X, Y].topItemID()];
                    H = topItem.H + CatalogueManager.getTemplate(topItem.TypeDBID).Height;
                }

                for (int jX = X; jX < X + Width; jX++)
                {
                    for (int jY = Y; jY < Y + Length; jY++)
                    {
                        if (_Room._sqUnit[jX, jY])
                            return;

                        Room.squareState jState = _Room._sqState[jX, jY];
                        if (jState != Room.squareState.Open)
                        {
                            if (jState == Room.squareState.Blocked)
                            {
                                if (_Room._sqStack[jX, jY] == null)
                                    return;
                                else
                                {
                                    FloorItem topItem = (FloorItem)_Items[_Room._sqStack[jX, jY].topItemID()];
                                    CatalogueManager.itemTemplate topItemTemplate = CatalogueManager.getTemplate(topItem.TypeDBID);
                                    if (topItemTemplate.Height == 0 || topItemTemplate.typeID == 2 || topItemTemplate.typeID == 3) // No stacking on seat/bed
                                        return;
                                    else
                                    {
                                        if (topItem.H + topItemTemplate.Height > H)
                                            H = topItem.H + topItemTemplate.Height;
                                    }
                                }
                            }
                            else
                                return;
                        }
                    }
                }

                for (int jX = X; jX < X + Width; jX++)
                {
                    for (int jY = Y; jY < Y + Length; jY++)
                    {
                        ItemStack Stack = null;
                        if (_Room._sqStack[jX, jY] == null)
                        {
                            if ((Template.typeID == 1 && Template.Height > 0) || Template.typeID == 4)
                            {
                                Stack = new ItemStack();
                                Stack.Add(itemID);
                            }
                        }
                        else
                        {
                            Stack = _Room._sqStack[jX, jY];
                            Stack.Add(itemID);
                        }

                        _Room._sqState[jX, jY] = (Room.squareState)Template.typeID;
                        _Room._sqStack[jX, jY] = Stack;
                        if (Template.typeID == 2 || Template.typeID == 3)
                        {
                            _Room._sqItemHeight[jX, jY] = H + Template.Height;
                            _Room._sqItemRot[jX, jY] = Z;
                        }
                        else if (Template.typeID == 4)
                            _Room._sqItemHeight[jX, jY] = H;
                    }
                }

                MySQL.runQuery("UPDATE items SET room = '" + _Room.RoomID + "',tile = '" + X + "_" + Y + "',h = '" + Z + "' WHERE id = '" + itemID + "' LIMIT 1");
                FloorItem Item = new FloorItem(itemID, templateID, X, Y, Z, H, "");
                _Items.Add(itemID, Item);
                _Room.sendData("A]" + Item.ToString());
            }
            catch { }
        }

        internal void relocateItem(int itemID, int X, int Y, byte Z)
        {
            try
            {
                FloorItem Item = (FloorItem)_Items[itemID];
                CatalogueManager.itemTemplate Template = CatalogueManager.getTemplate(Item.TypeDBID);

                int Length = 0;
                int Width = 0;
                if (Z == 2 || Z == 6)
                {
                    Length = Template.Length;
                    Width = Template.Width;
                }
                else
                {
                    Length = Template.Width;
                    Width = Template.Length;
                }

                int baseFloorH = _Room._sqHeight[X, Y];
                int H = baseFloorH;
                if (_Room._sqStack[X, Y] != null)
                {
                    FloorItem topItem = (FloorItem)_Items[_Room._sqStack[X, Y].topItemID()];
                    if (topItem != Item)
                    {
                        CatalogueManager.itemTemplate topTemplate = CatalogueManager.getTemplate(topItem.TypeDBID);
                        if (topTemplate.typeID == 1)
                            H = topItem.H + topTemplate.Height;
                    }
                    else if (_Room._sqStack[X, Y].Count > 1)
                        H = topItem.H;
                }

                for (int jX = X; jX < X + Width; jX++)
                {
                    for (int jY = Y; jY < Y + Length; jY++)
                    {
                        if (Template.typeID != 2 && _Room._sqUnit[jX, jY])
                            return;

                        Room.squareState jState = _Room._sqState[jX, jY];
                        ItemStack Stack = _Room._sqStack[jX, jY];
                        if (jState != Room.squareState.Open)
                        {
                            if (Stack == null)
                            {
                                if (jX != Item.X || jY != Item.Y)
                                    return;
                            }
                            else
                            {
                                FloorItem topItem = (FloorItem)_Items[Stack.topItemID()];
                                if (topItem != Item)
                                {
                                    CatalogueManager.itemTemplate topItemTemplate = CatalogueManager.getTemplate(topItem.TypeDBID);
                                    if (topItemTemplate.typeID == 1 && topItemTemplate.Height > 0)
                                    {
                                        if (topItem.H + topItemTemplate.Height > H)
                                            H = topItem.H + topItemTemplate.Height;
                                    }
                                    else
                                    {
                                        if (topItemTemplate.typeID == 2)
                                            return;
                                    }
                                }
                            }
                        }
                    }
                }

                int oldLength = 1;
                int oldWidth = 1;

                if (Template.Length > 1 || Template.Width > 1)
                {
                    if (Item.Z == 2 || Item.Z == 6)
                    {
                        oldLength = Template.Length;
                        oldWidth = Template.Width;
                    }
                    else
                    {
                        oldLength = Template.Width;
                        oldWidth = Template.Length;
                    }
                }

                for (int jX = Item.X; jX < Item.X + oldWidth; jX++)
                {
                    for (int jY = Item.Y; jY < Item.Y + oldLength; jY++)
                    {
                        ItemStack Stack = _Room._sqStack[jX, jY];
                        if (Stack != null && Stack.Count > 1)
                        {
                            if (itemID == Stack.bottomItemID())
                            {
                                if (CatalogueManager.getTemplate(((FloorItem)_Items[Stack.topItemID()]).TypeDBID).typeID == 2)
                                    _Room._sqState[jX, jY] = Room.squareState.Seat;
                                else
                                    _Room._sqState[jX, jY] = Room.squareState.Open;
                            }
                            else if (itemID == Stack.topItemID())
                            {
                                FloorItem belowItem = (FloorItem)_Items[Stack.getBelowItemID(itemID)];
                                int typeID = CatalogueManager.getTemplate(belowItem.TypeDBID).typeID;

                                _Room._sqState[jX, jY] = (Room.squareState)typeID;
                                if (typeID == 2 || typeID == 3)
                                {
                                    _Room._sqItemRot[jX, jY] = (byte)belowItem.Z;
                                    _Room._sqItemHeight[jX, jY] = belowItem.H + CatalogueManager.getTemplate(belowItem.TypeDBID).Height;
                                }
                                else if (typeID == 4)
                                    _Room._sqItemHeight[jX, jY] = belowItem.H;
                            }
                            Stack.Remove(itemID);
                            _Room._sqStack[jX, jY] = Stack;
                        }
                        else
                        {
                            _Room._sqState[jX, jY] = 0;
                            _Room._sqItemHeight[jX, jY] = 0;
                            _Room._sqItemRot[jX, jY] = 0;
                            _Room._sqStack[jX, jY] = null;
                        }
                        if (Template.typeID == 2 || Template.typeID == 3)
                            _Room.refreshCoord(jX, jY);
                    }
                }

                Item.X = X;
                Item.Y = Y;
                Item.Z = Z;
                Item.H = H;
                //_Room.sendData("A_" + Item.ToString());
                //DB.runQuery("UPDATE furniture SET x = '" + X + "',y = '" + Y + "',z = '" + Z + "',h = '" + H.ToString().Replace(',', '.') + "' WHERE id = '" + itemID + "' LIMIT 1");

                for (int jX = X; jX < X + Width; jX++)
                {
                    for (int jY = Y; jY < Y + Length; jY++)
                    {
                        ItemStack Stack = null;
                        if (_Room._sqStack[jX, jY] == null)
                        {
                            if (Template.Height > 0 && Template.typeID != 2 && Template.typeID != 3 && Template.typeID != 4)
                            {
                                Stack = new ItemStack();
                                Stack.Add(itemID);
                            }
                        }
                        else
                        {
                            Stack = _Room._sqStack[jX, jY];
                            Stack.Add(itemID);
                        }

                        _Room._sqState[jX, jY] = (Room.squareState)Template.typeID;
                        _Room._sqStack[jX, jY] = Stack;
                        if (Template.typeID == 2 || Template.typeID == 3)
                        {
                            _Room._sqItemHeight[jX, jY] = H + Template.Height;
                            _Room._sqItemRot[jX, jY] = Z;
                            _Room.refreshCoord(jX, jY);
                        }
                        else if (Template.typeID == 4)
                            _Room._sqItemHeight[jX, jY] = H;
                    }
                }
            }
            catch { }
        }

        internal bool containsItem(int itemID)
        {
            return _Items.ContainsKey(itemID);
        }
        internal FloorItem getItem(int itemID)
        {
            return (FloorItem)_Items[itemID];
        }
    }
}
