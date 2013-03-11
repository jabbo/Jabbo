using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace JabboServerCMD.Core.Instances.Room.Furni
{
    /*/// <summary>
    /// Interfaces with a heightmap manager.
    /// </summary>
    public interface IHeightmapManager
    {
        /// <summary>
        /// Gets the holes map for this heightmap.
        /// </summary>
        string[] HolesMap { get; }

        /// <summary>
        /// Gets the heightmap string for this heightmap.
        /// </summary>
        string HeightmapString { get; }

        /// <summary>
        /// Gets the unit mapping for this room.
        /// </summary>
        List<IAvatar>[,] UnitMap { get; }

        /// <summary>
        /// Gets the tile heightmapping for this room.
        /// </summary>
        int[,] HeightMap { get; }

        /// <summary>
        /// Gets the tile state mapping.
        /// </summary>
        TileState[,] StateMap { get; }

        /// <summary>
        /// Gets the item stack mapping.
        /// </summary>
        List<IFurni>[,] ItemStackMap { get; }

        /// <summary>
        /// Gets the array of reserved tiles.
        /// </summary>
        bool[,] ReservedMap { get; }

        /// <summary>
        /// Gets the cols of this room.
        /// </summary>
        int Cols { get; }

        /// <summary>
        /// Gets the rows of this room.
        /// </summary>
        int Rows { get; }

        /// <summary>
        /// Should initialise this heightmap manager, loading the heightmap.
        /// </summary>
        void Initialise();

        /// <summary>
        /// Finds if a point is within this room.
        /// </summary>
        /// <param name="X">The x coordinate.</param>
        /// <param name="Y">The y coordinate.</param>
        /// <returns>True if the point is within the room.</returns>
        bool WithinRoom(int X, int Y);

        /// <summary>
        /// Creates a grid for the specified avatar.
        /// </summary>
        /// <param name="Avatar">The avatar to create the heightmap for.</param>
        /// <returns>The heightmap grid.</returns>
        byte[,] GenerateGrid(IAvatar Avatar);
    }

    /// <summary>
    /// Represents a tile state in a statemap.
    /// </summary>
    public enum TileState
    {
        /// <summary>
        /// Tile tile is free.
        /// </summary>
        Open,

        /// <summary>
        /// The tile has a user or furni on it.
        /// </summary>
        Blocked,

        /// <summary>
        /// The tile can be sat on.
        /// </summary>
        Seat
    }*/
}
