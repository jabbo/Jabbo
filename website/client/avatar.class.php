<?php
define('AVATAR_TYPE_NORMAL', "figure");
define('AVATAR_TYPE_HEAD', "head");
define('AVATAR_TYPE_PART', "part");

function imageflip(&$image, $x = 0, $y = 0, $width = null, $height = null)
{
    if ($width  < 1) $width  = imagesx($image);
    if ($height < 1) $height = imagesy($image);
    $tmp = imagecreatetruecolor($width, $height);
	imagealphablending($tmp, false);
	imagesavealpha($tmp,true);
    $x2 = $x + $width - 1;
    for ($x = 0; $x < $width; $x++)
    {
        imagecopy($tmp, $image , $x, 0, $width - $x - 1, 0, 1, $height);
    }
	$image = $tmp;
    return true;
}
function imagerecolor(&$image, $red, $green, $blue)
{
	$width = imagesx($image);
	$height = imagesy($image);
	
	for($x = 0; $x < $width; $x++)
	{
		for($y = 0; $y < $height; $y++)
		{
			$rgb = imagecolorsforindex($image, imagecolorat($image, $x, $y));
			$r = $rgb['red'];
			$g = $rgb['green'];
			$b = $rgb['blue'];
			$a = $rgb['alpha'];
			
			$r = (($red / 255) * $r);
			$g = (($green / 255) * $g);
			$b = (($blue / 255) * $b);
			
			imagesetpixel($image, $x, $y, imagecolorallocatealpha($image, $r, $g, $b, $a));
		}
	}
}

$globAnimations = json_decode(file_get_contents("images/avatars/avatar_animations.json"), true);
$globColors = json_decode(file_get_contents("images/avatars/avatar_colors.json"), true);
$globLibraries = json_decode(file_get_contents("images/avatars/avatar_parts.json"), true);
$globSets = json_decode(file_get_contents("images/avatars/avatar_sets.json"), true);
$globDraworder = json_decode(file_get_contents("images/avatars/avatar_draworder.json"), true);
$globPartSets = json_decode(file_get_contents("images/avatars/avatar_partsets.json"), true);

	
Class Avatar
{
	private $Figure;
	private $FigureParts = Array();
	private $Direction;
	private $HeadDirection;
	private $Drink = 0;
	private $Signature = 0;
	private $Actions = Array();
	private $Frame = 0;
	private $HumanFx = 0;
	private $IsRendered = false;
	private $DebugMode = true;
	
	private $jsonAnimations = "images/avatars/avatar_animations.json";
	private $jsonColors = "images/avatars/avatar_colors.json";
	private $jsonLibraries = "images/avatars/avatar_parts.json";
	private $jsonSets = "images/avatars/avatar_sets.json";
	private $jsonPartsets = "images/avatars/avatar_partsets.json";
	private $jsonDraworder = "images/avatars/avatar_draworder.json";
	private $imagesBase = "images/avatars/avatar_images/{libraryName}.swf.flex/src/{libraryName}_";
	private $manifestBase = "images/avatars/avatar_images/{libraryName}.swf.flex/src/{libraryName}_manifest.dat";
	private $fxBase = "images/avatars/avatar_images/hh_human_fx.swf.flex/src/";
	
	private $Animations = Array();
	private $Colors = Array();
	private $Libraries = Array();
	private $Sets = Array();
	private $Draworder = Array();
	private $NewDraworder = null;
	private $PartSets = Array();
	private $Manifest = Array();
	private $Rendered = Array();
	private $Parts = Array();
	private $Debug = Array();
	private $PartData = Array();
	private $PartDataIds = Array();
	private $UseHrbFor = Array("hh_human_hats.26", "acc_head_U_ears_muffs", "hat_U_shade");
	
	private $Avatar;
	private $AvatarWidth = 64;
	private $AvatarHeight = 110;
	private $AvatarOffset = Array(-32, 45);
	private $AvatarType = "figure";
	private $AvatarRenderType = AVATAR_TYPE_NORMAL;
	
	public function __construct($figure, $_dir = 3, $_hdir = 3, $_actions = "std", $_drink = 0, $_signature = 0, $_frame = 0, $renderType = AVATAR_TYPE_NORMAL)
	{
		
		if($_dir < 0 || $_dir > 7)
		{
			$_dir = 3;
		}
		if($_hdir < 0 || $_hdir > 7)
		{
			$_hdir = 3;
		}
		
		$this->Figure = $figure;
		$this->Direction = $_dir;
		$this->HeadDirection = $_hdir;
		$this->Drink = $_drink;
		$this->Signature = $_signature;
		$this->Frame = $_frame;
		$this->Actions = explode(",", $_actions);
		$this->AvatarRenderType = $renderType;
		
		if((in_array("respect", $this->Actions) || in_array("sig", $this->Actions)) && !in_array("wav", $this->Actions))
		{
			$this->Actions[] = "wav";
		}
		
		if(in_array("lay", $this->Actions))
		{
			$this->AvatarWidth = 110;
			$this->AvatarHeight = 64;
			$this->AvatarOffset = Array(-10, 20);
			$this->NewDraworder = Array("li", "lh", "ls", "lc", "bd", "lg", "ch", "ca", "cc", "cp", "wa", "rh", "rs", "rc", "hd", "fc", "ey", "hr", "hrb", "fa", "ea", "ha", "he", "ri", "sh");
		} else
		if($this->AvatarRenderType === AVATAR_TYPE_HEAD)
		{
			$this->AvatarWidth = 64;
			$this->AvatarHeight = 64;
			$this->AvatarOffset = Array(-31, 65);
			$this->NewDraworder = Array("lg", "ch", "ca", "cc", "cp", "wa", "hd", "fc", "ey", "hr", "hrb", "fa", "ea", "ha", "he", "ri");
		} else
		if($this->AvatarRenderType === AVATAR_TYPE_PART)
		{
			$this->AvatarWidth = 64;
			$this->AvatarHeight = 64;
			
		}
		$this->LoadJSON();
		$this->ParseFigure();
		if($this->Drink > 0)
		{
			$this->FigureParts["ri"] = Array($this->Drink, null, null);
		}
		if(in_array("sig", $this->Actions))
		{
			$this->AvatarWidth = 76;
			$this->AvatarHeight = 122;
			$this->AvatarOffset = Array(-31, 51);
			$this->FigureParts["li"] = Array($this->Signature, null, null);
		}
		
		global $_GET;
		$this->DebugMode = isset($_GET['debug']);
		
		$this->Avatar = imagecreatetruecolor($this->AvatarWidth, $this->AvatarHeight);
		$transparent = imagecolorallocate($this->Avatar,1, 2, 3);
		imagecolortransparent($this->Avatar, $transparent);
		imagefilledrectangle($this->Avatar, 0, 0, $this->AvatarWidth, $this->AvatarHeight, $transparent);
	}
	
	public function Render()
	{
		foreach(array_keys($this->FigureParts) as $part)
		{
			if(isset($this->FigureParts[$part]))
			{
				$this->RenderPartData($part);
			}
			continue;
		}
		foreach(array_keys($this->FigureParts) as $part)
		{
			$renderType = $this->AvatarRenderType;
			if($renderType == "part")
			{
				$renderType = "figure";
			}
			if(isset($this->FigureParts[$part]) && in_array($part, $this->PartSets['activepart'][$renderType]))
			{
				$this->RenderPart($part);
			}
			continue;
		}
		
		$dir = ($this->Direction - 1);
		if($dir === -1)
		{
			$dir = 6;
		}
		if($dir > 3 || $dir <= 0)
		{
			$dir = $this->GetFlipDirection($dir);
		}
		$draworder = $this->Draworder['std'][$this->Direction];
		if($this->NewDraworder !== null)
		{
			$draworder = $this->NewDraworder;
		}
		$rendered = Array();
		$lowestX = 0;
		$lowestY = 0;
		$highestX = 0;
		$highestY = 0;
		foreach($draworder as $part)
		{
			if(isset($this->Parts[$part]))
			{
				if($this->AvatarRenderType == AVATAR_TYPE_PART)
				{
					foreach($this->Parts[$part] as $image)
					{
						if($lowestX <= $image[1] || $lowestX == 0)
						{
							$lowestX = $image[1];
						}
						if($lowestY <= $image[2] || $lowestY == 0)
						{
							$lowestY = $image[2];
						}
					}
					foreach($this->Parts[$part] as $key => $val)
					{
						$this->Parts[$part][$key][1] = ($this->Parts[$part][$key][1] - $lowestX);
						$this->Parts[$part][$key][2] = ($this->Parts[$part][$key][2] - $lowestY);
					}
					foreach($this->Parts[$part] as $key => $val)
					{
						if($this->Parts[$part][$key][1] < 0 && abs($this->Parts[$part][$key][1]) > $highestX)
						{
							$highestX = abs($this->Parts[$part][$key][1]);
						}
						if($this->Parts[$part][$key][2] < 0 && abs($this->Parts[$part][$key][2]) > $highestY)
						{
							$highestY = abs($this->Parts[$part][$key][2]);
						}
					}
				}
			}
		}
		foreach($draworder as $part)
		{
			if(isset($this->Parts[$part]))
			{
				if($this->AvatarRenderType == AVATAR_TYPE_PART)
				{
					foreach($this->Parts[$part] as $key => $val)
					{
						$this->Parts[$part][$key][1] = ($this->Parts[$part][$key][1] + $highestX);
						$this->Parts[$part][$key][2] = ($this->Parts[$part][$key][2] + $highestY);
						if(($this->Parts[$part][$key][1] + $this->Parts[$part][$key][3]) > $this->AvatarWidth || $this->AvatarWidth == 64)
						{
							$this->AvatarWidth = ($this->Parts[$part][$key][1] + $this->Parts[$part][$key][3]);
						}
						if(($this->Parts[$part][$key][2] + $this->Parts[$part][$key][4]) > $this->AvatarHeight || $this->AvatarHeight == 64)
						{
							$this->AvatarHeight = ($this->Parts[$part][$key][2] + $this->Parts[$part][$key][4]);
						}
					}
				}
				foreach($this->Parts[$part] as $image)
				{
					if(in_array($image[5] . $image[6], $rendered) && ($image[5] == "lg" || $image[5] == "hr" || $image[5] == "hrb")) continue;
					$rendered[] = $image[5] . $image[6];
					imagecopy($this->Avatar, $image[0], $image[1], $image[2], 0, 0, $image[3], $image[4]);
				}
			}
		}
		
		$this->IsRendered = true;
	}
	
	public function Draw()
	{
		if($this->IsRendered !== true)
		{
			$this->Render();
		}
		if($this->AvatarRenderType == AVATAR_TYPE_PART && $this->DebugMode == false)
		{
			$newIm = imagecreatetruecolor($this->AvatarWidth, $this->AvatarHeight);
			$transparent = imagecolorallocate($newIm, 1, 2, 3);
			imagecolortransparent($newIm, $transparent);
			imagefilledrectangle($newIm, 0, 0, $this->AvatarWidth, $this->AvatarHeight, $transparent);
			imagecopy($newIm, $this->Avatar, 0, 0, 0, 0, imagesx($this->Avatar), imagesy($this->Avatar));
			return($newIm);
		} else 
		if($this->DebugMode == false)
		{
			return($this->Avatar);
		}
	}
	
	private function RenderPartData($p)
	{
		$partData = $this->FigureParts[$p];
		$parts = $this->GetParts($p, $partData[0]);
		if($p == "ri")
		{
			$parts[] = Array(
							'type' => 'ri',
							'id' => $this->Drink,
							'colorable' => '0'
						);
		}
		if($p == "li")
		{
			$parts[] = Array(
							'type' => 'li',
							'id' => $this->Signature,
							'colorable' => '0'
						);
		}
		if($parts == null) return;
		foreach($parts as $part)
		{
			if($this->GetDirection($part['type']) == 0 || $this->GetDirection($part['type']) > 5)
			{
				if($part['type'] === "ey") continue;
				if($part['type'] === "fc") continue;
			}
			$library = $this->GetLibrary($part['type'], $part['id']);
			if($library == null) continue;
			
			$this->PartData[$part['type']] = $library;
			$this->PartDataIds[$part['type']] = $part['id'];
		}
	}
	
	private function HasPart($part, $parts)
	{
		foreach($parts as $part)
		{
			if($part['type'] == $part) return true;
		}
		return false;
	}
	
	private function RenderPart($p)
	{
		$doFlip = false;
		$flipDir = "2";
		$partData = $this->FigureParts[$p];
		$parts = $this->GetParts($p, $partData[0]);
		if($p == "ri")
		{
			$parts[] = Array(
							'type' => 'ri',
							'id' => $this->Drink,
							'colorable' => '0'
						);
		}
		if($p == "li")
		{
			$parts[] = Array(
							'type' => 'li',
							'id' => $this->Signature,
							'colorable' => '0'
						);
		}
		if($parts == null) return;
		foreach($parts as $part)
		{
			$renderAs = $part['type'];
			$library = $this->GetLibrary($part['type'], $part['id']);
			if($library == null && $part['type'] != "ls" && $part['type'] != "rs") return;
			$library = str_replace("_50_", "_", $library);
			
			if($library == null && $part['type'] == "ls")
			{
				$library = "hh_human_shirt";
			} else if($library == null && $part['type'] == "rs")
			{
				$library = "hh_human_shirt";
			}
			
			$action = $this->GetActions($part['type']);
			foreach($action as $act)
			{
				if(in_array($act, $this->Actions))
				{
					$action = $act;
					break;
				}
			}
			if(is_array($action))
			{
				$action = $action[0];
			}
			$direction = $this->GetDirection($part['type']);
			if($direction > -1 && $direction < 8)
			{
				$doFlip = false;
				$doNotFlip = false;
				
				$imageFileOne = $this->GetPartImage($library, $action, $part['type'], $part['id'], $direction, $this->GetFrameForPart($part['type'], $action));
				$imageFileTwo = $this->GetPartImage($library, $action, $this->PartSets['partflips'][$part['type']], $part['id'], $this->GetFlipDirection($direction), $this->GetFrameForPart($part['type'], $action));
				$imageFileTre = $this->GetPartImage($library, $action, $part['type'], $part['id'], $this->GetFlipDirection($direction), $this->GetFrameForPart($part['type'], $action));
				
				if(file_exists($imageFileOne))
				{
					$newType = $part['type'];
					$direction = $this->GetFlipDirection($direction);
					$doNotFlip = true;
				} else if(file_exists($imageFileTwo))
				{
					$newType = $this->PartSets['partflips'][$part['type']];
					$doNotFlip = false;
				} else if(file_exists($imageFileTre))
				{
					$newType = $part['type'];
					$doNotFlip = false;
				} else {
					$newType = $this->PartSets['partflips'][$part['type']];
					$doNotFlip = false;
				}
				
				if($doNotFlip == true)
				{
					$doFlip = false;
					$flipDir = $this->GetFlipDirection($direction);
				} else {
					$doFlip = true;
					$flipDir = $this->GetFlipDirection($direction);
				}
				$renderAs = $part['type'];
				$part['type'] = $newType;
				$direction = $flipDir;
			}
			if($direction == 0 || $direction > 5)
			{
				if($part['type'] === "ey") continue;
				if($part['type'] === "fc") continue;
			}
			
			if(strlen($part['type']) == 3 && in_array(substr($part['type'], 0, 2), $this->Rendered)) continue;
			$this->Rendered[] = $part['type'];
			
			$this->RenderPartType($part, $p, $doFlip, $flipDir, $partData, $direction, $action, $renderAs);
		}
	}
	
	private function RenderPartType($part, &$p, &$doFlip, &$flipDir, &$partData, &$direction, &$action, &$renderAs)
	{
		$library = $this->GetLibrary($part['type'], $part['id']);
		if($library == null && $part['type'] != "ls" && $part['type'] != "rs") return;
		$library = str_replace("_50_", "_", $library);
		
		if($library == null && $part['type'] == "ls")
		{
			$library = "hh_human_shirt";
		} else if($library == null && $part['type'] == "rs")
		{
			$library = "hh_human_shirt";
		}
		
		$part['type'] = $this->HasHat($part['type']);
		
		if(!isset($this->Manifest[$library]))
		{
			$this->Manifest[$library] = $this->xmlObjToArr(simplexml_load_file(str_replace("{libraryName}", $library, $this->manifestBase)));
		}
		$manifest = $this->ParseManifest($this->Manifest[$library]);
		
		$palette = $this->GetPalette($p);
		if($part['colorable'] == '1')
		{
			$rgb = Array();
			$color = $this->GetColor($palette, $partData[1]);
			$rgb[] = $this->hex2RGB($color);
			if($partData[2] !== null)
			{
				$colorTwo = $this->GetColor($palette, $partData[2]);
				$rgb[] = $this->hex2RGB($colorTwo);
			}
		}
		
		for($i = 0; $i < (((isset($rgb) && count($rgb) > 1)) ? 3 : 1); $i++)
		{
			$dir = $direction;
			$imageFile = str_replace("{libraryName}", $library, $this->imagesBase);
			$partFile = "h_" . $action . "_" . $part['type'] . "_" . ($part['id'] + $i) . "_" . $dir . "_" . $this->GetFrameForPart($part['type'], $action);
			$imageFile .= $partFile . ".png";
			
			if(!file_exists($imageFile)) continue;
			
			$partImage = imagecreatefrompng($imageFile);
			$pImageWidth = imagesx($partImage);
			$pImageHeight = imagesy($partImage);
			$offsetX = null;
			if($doFlip == true)
			{
				imageflip($partImage);
				$offsetX = ($this->AvatarWidth - $pImageWidth) + 3;
			}
			$pImagePosXas = 0;
			$pImagePosYas = 0;
			if($doFlip == false && $direction > 3 && $direction < 7)
			{
				$pImagePosXas = -1;
			}
			if($offsetX != null)
			{
				$pImagePosXas = $offsetX - ((($this->AvatarWidth / 2) - (int)$manifest[$partFile][0]) + $this->AvatarOffset[0]);
			} else {
				$pImagePosXas += ((($this->AvatarWidth / 2) - (int)$manifest[$partFile][0]) + $this->AvatarOffset[0]);
			}
			$pImagePosYas += ((($this->AvatarHeight / 2) - (int)$manifest[$partFile][1]) + $this->AvatarOffset[1]);
			if($part['colorable'] == '1' && ($part['type'] != 'ey'))
			{
				$ib = (($i < 2) ? $i : ($i - 1));
				imagerecolor($partImage, $rgb[$ib]['r'], $rgb[$ib]['g'], $rgb[$ib]['b']);
			}
			
			
			$this->Parts[$renderAs][] = Array($partImage, $pImagePosXas, $pImagePosYas, $pImageWidth, $pImageHeight, $part['type'], $i);
			
			unset($partImage);
		}
	}
	
	private function GetPartImage($library, $action, $partType, $partId, $dir, $frame = 0)
	{
		$imageFile = str_replace("{libraryName}", $library, $this->imagesBase);
		$partFile = "h_" . $action . "_" . $partType . "_" . $partId . "_" . $dir . "_" . $frame;
		$imageFile .= $partFile . ".png";
		return $imageFile;
	}
	
	private function HasHat($partType)
	{
		$hair = Array("hr");
		$partTypes = array_keys($this->PartData);
		if(in_array($partType, $hair))
		{
			$newType = "";
			foreach($this->PartData as $pType => $libraryName)
			{
				if(in_array($libraryName, $this->UseHrbFor))
				{
					$newType = "hrb";
					break;
				} else if(in_array(($libraryName . "." . $this->PartDataIds[$pType]), $this->UseHrbFor))
				{
					$newType = "hrb";
					break;
				} else {
					$hasHat = ((in_array("ha", $partTypes)) && !in_array($libraryName, $this->UseHrbFor));
					$newType = ($hasHat) ? "hr" : "hrb";
				}
			}
			return $newType;
		}
		return $partType;
	}
	
	private function ParseFigure()
	{
		$f = explode(".", $this->Figure);
		foreach($f as $d)
		{
			$e = explode("-", $d);
			$this->FigureParts[$e[0]] = Array($e[1], ((isset($e[2])) ? $e[2] : null), ((isset($e[3])) ? $e[3] : null));
		}
	}
	
	private function LoadJSON()
	{
		global $globAnimations;
		global $globColors;
		global $globLibraries;
		global $globSets;
		global $globDraworder;
		global $globPartSets;
	
		$this->Animations = $globAnimations;
		$this->Colors = $globColors;
		$this->Libraries = $globLibraries;
		$this->Sets = $globSets;
		$this->Draworder = $globDraworder;
		$this->PartSets = $globPartSets;
	}
	
	private function GetFrameForPart($part, $action = "std")
	{
		if(isset($this->Animations[$action]))
		{
			if(isset($this->Animations[$action][$part]))
			{
				$frames = $this->Animations[$action][$part];
				if(in_array($this->Frame, $frames))
				{
					return $this->Frame;
				} else
				{
					return ceil($this->Frame / 2) - 1;
				}
			}
		}
		return 0;
	}
	
	private function GetColor($palette, $id)
	{
		if(isset($this->Colors[(int)$palette][(int)$id]))
		{
			return $this->Colors[(int)$palette][(int)$id];
		}
		return null;
	}
	
	private function GetLibrary($type, $id)
	{
		if(isset($this->Libraries[$type][(int)$id]))
		{
			return $this->Libraries[$type][(int)$id];
		}
		return null;
	}
	
	private function GetPalette($type)
	{
		if(isset($this->Sets[$type]['paletteid']))
		{
			return $this->Sets[$type]['paletteid'];
		}
		return null;
	}
	
	private function GetParts($type, $id)
	{
		if(isset($this->Sets[$type]['sets'][(int)$id]))
		{
			return $this->Sets[$type]['sets'][(int)$id];
		}
		return null;
	}
	
	private function GetActions($type)
	{
		$actions = Array();
		$actions[] = "std";
		switch($type)
		{
			case "bd":
				$actions[] = "sit";
				$actions[] = "lay";
				$actions[] = "wlk";
				break;
			
			case "hd":
				$actions[] = "lsp";
				$actions[] = "lay";
				$actions[] = "spk";
				break;
			
			case "fa":
				$actions[] = "spk";
				$actions[] = "lsp";
				$actions[] = "lay";
				break;
			
			case "ea":
				$actions[] = "lay";
				break;
			
			case "ey":
				$actions[] = "agr";
				$actions[] = "sad";
				$actions[] = "sml";
				$actions[] = "srp";
				$actions[] = "lag";
				$actions[] = "lsp";
				$actions[] = "lay";
				$actions[] = "eyb";
				break;
			
			case "fc":
				$actions[] = "agr";
				$actions[] = "blw";
				$actions[] = "sad";
				$actions[] = "spk";
				$actions[] = "srp";
				$actions[] = "sml";
				$actions[] = "lsp";
				$actions[] = "lay";
				break;
			
			case "hr":
			case "hrb":
				$actions[] = "lay";
				break;
			
			case "he":
				$actions[] = "lay";
				break;
			
			case "ha":
				$actions[] = "lay";
				break;
			
			case "ch":
				$actions[] = "lay";
				break;
			
			case "cc":
				$actions[] = "lay";
				break;
			
			case "ca":
				$actions[] = "lay";
				break;
			
			case "lg":
				$actions[] = "sit";
				$actions[] = "wlk";
				$actions[] = "lay";
				break;
			
			case "lh":
				$actions[] = "respect";
				$actions[] = "sig";
				$actions[] = "wav";
				$actions[] = "wlk";
				$actions[] = "lay";
				break;
				
			case "ls":
				$actions[] = "wav";
				$actions[] = "wlk";
				$actions[] = "lay";
				break;
				
			case "lc":
				$actions[] = "wav";
				$actions[] = "wlk";
				$actions[] = "lay";
				break;
			
			case "rh":
				$actions[] = "blw";
				$actions[] = "drk";
				$actions[] = "crr";
				$actions[] = "wlk";
				$actions[] = "lay";
				break;
				
			case "rs":
				$actions[] = "blw";
				$actions[] = "drk";
				$actions[] = "crr";
				$actions[] = "wlk";
				$actions[] = "lay";
				break;
				
			case "rc":
				$actions[] = "blw";
				$actions[] = "drk";
				$actions[] = "crr";
				$actions[] = "wlk";
				$actions[] = "lay";
				break;
			
			case "ri":
				$actions[] = "crr";
				$actions[] = "drk";
				break;
			
			case "li":
				$actions[] = "sig";
				break;
				
			case "sh":
				$actions[] = "sit";
				$actions[] = "wlk";
				$actions[] = "lay";
				break;
				
			default:
				break;
		}
		return $actions;
	}
	
	private function GetDirection($type)
	{
		switch($type)
		{
			case "ea":
			case "ey":
			case "fa":
			case "fc":
			case "hr":
			case "hrb":
			case "he":
			case "ha":
			case "hd":
				return $this->HeadDirection;
			
			default:
				return $this->Direction;
		}
	}
	
	private function GetFlipDirection($dir)
	{
		switch($dir)
		{
			case 0:
				return 6;
			
			case 1:
				return 5;
			
			case 2:
				return 4;
			
			case 3:
				return 3;
			
			case 4:
				return 2;
			
			case 5:
				return 1;
			
			case 6:
				return 0;
			
			case 7:
				return 7;
			
			default:
				return 3;
		}
	}
	
	private function hex2RGB($hexStr, $returnAsString = false, $seperator = ',')
	{
		$hexStr = preg_replace("/[^0-9A-Fa-f]/", '', $hexStr);
		$rgbArray = array();
		if (strlen($hexStr) == 6)
		{
			$colorVal = hexdec($hexStr);
			$rgbArray['r'] = 0xFF & ($colorVal >> 0x10);
			$rgbArray['g'] = 0xFF & ($colorVal >> 0x8);
			$rgbArray['b'] = 0xFF & $colorVal;
		} elseif (strlen($hexStr) == 3)
		{
			$rgbArray['r'] = hexdec(str_repeat(substr($hexStr, 0, 1), 2));
			$rgbArray['g'] = hexdec(str_repeat(substr($hexStr, 1, 1), 2));
			$rgbArray['b'] = hexdec(str_repeat(substr($hexStr, 2, 1), 2));
		} else {
			return false;
		}
		return $returnAsString ? implode($seperator, $rgbArray) : $rgbArray;
	}
	
	private function ParseManifest($arr)
	{
		$newArr = Array();
		
		foreach($arr['children']['library'][0]['children']['assets'][0]['children']['asset'] as $asset)
		{
			$name = $asset['attributes']['name'];
			$offset = explode(",", $asset['children']['param'][0]['attributes']['value']);
			$newArr[$name] = $offset;
		}
		
		return $newArr;
	}
	
	private function xmlObjToArr($obj)
	{ 
		$namespace = $obj->getDocNamespaces(true); 
		$namespace[null] = null; 
		
		$children = array(); 
		$attributes = array(); 
		$name = strtolower((string)$obj->getName()); 
		
		$text = trim((string)$obj); 
		if( strlen($text) <= 0 )
		{ 
			$text = NULL; 
		} 
		
		if(is_object($obj)) { 
			foreach( $namespace as $ns=>$nsUrl )
			{
				$objAttributes = $obj->attributes($ns, true); 
				foreach($objAttributes as $attributeName => $attributeValue)
				{ 
					$attribName = strtolower(trim((string)$attributeName)); 
					$attribVal = trim((string)$attributeValue); 
					if(!empty($ns))
					{ 
						$attribName = $ns . ':' . $attribName; 
					} 
					$attributes[$attribName] = $attribVal; 
				}
				$objChildren = $obj->children($ns, true); 
				foreach($objChildren as $childName => $child)
				{ 
					$childName = strtolower((string)$childName); 
					if(!empty($ns))
					{ 
						$childName = $ns.':'.$childName; 
					} 
					$children[$childName][] = $this->xmlObjToArr($child); 
				} 
			} 
		} 
		
		return array( 
			'name' => $name, 
			'text' => $text, 
			'attributes' => $attributes, 
			'children' => $children 
		); 
	}
	
}
?>