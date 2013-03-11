<?php
error_reporting(0);
class MUS
{
	private $host;
	private $port;
	private $timeout;

	private $sk;

	private $errnum;
	private $errstr;

	function __construct($host, $port, $timeout)
	{
		$this->host = $host;
		$this->port = $port;
		$this->timeout = $timeout;

		$this->sk = fsockopen($this->host,$this->port,$this->errnum,$this->errstr,$this->timeout);

		if (!is_resource($this->sk))
		{
			exit("error");
		}
		else
		{

		}
	}

	function SendData($data)
	{
		fputs($this->sk, $data);
	}

	function ReciveData()
	{
		$dati = "";

		while (!feof($this->sk))
		{
			$dati.= fgets($this->sk, 1024);
		}	

		return $dati;
	}

	function Close()
	{
		fclose($this->sk);
	}
}
?>