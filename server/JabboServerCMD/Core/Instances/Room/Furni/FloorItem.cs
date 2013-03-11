using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace JabboServerCMD.Core.Instances.Room.Items
{
    public class FloorItem
    {
        internal int ID;
        internal int TypeDBID;

        internal int X;
        internal int Y;
        internal int Z;

        internal int H;

        internal string Var;

        public FloorItem(int ID, int TypeDBID, int X, int Y, int Z, int H, string Var)
        {
            this.ID = ID;
            this.TypeDBID = TypeDBID;

            this.X = X;
            this.Y = Y;
            this.Z = Z;

            this.H = H;

            this.Var = Var;
        }
    }
}
