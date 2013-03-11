using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.InteropServices;

namespace JabboServerCMD.Core.Instances.Room.Pathfinding
{
    public class PathFinderFast
    {
        [StructLayout(LayoutKind.Sequential, Pack = 1)]
        internal struct PathFinderNodeFast
        {
            public int F;
            public int G;
            public ushort PX;
            public ushort PY;
            public byte Status;
        }

        private byte[,] _Grid = null;
        private PriorityQueue<int> _Open = null;
        private List<PathFinderNode> _Close = new List<PathFinderNode>();
        private bool _Stop = false;
        private bool _Stopped = true;
        private int _Horiz = 0;
        private int _HEstimate = 2;
        private bool _PunishChangeDirection = false;
        private bool _TieBreaker = false;
        private bool _HeavyDiagonals = false;
        private int _SearchLimit = 2000;
        private double _CompletedTime = 0;
        private bool _DebugProgress = false;
        private bool _DebugFoundPath = false;
        private PathFinderNodeFast[] _CalcGrid = null;
        private byte _OpenNodeValue = 1;
        private byte _CloseNodeValue = 2;
        private int _H = 0;
        private int _Location = 0;
        private int _NewLocation = 0;
        private ushort _LocationX = 0;
        private ushort _LocationY = 0;
        private ushort _NewLocationX = 0;
        private ushort _NewLocationY = 0;
        private int _CloseNodeCounter = 0;
        private ushort _GridX = 0;
        private ushort _GridY = 0;
        private ushort _GridXMinus1 = 0;
        private ushort _GridYLog2 = 0;
        private bool _Found = false;
        sbyte[,] _Direction = new sbyte[8, 2] { { 0, -1 }, { 1, 0 }, { 0, 1 }, { -1, 0 }, { 1, -1 }, { 1, 1 }, { -1, 1 }, { -1, -1 } };
        private int _EndLocation = 0;
        private int _NewG = 0;

        public bool Stopped
        {
            get
            {
                return _Stopped;
            }
        }

        public bool HeavyDiagonals
        {
            get
            {
                return _HeavyDiagonals;
            }
            set
            {
                _HeavyDiagonals = value;
            }
        }

        public int HeuristicEstimate
        {
            get
            {
                return _HEstimate;
            }
            set
            {
                _HEstimate = value;
            }
        }

        public bool PunishChangeDirection
        {
            get
            {
                return _PunishChangeDirection;
            }
            set
            {
                _PunishChangeDirection = value;
            }
        }

        public bool TieBreaker
        {
            get
            {
                return _TieBreaker;
            }
            set
            {
                _TieBreaker = value;
            }
        }

        public int SearchLimit
        {
            get
            {
                return _SearchLimit;
            }
            set
            {
                _SearchLimit = value;
            }
        }

        public double CompletedTime
        {
            get
            {
                return _CompletedTime;
            }
            set
            {
                _CompletedTime = value;
            }
        }

        public bool DebugProgress
        {
            get
            {
                return _DebugProgress;
            }
            set
            {
                _DebugProgress = value;
            }
        }

        public bool DebugFoundPath
        {
            get
            {
                return _DebugFoundPath;
            }
            set
            {
                _DebugFoundPath = value;
            }
        }

        public void FindPathStop()
        {
            _Stop = true;
        }

        public PathFinderFast(byte[,] Grid)
        {
            if (Grid == null)
            {
                throw new Exception("Grid cannot be null");
            }

            _Grid = Grid;
            _GridX = (ushort)(_Grid.GetUpperBound(0) + 1);
            _GridY = (ushort)(_Grid.GetUpperBound(1) + 1);
            _GridXMinus1 = (ushort)(_GridX - 1);
            _GridYLog2 = (ushort)Math.Log(_GridY, 2);

            if (Math.Log(_GridX, 2) != (int)Math.Log(_GridX, 2) || Math.Log(_GridY, 2) != (int)Math.Log(_GridY, 2))
            {
                throw new Exception("Invalid Grid, size in X and Y must be power of 2");
            }

            if (_CalcGrid == null || _CalcGrid.Length != (_GridX * _GridY))
            {
                _CalcGrid = new PathFinderNodeFast[_GridX * _GridY];
            }

            _Open = new PriorityQueue<int>(new ComparePFNodeMatrix(_CalcGrid));
        }

        public List<PathFinderNode> FindPath(Point Start, Point End)
        {
            lock (this)
            {
                _Found = false;
                _Stop = false;
                _Stopped = false;
                _CloseNodeCounter = 0;
                _OpenNodeValue += 2;
                _CloseNodeValue += 2;
                _Open.Clear();
                _Close.Clear();

                _Location = (Start.Y << _GridYLog2) + Start.X;
                _EndLocation = (End.Y << _GridYLog2) + End.X;
                _CalcGrid[_Location].G = 0;
                _CalcGrid[_Location].F = _HEstimate;
                _CalcGrid[_Location].PX = (ushort)Start.X;
                _CalcGrid[_Location].PY = (ushort)Start.Y;
                _CalcGrid[_Location].Status = _OpenNodeValue;

                _Open.Push(_Location);
                while (_Open.Count > 0 && !_Stop)
                {
                    _Location = _Open.Pop();

                    if (_CalcGrid[_Location].Status == _CloseNodeValue)
                    {
                        continue;
                    }

                    _LocationX = (ushort)(_Location & _GridXMinus1);
                    _LocationY = (ushort)(_Location >> _GridYLog2);

                    if (_Location == _EndLocation)
                    {
                        _CalcGrid[_Location].Status = _CloseNodeValue;
                        _Found = true;
                        break;
                    }

                    if (_CloseNodeCounter > _SearchLimit)
                    {
                        _Stopped = true;
                        return null;
                    }

                    if (_PunishChangeDirection)
                    {
                        _Horiz = (_LocationX - _CalcGrid[_Location].PX);
                    }

                    for (int i = 0; i < 8; i++)
                    {
                        _NewLocationX = (ushort)(_LocationX + _Direction[i, 0]);
                        _NewLocationY = (ushort)(_LocationY + _Direction[i, 1]);
                        _NewLocation = (_NewLocationY << _GridYLog2) + _NewLocationX;

                        if (_NewLocationX >= _GridX || _NewLocationY >= _GridY)
                        {
                            continue;
                        }

                        if (_Grid[_NewLocationX, _NewLocationY] == 0)
                        {
                            continue;
                        }

                        if (_HeavyDiagonals && i > 3)
                        {
                            _NewG = _CalcGrid[_Location].G + (int)(_Grid[_NewLocationX, _NewLocationY] * 2.41);
                        }
                        else
                        {
                            _NewG = _CalcGrid[_Location].G + _Grid[_NewLocationX, _NewLocationY];
                        }

                        if (_PunishChangeDirection)
                        {
                            if ((_NewLocationX - _LocationX) != 0)
                            {
                                if (_Horiz == 0)
                                {
                                    _NewG += Math.Abs(_NewLocationX - End.X) + Math.Abs(_NewLocationY - End.Y);
                                }
                            }
                            if ((_NewLocationY - _LocationY) != 0)
                            {
                                if (_Horiz != 0)
                                {
                                    _NewG += Math.Abs(_NewLocationX - End.X) + Math.Abs(_NewLocationY - End.Y);
                                }
                            }
                        }

                        if (_CalcGrid[_NewLocation].Status == _OpenNodeValue || _CalcGrid[_NewLocation].Status == _CloseNodeValue)
                        {
                            if (_CalcGrid[_NewLocation].G <= _NewG)
                            {
                                continue;
                            }
                        }

                        _CalcGrid[_NewLocation].PX = _LocationX;
                        _CalcGrid[_NewLocation].PY = _LocationY;
                        _CalcGrid[_NewLocation].G = _NewG;

                        _H = _HEstimate * (Math.Abs(_NewLocationX - End.X) + Math.Abs(_NewLocationY - End.Y));

                        if (_TieBreaker)
                        {
                            int dx1 = _LocationX - End.X;
                            int dy1 = _LocationY - End.Y;
                            int dx2 = Start.X - End.X;
                            int dy2 = Start.Y - End.Y;
                            int cross = Math.Abs(dx1 * dy2 - dx2 * dy1);
                            _H = (int)(_H + cross * 0.001);
                        }
                        _CalcGrid[_NewLocation].F = _NewG + _H;

                        _Open.Push(_NewLocation);
                        _CalcGrid[_NewLocation].Status = _OpenNodeValue;
                    }

                    _CloseNodeCounter++;
                    _CalcGrid[_Location].Status = _CloseNodeValue;
                }

                if (_Found)
                {
                    _Close.Clear();
                    int posX = End.X;
                    int posY = End.Y;

                    PathFinderNodeFast fNodeTmp = _CalcGrid[(End.Y << _GridYLog2) + End.X];
                    PathFinderNode fNode;
                    fNode.F = fNodeTmp.F;
                    fNode.G = fNodeTmp.G;
                    fNode.H = 0;
                    fNode.PX = fNodeTmp.PX;
                    fNode.PY = fNodeTmp.PY;
                    fNode.X = End.X;
                    fNode.Y = End.Y;

                    try
                    {
                        while (fNode.X != fNode.PX || fNode.Y != fNode.PY)
                        {
                            _Close.Add(fNode);

                            posX = fNode.PX;
                            posY = fNode.PY;
                            fNodeTmp = _CalcGrid[(posY << _GridYLog2) + posX];
                            fNode.F = fNodeTmp.F;
                            fNode.G = fNodeTmp.G;
                            fNode.H = 0;
                            fNode.PX = fNodeTmp.PX;
                            fNode.PY = fNodeTmp.PY;
                            fNode.X = posX;
                            fNode.Y = posY;
                        }
                    }
                    catch
                    {
                        _Stopped = true;
                        return null;
                    }

                    _Close.Add(fNode);

                    _Stopped = true;
                    return _Close;
                }

                _Stopped = true;
                return null;
            }
        }

        internal class ComparePFNodeMatrix : IComparer<int>
        {
            PathFinderNodeFast[] mMatrix;

            public ComparePFNodeMatrix(PathFinderNodeFast[] matrix)
            {
                mMatrix = matrix;
            }

            public int Compare(int a, int b)
            {
                if (mMatrix[a].F > mMatrix[b].F)
                {
                    return 1;
                }
                else if (mMatrix[a].F < mMatrix[b].F)
                {
                    return -1;
                }
                return 0;
            }
        }
    }

    /// <summary>
    /// Represents a path finder node.
    /// </summary>
    public struct PathFinderNode
    {
        public int F;
        public int G;
        public int H;
        public int X;
        public int Y;
        public int PX;
        public int PY;
    }

    /// <summary>
    /// Represents a point in the grid.
    /// </summary>
    public struct Point
    {
        /// <summary>
        /// Initialises this point.
        /// </summary>
        /// <param name="X">The x position.</param>
        /// <param name="Y">The y position.</param>
        public Point(int X, int Y)
        {
            // Store the values.
            this.X = X;
            this.Y = Y;
        }

        /// <summary>
        /// The x position.
        /// </summary>
        public int X;

        /// <summary>
        /// The y position.
        /// </summary>
        public int Y;
    }

    /// <summary>
    /// Represents a node type in the pathfinder.
    /// </summary>
    public enum PathFinderNodeType
    {
        Start = 1,
        End = 2,
        Open = 4,
        Close = 8,
        Current = 16,
        Path = 32
    }
}