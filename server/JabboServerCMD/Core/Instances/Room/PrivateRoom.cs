using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

using JabboServerCMD.Core.Instances.Room.Users;
using JabboServerCMD.Core.Instances.User;
using JabboServerCMD.Core.Systems;
using JabboServerCMD.Core.Instances.Room.Furni;
using JabboServerCMD.Core.Managers;
using JabboServerCMD.Core.Instances.Room.Pathfinding;
using JabboServerCMD.Core.Sockets.Packets.Game;

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Schema;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Utilities;

namespace JabboServerCMD.Core.Instances.Room
{
    public class PrivateRoom : Room
    {
        private Thread statusHandler;
        private Thread botThread;

        public PrivateRoom(int RoomID)
        {
            string[] roomData = MySQL.runReadRow("SELECT name, descr, owner, mode, floor, wall, door, lang, breed, holes, score, max FROM rooms WHERE id = '" + RoomID + "'");
            this.RoomID = RoomID;
            this.RoomName = roomData[0];
            this.RoomDescr = roomData[1];
            this.RoomOwner = int.Parse(roomData[2]);
            this.RoomOwnerName = MySQL.runRead("SELECT username FROM members WHERE id = '" + this.RoomOwner + "'");
            this.RoomSize = roomData[3];
            this.floorType = int.Parse(roomData[4]);
            this.wallType = int.Parse(roomData[5]);
            this.door = roomData[6];
            this.door_x = int.Parse(this.door.Split('_')[0]) - 1;
            this.door_y = int.Parse(this.door.Split('_')[1]) - 1;
            this.lang = int.Parse(roomData[7]);
            this.breed = int.Parse(roomData[8]);
            this.holes = roomData[9].Split(';');
            this.score = int.Parse(roomData[10]);
            this.max_users = int.Parse(roomData[11]);
            this.doorstep_x = 0;
            this.doorstep_y = 0;
            this.door_dir = 0;

            this.furniture = new Hashtable();

            setHeightmapping();
            loadFurni();

            statusHandler = new Thread(new ThreadStart(DoEvents));
            statusHandler.Start();

            botThread = new Thread(new ThreadStart(botHandler));
            botThread.Start();

            loadRoomBots();
        }

        public override void loadRoomPacket(ConnectedUser user)
        {
            int votedCheck = int.Parse(MySQL.runRead("SELECT count(user) FROM room_votes WHERE user='" + user._UserID + "' AND room='" + RoomID + "'"));
            if (votedCheck > 0)
            {
                user._Room_Voted = true;
            }
            else
            {
                user._Room_Voted = false;
            }
            if (user._UserID == RoomOwner)
            {
                user._Room_Voted = true;
            }
            FurniturePacket[] Items = new FurniturePacket[furniture.Count];
            int i = 0;
            foreach (Item itm in furniture.Values)
            {
                FurniturePacket getf = new FurniturePacket();
                getf.I = itm.id;
                getf.T = itm.tile;
                getf.S = itm.stacknr;
                getf.SH = itm.stackheight;
                getf.H = itm.turn;
                getf.A = itm.action;
                getf.F = itm.furni;
                Items[i] = getf;
                i++;
            }
            RoomLoadDataPacket rd = new RoomLoadDataPacket();
            rd.I = RoomID;
            rd.N = RoomName;
            rd.D = RoomDescr;
            rd.O = RoomOwner;
            rd.ON = RoomOwnerName;
            rd.Fl = floorType;
            rd.Wl = wallType;
            rd.L = lang;
            rd.B = breed;
            rd.Do = door;
            rd.M = RoomSize;
            rd.R = user._HasRights;
            rd.H = holes;
            rd.V = user._Room_Voted;
            rd.S = score;
            rd.F = Items;
            
            string ItemsData = JsonConvert.SerializeObject(rd);
            user.sendData("041" + ItemsData + "#");
        }

        internal void loadFurni()
        {
            List<List<string>> fieldValues = MySQL.readArray("SELECT id, owner, room, tile, stacknr, stackheight, turn, action, furni, tradeable FROM items WHERE room='" + RoomID + "'");
            for (int i = 0; i < fieldValues.Count; i++)
            {
                var thisField = fieldValues[i].ToArray();
                try
                {
                    // think about poster compability here!
                    //int X = int.Parse(thisField[3].Split('_')[0]) - 1;
                    //int Y = int.Parse(thisField[3].Split('_')[1]) - 1;
                    // _sqStack[X, Y].Add(Item);

                    furniture.Add(int.Parse(thisField[0]), new Item(int.Parse(thisField[0]), int.Parse(thisField[1]), int.Parse(thisField[2]), thisField[3], int.Parse(thisField[4]), int.Parse(thisField[5]), int.Parse(thisField[6]), int.Parse(thisField[7]), thisField[8], int.Parse(thisField[9])));
                }
                catch
                {
                    Console.WriteLine("ERROR: UNABLE TO PLACE ITEM!");
                }
            }
            updateHeightmapping();
        }

        internal void loadRoomBots()
        {
            List<List<string>> fieldValues = MySQL.readArray("SELECT id FROM roombots WHERE roomid='" + RoomID + "'");
            for (int i = 0; i < fieldValues.Count; i++)
            {
                var thisField = fieldValues[i].ToArray();
                try
                {
                    int botID = ++botAmount;
                    RoomBot roomBot = new RoomBot(this, botID, int.Parse(thisField[0]));
                    this._Bots.Add(botID, roomBot);
                    if (!roomBot.startDoor)
                    {
                        _sqUnit[roomBot._MyX, roomBot._MyY] = true;
                    }
                }
                catch
                {
                    Console.WriteLine("ERROR: UNABLE TO LOAD ROOMBOT!");
                }
            }
            updateHeightmapping();
        }

        public void setHeightmapping()
        {
            int colX = breed;
            int colY = lang;

            _sqUnit = new bool[colX, colY]; // the avatars
            _sqHeight = new byte[colX, colY];
            _sqRot = new byte[colX, colY];
            _sqTile = new string[colX, colY];
            _sqState = new squareState[colX, colY];
            _sqStack = new ItemStack[colX, colY];

            bool deurgeweest = false;
            for (int y = 0; y < colY; y++)
            {
                for (int x = 0; x < colX; x++)
                {
                    _sqStack[x, y] = new ItemStack();
                    _sqUnit[x, y] = false;
                    _sqRot[x, y] = 0;
                    _sqTile[x, y] = (x + 1) + "_" + (y + 1);
                    _sqState[x, y] = squareState.Open;

                    try { _sqHeight[x, y] = byte.Parse("0"); }
                    catch { }

                    if (!holes.Contains((x+1)+"_"+(y+1)))
                    {
                        if (x == door_x && (y - 1) == door_y && !deurgeweest)
                        {
                            doorstep_x = x;
                            doorstep_y = y;
                            door_dir = 1;
                            deurgeweest = true;
                        }
                        if ((x - 1) == door_x && y == door_y && !deurgeweest)
                        {
                            doorstep_x = x;
                            doorstep_y = y;
                            door_dir = 2;
                            deurgeweest = true;
                        }
                    }
                }
            }

            foreach (string hole in holes)
            {
                if (hole != "")
                {
                    int X = int.Parse(hole.Split('_')[0]) - 1;
                    int Y = int.Parse(hole.Split('_')[1]) - 1;

                    _sqState[X, Y] = squareState.Blocked;
                    _sqStack[X, Y] = null;
                }
            }
        }

        public void updateHeightmapping()
        {
            _sqHeight = new byte[breed, lang];
            _sqRot = new byte[breed, lang];
            _sqTile = new string[breed, lang];
            _sqState = new squareState[breed, lang];
            _sqStack = new ItemStack[breed, lang];

            for (int y = 0; y < lang; y++)
            {
                for (int x = 0; x < breed; x++)
                {
                    _sqStack[x, y] = new ItemStack();
                    _sqState[x, y] = squareState.Open;
                    try { _sqHeight[x, y] = byte.Parse("0"); }
                    catch { }
                    _sqRot[x, y] = 0;
                    _sqTile[x, y] = (x+1)+"_"+(y+1);
                }
            }
            foreach (string hole in holes)
            {
                if (hole != "")
                {
                    int X = int.Parse(hole.Split('_')[0]) - 1;
                    int Y = int.Parse(hole.Split('_')[1]) - 1;

                    _sqState[X, Y] = squareState.Blocked;
                    _sqStack[X, Y] = null;
                }
            }

            foreach (Item itm in furniture.Values)
            {
                CatalogueManager.ItemTemplate furniTemplate = CatalogueManager.getTemplate(itm.furni);
                if (furniTemplate.soort != "poster" && furniTemplate.soort != "tapijt")
                {
                    int X = int.Parse(itm.tile.Split('_')[0]) - 1;
                    int Y = int.Parse(itm.tile.Split('_')[1]) - 1;
                    int lengte = 0;
                    int breedte = 0;
                    bool door = false;
                    if (furniTemplate.soort == "poort" && itm.action == 1)
                    {
                        door = true;
                    }
                    switch (itm.turn)
                    {
                        case 1:
                            lengte = furniTemplate.lang;
                            breedte = furniTemplate.breed;
                            break;
                        case 2:
                            lengte = furniTemplate.breed;
                            breedte = furniTemplate.lang;
                            break;
                        case 3:
                            lengte = furniTemplate.lang;
                            breedte = furniTemplate.breed;
                            break;
                        case 4:
                            lengte = furniTemplate.breed;
                            breedte = furniTemplate.lang;
                            break;
                    }
                    for (int i1 = 0; i1 < lengte; i1++)
                    {
                        for (int i2 = 0; i2 < breedte; i2++)
                        {
                            try
                            {
                                if (door)
                                {
                                    _sqState[(X - i1), (Y + i2)] = squareState.Door;
                                }
                                else if (furniTemplate.soort == "stoel")
                                {
                                    _sqState[(X - i1), (Y + i2)] = squareState.Seat;
                                }
                                else
                                {
                                    _sqState[(X - i1), (Y + i2)] = squareState.Blocked;
                                }
                                _sqRot[(X - i1), (Y + i2)] = byte.Parse(itm.turn.ToString());
                                _sqTile[(X - i1), (Y + i2)] = itm.tile;
                            }
                            catch { }
                        }
                    }
                }
            }
        }

        public List<Point> getCurrentTiles(Item furniData, bool inRoom)
        {
            CatalogueManager.ItemTemplate furniTemplate = CatalogueManager.getTemplate(furniData.furni);
            List<Point> currentTiles = new List<Point>();
            if (inRoom)
            {
                int currentX = int.Parse(furniData.tile.Split('_')[0]) - 1;
                int currentY = int.Parse(furniData.tile.Split('_')[1]) - 1;
                int currentLengte = 0;
                int currentBreedte = 0;
                switch (furniData.turn)
                {
                    case 1:
                        currentLengte = furniTemplate.lang;
                        currentBreedte = furniTemplate.breed;
                        break;
                    case 2:
                        currentLengte = furniTemplate.breed;
                        currentBreedte = furniTemplate.lang;
                        break;
                    case 3:
                        currentLengte = furniTemplate.lang;
                        currentBreedte = furniTemplate.breed;
                        break;
                    case 4:
                        currentLengte = furniTemplate.breed;
                        currentBreedte = furniTemplate.lang;
                        break;
                }
                for (int i1 = 0; i1 < currentLengte; i1++)
                {
                    for (int i2 = 0; i2 < currentBreedte; i2++)
                    {
                        currentTiles.Add(new Point((currentX - i1), (currentY + i2)));
                    }
                }
            }
            return currentTiles;
        }

        public string furniPlaceable(Item furniData, int[] tile, int turn, int lang, int breed, bool inRoom, List<Point> currentTiles)
        {
            CatalogueManager.ItemTemplate furniTemplate = CatalogueManager.getTemplate(furniData.furni);
            
            int free = 0;
		    int used = 0;
		    int stack = 0;
            int lengte = 0;
            int breedte = 0;
		    switch(turn) {
		    case 1:
			    lengte = lang;
			    breedte = breed;
			    break;
		    case 2:
			    lengte = breed;
			    breedte = lang;
		    break;
		    case 3:
			    lengte = lang;
			    breedte = breed;
		    break;
		    case 4:
			    lengte = breed;
			    breedte = lang;
		    break;
		    }
		    for (int i1 = 0; i1 < lengte; i1++)
            {
			    for (int i2 = 0; i2 < breedte; i2++)
                {
                    int X = tile[0]-i1;
                    int Y = tile[1]+i2;
                    if (currentTiles.Contains(new Point(X, Y)))
                    {
                        // this is one of the current tiles!
                        free++;
                    }
                    else
                    {
                        try
                        {
                            if (furniTemplate.soort != "tapijt")
                            {
                                if (_sqUnit[X, Y] != true)
                                {
                                    switch (_sqState[X, Y])
                                    {
                                        case squareState.Open: // free
                                            free++;
                                            break;
                                        case squareState.Blocked: // used
                                            used++;
                                            break;
                                        case squareState.Stackable: // stackable
                                            stack++;
                                            break;
                                        case squareState.Seat: // chair
                                            used++; // chairs are never stackable anyway
                                            break;
                                        case squareState.Door: // door
                                            used++; // doors are never stackable anyway
                                            break;
                                    }
                                }
                                else
                                {
                                    used++; // avatar!
                                }
                            }
                            else
                            {
                                if (!holes.Contains((X + 1) + "_" + (Y + 1)))
                                {
                                    free++;
                                }
                                else
                                {
                                    used++;
                                }
                            }
                        }
                        catch
                        {
                            used++; // tile does not even exist (or errors), make sure furniture is not placed!!
                        }
                    }    
			    }
		    }
            string answer;
            if (used == 0)
            {
                // none are marked 'used', let's check for stackable and free tiles
                if (stack != 0)
                {
                    // some tiles are stackable, whilst all other are free -> stacking time!
                    answer = "stack";
                }
                else
                {
                    // all tiles are free -> normal placement
                    answer = "free";
                }
            }
            else
            {
                // some are marked 'used', furniture cannot be moved
                answer = "used";
            }
		    return answer;
        }

        public override void doFurni(ConnectedUser user, int id, string tile)
        {
            bool inRoom = false;
            bool donating = false;
            Item furniData;
            if (furniture.ContainsKey(id))
            {
                furniData = getItem(id);
                inRoom = true;
            }
            else
            {
                 string[] data = MySQL.runReadRow("SELECT owner, room, tile, stacknr, stackheight, turn, action, furni, tradeable FROM items WHERE id = '" + id + "'");
                 furniData = new Item(id, int.Parse(data[0]), int.Parse(data[1]), data[2], int.Parse(data[3]), int.Parse(data[4]), int.Parse(data[5]), int.Parse(data[6]), data[7], int.Parse(data[8]));
            }
            CatalogueManager.ItemTemplate furniTemplate = CatalogueManager.getTemplate(furniData.furni);
            if (user._HasRights)
            {
                List<Point> currentTiles;
                if (furniTemplate.soort != "poster")
                {
                    currentTiles = getCurrentTiles(furniData, inRoom);
                }
                else
                {
                    currentTiles = new List<Point>();
                }
                if (tile == "inv")
                {
                    if (RoomOwner == user._UserID || RankManager.containsRight(user._Rank, "always_pickup"))
                    {
                        // check if it's the room, otherwise: remove from hashtable!
                        if (inRoom)
                        {
                            // remove from room
                            furniture.Remove(id);
                            MySQL.runQuery("UPDATE items SET owner='" + user._UserID + "', room='0', tile='" + tile + "', stacknr='1', stackheight='0', turn='1', action='0' WHERE id='" + id + "'");
                            if (RoomOwner != user._UserID)
                            {
                                MySQL.runQuery("INSERT INTO furni_history SET id='" + id + "', `date`='" + timestamp.get + "', `type`='take', `from`='" + RoomOwner + "', `to`='" + user._UserID + "', credits='0';");
                            }
                            updateHeightmapping();

                            FurniturePacket movePacket = new FurniturePacket();
                            movePacket.I = furniData.id;
                            movePacket.T = tile;
                            movePacket.S = 1;
                            movePacket.SH = 0;
                            movePacket.H = 1;
                            movePacket.A = 0;
                            movePacket.F = furniData.furni;
                            string movePacketString = JsonConvert.SerializeObject(movePacket);
                            user.sendData("047" + movePacketString + "#");

                            FurnitureRemovePacket removePacket = new FurnitureRemovePacket();
                            removePacket.I = furniData.id;
                            string removePacketString = JsonConvert.SerializeObject(removePacket);
                            sendDataButNotTo(user, "048" + removePacketString + "#");

                            // chair stuff
                            if (furniTemplate.soort == "stoel")
                            {
                                StringBuilder sendText = new StringBuilder();
                                for (int i = 0; i < currentTiles.Count; i++)
                                {
                                    Point thisTile = currentTiles[i];
                                    if (_sqUnit[thisTile.X, thisTile.Y] == true)
                                    {
                                        foreach (ConnectedUser seatUser in _Users.Values)
                                        {
                                            if (seatUser._Room_X == thisTile.X && seatUser._Room_Y == thisTile.Y)
                                            {
                                                seatUser._Room_Sit = "";
                                                SetSitPacket setSit = new SetSitPacket();
                                                setSit.I = seatUser._UserID;
                                                setSit.S = seatUser._Room_Sit;
                                                string SetSitPacket = JsonConvert.SerializeObject(setSit);
                                                sendText.Append("080");
                                                sendText.Append(SetSitPacket);
                                                sendText.Append("#");
                                            }
                                        }
                                    }
                                }
                                string sendTextString = sendText.ToString();
                                if (sendTextString != "")
                                {
                                    foreach (ConnectedUser usr in _Users.Values)
                                    {
                                        usr.sendData(sendTextString);
                                    }
                                }
                            }
                        }
                    }
                }
                else
                {
                    if (inRoom || furniData.owner == user._UserID)
                    {
                        // moving or placing in room, not putting in inventory
                        if (!inRoom && furniData.owner == user._UserID && RoomOwner != user._UserID)
                        {
                            donating = true;
                        }
                        if (donating && furniData.tradeable == 0)
                        {
                            // not tradeable
                            user.sendData(user.notify(TextsManager.get("untradeable"), TextsManager.get("notify_default")));
                        }
                        else
                        {
                            if (furniTemplate.soort != "poster")
                            {
                                int X = int.Parse(tile.Split('_')[0]) - 1;
                                int Y = int.Parse(tile.Split('_')[1]) - 1;
                                string check = furniPlaceable(furniData, new int[] { X, Y }, furniData.turn, furniTemplate.lang, furniTemplate.breed, inRoom, currentTiles);
                                if (check == "free")
                                {
                                    furniData.tile = tile;
                                    if (!inRoom)
                                    {
                                        furniture.Add(id, furniData);
                                    }
                                    else
                                    {
                                        furniture[id] = furniData; // update hashtable
                                    }
                                    MySQL.runQuery("UPDATE items SET owner='" + RoomOwner + "', room='" + RoomID + "', tile='" + tile + "' WHERE id='" + id + "'");
                                    if (donating)
                                    {
                                        MySQL.runQuery("INSERT INTO furni_history SET id='" + id + "', `date`='" + timestamp.get + "', `type`='don', `from`='" + user._UserID + "', `to`='" + RoomOwner + "', credits='0';");
                                    }

                                    updateHeightmapping();

                                    FurniturePacket movepacket = new FurniturePacket();
                                    movepacket.I = furniData.id;
                                    movepacket.T = furniData.tile;
                                    movepacket.S = furniData.stacknr;
                                    movepacket.SH = furniData.stackheight;
                                    movepacket.H = furniData.turn;
                                    movepacket.A = furniData.action;
                                    movepacket.F = furniData.furni;
                                    string movepacketstring = JsonConvert.SerializeObject(movepacket);
                                    foreach (ConnectedUser usr in _Users.Values)
                                    {
                                        usr.sendData("047" + movepacketstring + "#");
                                    }

                                    // chair stuff
                                    if (furniTemplate.soort == "stoel" && inRoom)
                                    {
                                        StringBuilder sendText = new StringBuilder();
                                        for (int i = 0; i < currentTiles.Count; i++)
                                        {
                                            Point thisTile = currentTiles[i];
                                            if (_sqUnit[thisTile.X, thisTile.Y] == true)
                                            {
                                                foreach (ConnectedUser seatUser in _Users.Values)
                                                {
                                                    if (seatUser._Room_X == thisTile.X && seatUser._Room_Y == thisTile.Y)
                                                    {
                                                        if (_sqState[seatUser._Room_X, seatUser._Room_Y] == squareState.Seat)
                                                        {
                                                            seatUser._Room_Dir = _sqRot[seatUser._Room_X, seatUser._Room_Y] * 2;
                                                            seatUser._Room_Sit = seatUser._Room_Dir.ToString() + "|" + _sqTile[seatUser._Room_X, seatUser._Room_Y];
                                                        }
                                                        else
                                                        {
                                                            seatUser._Room_Sit = "";
                                                        }
                                                        SetSitPacket setSit = new SetSitPacket();
                                                        setSit.I = seatUser._UserID;
                                                        setSit.S = seatUser._Room_Sit;
                                                        string SetSitPacket = JsonConvert.SerializeObject(setSit);
                                                        sendText.Append("080");
                                                        sendText.Append(SetSitPacket);
                                                        sendText.Append("#");
                                                    }
                                                }
                                            }
                                        }
                                        string sendTextString = sendText.ToString();
                                        if (sendTextString != "")
                                        {
                                            foreach (ConnectedUser usr in _Users.Values)
                                            {
                                                usr.sendData(sendTextString);
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                if (!inRoom) // only place and pickup poster, don't move them
                                {
                                    string coords = tile.Split('@')[0];
                                    int X = int.Parse(coords.Split('|')[0]);
                                    int Y = int.Parse(coords.Split('|')[1]);
                                    int H = int.Parse(tile.Split('@')[1]);

                                    furniData.tile = coords;
                                    furniData.turn = H;
                                    furniture.Add(id, furniData);

                                    MySQL.runQuery("UPDATE items SET owner='" + RoomOwner + "', room='" + RoomID + "', tile='" + coords + "', turn='" + H + "' WHERE id='" + id + "'");
                                    if (donating)
                                    {
                                        MySQL.runQuery("INSERT INTO furni_history SET id='" + id + "', `date`='" + timestamp.get + "', `type`='don', `from`='" + user._UserID + "', `to`='" + RoomOwner + "', credits='0';");
                                    }

                                    FurniturePacket movepacket = new FurniturePacket();
                                    movepacket.I = furniData.id;
                                    movepacket.T = furniData.tile;
                                    movepacket.S = furniData.stacknr;
                                    movepacket.SH = furniData.stackheight;
                                    movepacket.H = furniData.turn;
                                    movepacket.A = furniData.action;
                                    movepacket.F = furniData.furni;
                                    string movepacketstring = JsonConvert.SerializeObject(movepacket);
                                    foreach (ConnectedUser usr in _Users.Values)
                                    {
                                        usr.sendData("047" + movepacketstring + "#");
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        public override void turnFurni(ConnectedUser user, int id)
        {
            if (furniture.ContainsKey(id) && user._HasRights)
            {
                Item furniData = getItem(id);
                CatalogueManager.ItemTemplate furniTemplate = CatalogueManager.getTemplate(furniData.furni);
                if (furniData.tile != "inv" && furniTemplate.soort != "poster")
                {
                    int turns = furniTemplate.afb;
                    int turnNow = furniData.turn;
                    int turnNext = turnNow;
                    if (furniTemplate.soort == "stoel" && turns == 1)
                    {
                        turns = 4;
                    }
                    if (turnNow == turns)
                    {
                        turnNext = 1;
                    }
                    else
                    {
                        turnNext = turnNow + 1;
                    }
                    int X = int.Parse(furniData.tile.Split('_')[0]) - 1;
                    int Y = int.Parse(furniData.tile.Split('_')[1]) - 1;
                    List<Point> currentTiles = getCurrentTiles(furniData, true);
                    string check = furniPlaceable(furniData, new int[] { X, Y }, turnNext, furniTemplate.lang, furniTemplate.breed, true, currentTiles);
                    if (check == "free")
                    {
                        furniData.turn = turnNext;
                        furniture[id] = furniData; // update hashtable
                        MySQL.runQuery("UPDATE items SET turn='" + turnNext + "' WHERE id='" + id + "'");
                        updateHeightmapping();

                        FurniturePacket movepacket = new FurniturePacket();
                        movepacket.I = furniData.id;
                        movepacket.T = furniData.tile;
                        movepacket.S = furniData.stacknr;
                        movepacket.SH = furniData.stackheight;
                        movepacket.H = furniData.turn;
                        movepacket.A = furniData.action;
                        movepacket.F = furniData.furni;
                        string movepacketstring = JsonConvert.SerializeObject(movepacket);
                        foreach (ConnectedUser usr in _Users.Values)
                        {
                            usr.sendData("047" + movepacketstring + "#");
                        }
                    }
                    // chair stuff
                    if (furniTemplate.soort == "stoel")
                    {
                        StringBuilder sendText = new StringBuilder();
                        for (int i = 0; i < currentTiles.Count; i++)
                        {
                            Point thisTile = currentTiles[i];
                            if (_sqUnit[thisTile.X, thisTile.Y] == true)
                            {
                                foreach (ConnectedUser seatUser in _Users.Values)
                                {
                                    if (seatUser._Room_X == thisTile.X && seatUser._Room_Y == thisTile.Y)
                                    {
                                        if (_sqState[seatUser._Room_X, seatUser._Room_Y] == squareState.Seat)
                                        {
                                            seatUser._Room_Dir = _sqRot[seatUser._Room_X, seatUser._Room_Y] * 2;
                                            seatUser._Room_Sit = seatUser._Room_Dir.ToString() + "|" + _sqTile[seatUser._Room_X, seatUser._Room_Y];
                                        }
                                        else
                                        {
                                            seatUser._Room_Sit = "";
                                        }
                                        SetSitPacket setSit = new SetSitPacket();
                                        setSit.I = seatUser._UserID;
                                        setSit.S = seatUser._Room_Sit;
                                        string SetSitPacket = JsonConvert.SerializeObject(setSit);
                                        sendText.Append("080");
                                        sendText.Append(SetSitPacket);
                                        sendText.Append("#");
                                    }
                                }
                            }
                        }
                        string sendTextString = sendText.ToString();
                        if (sendTextString != "")
                        {
                            foreach (ConnectedUser usr in _Users.Values)
                            {
                                usr.sendData(sendTextString);
                            }
                        }
                    }
                }
            }
        }

        public override void actionFurni(ConnectedUser user, int id)
        {
            if (furniture.ContainsKey(id) && user._HasRights)
            {
                Item furniData = getItem(id);
                CatalogueManager.ItemTemplate furniTemplate = CatalogueManager.getTemplate(furniData.furni);
                if (furniData.tile != "inv" && furniTemplate.action == 1)
                {
                    // don't close door while an avatar is still in it!
                    bool usersInDoor = false;
                    if (furniTemplate.soort == "poort")
                    {
                        int X = int.Parse(furniData.tile.Split('_')[0]) - 1;
                        int Y = int.Parse(furniData.tile.Split('_')[1]) - 1;
                        int lengte = 0;
                        int breedte = 0;
		                switch(furniData.turn) {
		                case 1:
			                lengte = furniTemplate.lang;
			                breedte = furniTemplate.breed;
			                break;
		                case 2:
			                lengte = furniTemplate.breed;
			                breedte = furniTemplate.lang;
		                break;
		                case 3:
			                lengte = furniTemplate.lang;
			                breedte = furniTemplate.breed;
		                break;
		                case 4:
			                lengte = furniTemplate.breed;
			                breedte = furniTemplate.lang;
		                break;
		                }
                        for (int i1 = 0; i1 < lengte; i1++)
                        {
                            for (int i2 = 0; i2 < breedte; i2++)
                            {
                                int thisX = X - i1;
                                int thisY = Y + i2;
                                if (_sqUnit[thisX, thisY])
                                {
                                    usersInDoor = true;
                                }
                            }
                        }
                    }

                    if (!usersInDoor)
                    {
                        int actionNext = 0;
                        if (furniData.action == 1)
                        {
                            actionNext = 0;
                        }
                        else
                        {
                            actionNext = 1;
                        }
                        furniData.action = actionNext;
                        furniture[id] = furniData; // update hashtable
                        MySQL.runQuery("UPDATE items SET action='" + actionNext + "' WHERE id='" + id + "'");
                        updateHeightmapping();

                        FurniturePacket movepacket = new FurniturePacket();
                        movepacket.I = furniData.id;
                        movepacket.T = furniData.tile;
                        movepacket.S = furniData.stacknr;
                        movepacket.SH = furniData.stackheight;
                        movepacket.H = furniData.turn;
                        movepacket.A = furniData.action;
                        movepacket.F = furniData.furni;
                        string movepacketstring = JsonConvert.SerializeObject(movepacket);
                        foreach (ConnectedUser usr in _Users.Values)
                        {
                            usr.sendData("047" + movepacketstring + "#");
                        }
                    }
                }
            }
        }

        public override void pickAllUp(ConnectedUser user)
        {
            if (user._HasRights)
            {
                if (RoomOwner == user._UserID || RankManager.containsRight(user._Rank, "always_pickup"))
                {
                    List<int> removeIDs = new List<int>();
                    foreach (Item itm in furniture.Values)
                    {
                        removeIDs.Add(itm.id);
                    }
                    removeIDs.ToArray();
                    foreach (int furniID in removeIDs)
                    {
                        doFurni(user, furniID, "inv");
                    }
                }
            }
        }

        public void DoEvents()
        {
            while (true)
            {
                StringBuilder sendText = new StringBuilder();
                foreach (ConnectedUser user in _Users.Values)
                {
                    if (user._Room_X != user._Room_X_Target || user._Room_Y != user._Room_Y_Target)
                    {
                        int[] nextCoords;
                        bool walkDoor = false;

                        if (user._Room_X == door_x && user._Room_Y == door_y)
                        {
                            // first walk out of the door, then check if you can walk after that!
                            walkDoor = true;
                            if (user._Room_X_Target == doorstep_x && user._Room_Y_Target == doorstep_y)
                            {
                                // just come out of the door
                                squareState[,] stateMap = avatarStateMap(doorstep_x, doorstep_y);
                                if (stateMap[doorstep_x, doorstep_y] == squareState.Open && (!_sqUnit[doorstep_x, doorstep_y]))
                                {
                                    // doorstep is free
                                    nextCoords = new int[2];
                                    nextCoords[0] = doorstep_x;
                                    nextCoords[1] = doorstep_y;
                                }
                                else
                                {
                                    nextCoords = null;
                                }
                            }
                            else
                            {
                                PathFinderFast Pathfinder = new PathFinderFast(GenerateGrid(user._Room_X_Target, user._Room_Y_Target));
                                List<PathFinderNode> Path = Pathfinder.FindPath(new Point(doorstep_x, doorstep_y), new Point(user._Room_X_Target, user._Room_Y_Target));
                                if (Path == null || Path.Count == 0)
                                {
                                    nextCoords = null;
                                }
                                else
                                {
                                    // after coming out of your door you'll be able to walk
                                    squareState[,] stateMap = avatarStateMap(doorstep_x, doorstep_y);
                                    if (stateMap[doorstep_x, doorstep_y] == squareState.Open && (!_sqUnit[doorstep_x, doorstep_y]))
                                    {
                                        // doorstep is free
                                        nextCoords = new int[2];
                                        nextCoords[0] = doorstep_x;
                                        nextCoords[1] = doorstep_y;
                                    }
                                    else
                                    {
                                        nextCoords = null;
                                    }
                                }
                            }
                        }
                        else
                        {
                            PathFinderFast Pathfinder = new PathFinderFast(GenerateGrid(user._Room_X_Target, user._Room_Y_Target));
                            List<PathFinderNode> Path = Pathfinder.FindPath(new Point(user._Room_X, user._Room_Y), new Point(user._Room_X_Target, user._Room_Y_Target));
                            if (Path == null || Path.Count == 0)
                            {
                                nextCoords = null;
                            }
                            else
                            {
                                PathFinderNode NextPosition = Path[Path.Count - 2];
                                nextCoords = new int[2];
                                nextCoords[0] = NextPosition.X;
                                nextCoords[1] = NextPosition.Y;
                            }
                        }

                        if (nextCoords == null)
                        {
                            user._Room_Sit = "";
                            user._Room_X_Target = user._Room_X;
                            user._Room_Y_Target = user._Room_Y;
                            StopAvatarPacket stopMove = new StopAvatarPacket();
                            stopMove.I = user._UserID;
                            string stopMovePacket = JsonConvert.SerializeObject(stopMove);
                            sendText.Append("064");
                            sendText.Append(stopMovePacket);
                            sendText.Append("#");
                        }
                        else
                        {
                            int nextX = nextCoords[0];
                            int nextY = nextCoords[1];
                            squareState nextState = _sqState[nextX, nextY];

                            if (!walkDoor)
                            {
                                _sqUnit[user._Room_X, user._Room_Y] = false;
                            }
                            _sqUnit[nextX, nextY] = true;

                            double nextHeight = 0;
                            nextHeight = (double)_sqHeight[nextX, nextY];

                            // dir eerst!
                            user._Room_Dir = getNewDir(user._Room_X, user._Room_Y, nextX, nextY);
                            user._Room_X = nextX;
                            user._Room_Y = nextY;
                            user._Room_Z = (int)nextHeight;
                            
                            if (nextState == squareState.Seat)
                            {
                                // Do Sit
                                MoveAvatarPacket mvpack = new MoveAvatarPacket();
                                mvpack.I = user._UserID;
                                mvpack.X = nextX;
                                mvpack.Y = nextY;
                                mvpack.H = user._Room_Dir;
                                string stringmvpack = JsonConvert.SerializeObject(mvpack);
                                sendText.Append("057");
                                sendText.Append(stringmvpack);
                                sendText.Append("#");

                                if (user._Room_X == user._Room_X_Target && user._Room_Y == user._Room_Y_Target)
                                {
                                    user._Room_Dir = _sqRot[user._Room_X, user._Room_Y] * 2;
                                    user._Room_Sit = user._Room_Dir.ToString() + "|" + _sqTile[user._Room_X, user._Room_Y];
                                    StopAvatarPacket stopMove = new StopAvatarPacket();
                                    stopMove.I = user._UserID;
                                    string stopMovePacket = JsonConvert.SerializeObject(stopMove);
                                    sendText.Append("064");
                                    sendText.Append(stopMovePacket);
                                    sendText.Append("#");

                                    SetSitPacket setSit = new SetSitPacket();
                                    setSit.I = user._UserID;
                                    setSit.S = user._Room_Sit;
                                    string SetSitPacket = JsonConvert.SerializeObject(setSit);
                                    sendText.Append("081");
                                    sendText.Append(SetSitPacket);
                                    sendText.Append("#");
                                }
                            }
                            else
                            {
                                user._Room_Sit = "";

                                MoveAvatarPacket mvpack = new MoveAvatarPacket();
                                mvpack.I = user._UserID;
                                mvpack.X = nextX;
                                mvpack.Y = nextY;
                                mvpack.H = user._Room_Dir;
                                string stringmvpack = JsonConvert.SerializeObject(mvpack);
                                sendText.Append("057");
                                sendText.Append(stringmvpack);
                                sendText.Append("#");

                                if (user._Room_X == user._Room_X_Target && user._Room_Y == user._Room_Y_Target)
                                {
                                    StopAvatarPacket stopMove = new StopAvatarPacket();
                                    stopMove.I = user._UserID;
                                    string stopMovePacket = JsonConvert.SerializeObject(stopMove);
                                    sendText.Append("064");
                                    sendText.Append(stopMovePacket);
                                    sendText.Append("#");
                                }
                            }
                        }
                    }
                }



                // BOTS
                try
                {
                    foreach (RoomBot bot in _Bots.Values)
                    {
                        if (bot._MyX != bot.targetX || bot._MyY != bot.targetY)
                        {
                            int[] nextCoords;
                            bool walkDoor = false;

                            if (bot._MyX == door_x && bot._MyY == door_y)
                            {
                                // first walk out of the door, then check if you can walk after that!
                                walkDoor = true;
                                if (bot.targetX == doorstep_x && bot.targetY == doorstep_y)
                                {
                                    // just come out of the door
                                    squareState[,] stateMap = avatarStateMap(doorstep_x, doorstep_y);
                                    if (stateMap[doorstep_x, doorstep_y] == squareState.Open && (!_sqUnit[doorstep_x, doorstep_y]))
                                    {
                                        // doorstep is free
                                        nextCoords = new int[2];
                                        nextCoords[0] = doorstep_x;
                                        nextCoords[1] = doorstep_y;
                                    }
                                    else
                                    {
                                        nextCoords = null;
                                    }
                                }
                                else
                                {
                                    PathFinderFast Pathfinder = new PathFinderFast(GenerateGrid(bot.targetX, bot.targetY));
                                    List<PathFinderNode> Path = Pathfinder.FindPath(new Point(doorstep_x, doorstep_y), new Point(bot.targetX, bot.targetY));
                                    if (Path == null || Path.Count == 0)
                                    {
                                        nextCoords = null;
                                    }
                                    else
                                    {
                                        // after coming out of your door you'll be able to walk
                                        squareState[,] stateMap = avatarStateMap(doorstep_x, doorstep_y);
                                        if (stateMap[doorstep_x, doorstep_y] == squareState.Open && (!_sqUnit[doorstep_x, doorstep_y]))
                                        {
                                            // doorstep is free
                                            nextCoords = new int[2];
                                            nextCoords[0] = doorstep_x;
                                            nextCoords[1] = doorstep_y;
                                        }
                                        else
                                        {
                                            nextCoords = null;
                                        }
                                    }
                                }
                            }
                            else
                            {
                                PathFinderFast Pathfinder = new PathFinderFast(GenerateGrid(bot.targetX, bot.targetY));
                                List<PathFinderNode> Path = Pathfinder.FindPath(new Point(bot._MyX, bot._MyY), new Point(bot.targetX, bot.targetY));
                                if (Path == null || Path.Count == 0)
                                {
                                    nextCoords = null;
                                }
                                else
                                {
                                    PathFinderNode NextPosition = Path[Path.Count - 2];
                                    nextCoords = new int[2];
                                    nextCoords[0] = NextPosition.X;
                                    nextCoords[1] = NextPosition.Y;
                                }
                            }
                            if (nextCoords == null)
                            {
                                if (bot.walking)
                                {
                                    bot._Sit = "";
                                    bot.targetX = bot._MyX;
                                    bot.targetY = bot._MyY;
                                    StopAvatarPacket stopMove = new StopAvatarPacket();
                                    stopMove.I = bot._MyAvatarID;
                                    string stopMovePacket = JsonConvert.SerializeObject(stopMove);
                                    sendText.Append("064");
                                    sendText.Append(stopMovePacket);
                                    sendText.Append("#");
                                    bot.walking = false;
                                }
                            }
                            else
                            {
                                bot.walking = true;
                                int nextX = nextCoords[0];
                                int nextY = nextCoords[1];
                                squareState nextState = _sqState[nextX, nextY];

                                if (!walkDoor)
                                {
                                    _sqUnit[bot._MyX, bot._MyY] = false;
                                }
                                _sqUnit[nextX, nextY] = true;

                                double nextHeight = 0;
                                nextHeight = (double)_sqHeight[nextX, nextY];

                                bot._MyZ = getNewDir(bot._MyX, bot._MyY, nextX, nextY);
                                bot._MyX = nextX;
                                bot._MyY = nextY;
                                //bot._MyZ = (int)nextHeight;

                                if (nextState == squareState.Seat)
                                {
                                    // Do Sit
                                    MoveAvatarPacket mvpack = new MoveAvatarPacket();
                                    mvpack.I = bot._MyAvatarID;
                                    mvpack.X = nextX;
                                    mvpack.Y = nextY;
                                    mvpack.H = bot._MyZ;
                                    string stringmvpack = JsonConvert.SerializeObject(mvpack);
                                    sendText.Append("057");
                                    sendText.Append(stringmvpack);
                                    sendText.Append("#");

                                    if (bot._MyX == bot.targetX && bot._MyY == bot.targetY)
                                    {
                                        bot._MyZ = _sqRot[bot._MyX, bot._MyY] * 2;
                                        bot._Sit = bot._MyZ.ToString() + "|" + _sqTile[bot._MyX, bot._MyY];
                                        StopAvatarPacket stopMove = new StopAvatarPacket();
                                        stopMove.I = bot._MyAvatarID;
                                        string stopMovePacket = JsonConvert.SerializeObject(stopMove);
                                        sendText.Append("064");
                                        sendText.Append(stopMovePacket);
                                        sendText.Append("#");

                                        SetSitPacket setSit = new SetSitPacket();
                                        setSit.I = bot._MyAvatarID;
                                        setSit.S = bot._Sit;
                                        string SetSitPacket = JsonConvert.SerializeObject(setSit);
                                        sendText.Append("081");
                                        sendText.Append(SetSitPacket);
                                        sendText.Append("#");
                                    }
                                }
                                else
                                {
                                    bot._Sit = "";
                                    MoveAvatarPacket mvpack = new MoveAvatarPacket();
                                    mvpack.I = bot._MyAvatarID;
                                    mvpack.X = nextX;
                                    mvpack.Y = nextY;
                                    mvpack.H = bot._MyZ;
                                    string stringmvpack = JsonConvert.SerializeObject(mvpack);
                                    sendText.Append("057");
                                    sendText.Append(stringmvpack);
                                    sendText.Append("#");

                                    if (bot._MyX == bot.targetX && bot._MyY == bot.targetY)
                                    {
                                        StopAvatarPacket stopMove = new StopAvatarPacket();
                                        stopMove.I = bot._MyAvatarID;
                                        string stopMovePacket = JsonConvert.SerializeObject(stopMove);
                                        sendText.Append("064");
                                        sendText.Append(stopMovePacket);
                                        sendText.Append("#");
                                        bot.walking = false;
                                    }
                                }
                            }
                        }
                    }

                }
                catch (Exception e)
                {
                    Console.WriteLine("BOTWALK ERROR: {0}", e);
                }
                string sendTextString = sendText.ToString();
                if (sendTextString != "")
                {
                    foreach (ConnectedUser usr in _Users.Values)
                    {
                        usr.sendData(sendTextString);
                    }
                }
                Thread.Sleep(480); // 480 milliseconds
            }
        }
        internal int getNewDir(int oldx, int oldy, int nextX, int nextY)
        {
            int newDir = 0;
            if (oldx == (nextX - 1) && oldy == (nextY - 1))
            {
                newDir = 3;
            }
            else if (oldx == (nextX - 1) && oldy == nextY)
            {
                newDir = 4;
            }
            else if (oldx == (nextX - 1) && oldy == (nextY + 1))
            {
                newDir = 5;
            }
            else if (oldx == nextX && oldy == (nextY + 1))
            {
                newDir = 6;
            }
            else if (oldx == (nextX + 1) && oldy == (nextY + 1))
            {
                newDir = 7;
            }
            else if (oldx == (nextX + 1) && oldy == nextY)
            {
                newDir = 8;
            }
            else if (oldx == (nextX + 1) && oldy == (nextY - 1))
            {
                newDir = 1;
            }
            else if (oldx == nextX && oldy == (nextY - 1))
            {
                newDir = 2;
            }
            return newDir;
        }

        public void botHandler()
        {
            while (true)
            {
                try
                {
                    List<string> possibleTiles = new List<string>();
                    for (int y = 0; y < lang; y++)
                    {
                        for (int x = 0; x < breed; x++)
                        {
                            if ((_sqState[x, y] == squareState.Open || _sqState[x, y] == squareState.Seat) && (!_sqUnit[x, y]))
                            {
                                possibleTiles.Add(x + "_" + y);
                            }
                        }
                    }
                    foreach (RoomBot bot in _Bots.Values)
                    {
                        if (bot._CanRoam && !bot.walking)
                        {
                            byte[] randomNumber = new byte[1];
                            System.Security.Cryptography.RNGCryptoServiceProvider Gen = new System.Security.Cryptography.RNGCryptoServiceProvider();
                            Gen.GetBytes(randomNumber);
                            int rand = Convert.ToInt32(randomNumber[0]);

                            Random random = new Random(rand);
                            if ((rand % 2) == 0)
                            {
                                string randTile = possibleTiles[random.Next(0, possibleTiles.Count - 1)];
                                bot.targetX = int.Parse(randTile.Split('_')[0]); ;
                                bot.targetY = int.Parse(randTile.Split('_')[1]);
                            }
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine("BOTTHREAD ERROR: {0}", e);
                }
                Thread.Sleep(4000);
            }
        }
    }
}
