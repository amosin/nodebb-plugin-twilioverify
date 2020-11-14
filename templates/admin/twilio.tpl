<h1>Twilio - Mobile Confirmation</h1>
<hr />

<form>
	<p>
		Visit <a href="https://www.twilio.com/user/account">your twilio account page</a> to learn your Account SID and Auth Token.
	</p><br />
	<div class="alert alert-info">
		<p>
			<label for="Length">Length of confirmation code</label>
			<input type="text" data-field="twilio:length" title="Length" class="form-control" placeholder="4"><br />
			<label for="Account SID">Account SID
			</label>
			<input type="text" data-field="twilio:sid" title="Account SID" class="form-control" placeholder=""><br />
			<label for="Auth Token">Auth Token</label>
			<input type="text" data-field="twilio:token" title="Auth Token" class="form-control" placeholder=""><br />
			<label for="Service SID">Verification Service SID (create one: <a href="https://www.twilio.com/console/verify/services"> here</a>)</label>
			<input type="text" data-field="twilio:verificactiondid" title="Service SID" class="form-control" placeholder=""><br />
		</p>
	</div>
</form>

<button class="btn btn-lg btn-primary" id="save">Save</button>

<script>
	require(['admin/settings'], function(Settings) {
		Settings.prepare();
	});
</script>