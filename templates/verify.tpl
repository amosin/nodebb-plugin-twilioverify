<script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/intlTelInput.js"></script>

	<div class="row">
		<div class="col-md-5 col-sm-4">
        <h2> [[verify:phone_verification]] </h2>
    <br />
    <!-- IF phoneNumber:verified -->
    <h3 style="color: red;"> [[verify:phone_already_verified]] </h3>
    <br />
    <!-- ELSE -->
    <p>[[verify:why_verify]]</p>
    <!-- ENDIF phoneNumber:verified -->
			<div>
				<form class='form-horizontal'>

					<div class="control-group">
						<label class="control-label" for="inputPhoneNumber">[[verify:phonenumber]]</label>
						<div class="controls">
                            <input class="form-control form-control-lg" type="tel" id="inputPhoneNumber" value="{phoneNumber}" name="phoneNumber" style="padding-left: 80px;"/>
						</div>
					</div>
          <input id="phone_full" type="hidden" name="phone_full">
					<input type="hidden" id="inputUID" value="{uid}"><br />
					<input type="hidden" id="phoneVerified" value="{phoneNumber.verified}"><br />
          <input type="hidden" name="_csrf" value="{config.csrf_token}" />

					<div class="form-actions">
						<a id="cancelBtn" onclick="location.href=appRoot;" href="#" class="btn btn-sescundary">[[global:close]]</a>
            <a id="submitBtn" href="#" class="btn btn-primary">[[global:save_changes]]</a>
					</div>

				</form>
			</div>

			<hr class="visible-xs visible-sm"/>
		</div>

	</div>
<script>
(function()
{
  if( window.localStorage )
  {
    if( !localStorage.getItem('firstLoad') )
    {
      localStorage['firstLoad'] = true;
      window.location.reload();
    }  
    else
      localStorage.removeItem('firstLoad');
  }
})();

  document.title = '[[verify:phone_verification]]'
  var head = document.getElementsByTagName('HEAD')[0];
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/css/intlTelInput.css';
  head.appendChild(link);
  const input = document.querySelector("#inputPhoneNumber");

  var iti = window.intlTelInput(input, {
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      initialCountry: "br",
      autoFormat: false,
      hiddenInput:"phone-full",
      preferredCountries: ["br", "us"],
  });
</script>

<br />
    <div class="row justify-content-center" id="verifyCodeBlock" style="display: none;">
    <div class="card col-lg-4">
      <div class="card-body">

<div id="sentVerificationCode" style="display: none;">
      <p>[[verify:just_sent_code_message]]</p>
</div>
        <form class="needs-validation" id="verify-form" method="post" novalidate="">
          <div class="form-group">
            <input type="hidden" name="_csrf" value="{config.csrf_token}" />
            <input type="hidden" value="{phoneNumber}" name="phoneNumberForCode" />
            <button type="button" class="btn btn-danger" onclick="sendNewCode($('#inputUID').val(), iti.getNumber());">[[verify:send_new_code]]</button><br />
            <label for="verificationCode">[[verify:verification_code]]</label>
            <input class="form-control" id="code" name="verificationCode" required="" placeholder="Confirmation Code"><br />
          </div>

          <button class="btn btn-primary btn-block" type="submit">Verify</button>
          
          <button class="btn btn-secundary btn-block" onclick="location.href=appRoot;" type="button">Skip</button>
        </form>
          </br>
      </div>
    </div>
  </div>

