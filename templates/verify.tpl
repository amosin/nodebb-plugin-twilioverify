<div class="row justify-content-center">
    <div class="card col-lg-4">
      <div class="card-body">
      <p>We've just sent you a confirmation code to {phoneNumber}. 
      If you don't receive one in the next few minutes, 
      click <a href="#" id="resend">here</a> to generate a new code.</p>

        <h1>Verify</h1><br>
        <form class="needs-validation" id="verify-form" method="post" novalidate="">
          <div class="form-group">
            <input type="hidden" name="_csrf" value="{config.csrf_token}" />
            <label for="verificationCode">Verification Code</label>
            <input class="form-control" id="code" name="verificationCode" required="" placeholder="Confirmation Code"><br />
          </div>
          <button class="btn btn-secundary btn-block" onclick="location.href='{config.relative_path}';" type="button">Skip</button>
          <button class="btn btn-primary btn-block" type="submit">Verify</button>
        </form>
      </div>
    </div>
  </div>