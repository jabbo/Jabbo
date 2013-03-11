var help = {
	 report : function() {
		var message = prompt("Enter your report...");
		if (message != null && message != "")
		{
			packets.send.report(message);
		}
		else
		{
			client.notify("Abuse of the <strong>help reports</strong> will result in a ban");
		}
	}
};
