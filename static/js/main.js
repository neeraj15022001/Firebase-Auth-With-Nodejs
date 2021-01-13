intializeApp();
var ui = new firebaseui.auth.AuthUI(firebase.auth());
let isGoogleProvider = false;
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      console.log(authResult);
      if (authResult) {
        switch (authResult.additionalUserInfo.providerId) {
          case null:
            console.log("anonymous sign in");
            isGoogleProvider = false;
            break;
          case "github.com":
            console.log("github");
            isGoogleProvider = false;
            break;
          case "password":
            console.log("email password sign in");
            isGoogleProvider = false;
            break;
          case "phone":
            console.log("phone sign in");
            isGoogleProvider = false;
            break;
          case "google.com":
            console.log("google sign in");
            isGoogleProvider = true;
            break;
          default:
            console.log("no case running");
            isGoogleProvider = false;
        }
      }
      if (isGoogleProvider) {
        console.log("is google provider");
        fetch("/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: authResult.credential.idToken,
            isGoogleProvider : isGoogleProvider
          }),
        }).then((res) => {
          if (res.ok) {
            window.location.assign("/profile");
          }
        });
      } else {
        fetch("/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isGoogleProvider : isGoogleProvider
          }),
        }).then((res) => {
          if (res.ok) {
            window.location.assign("/profile");
          }
        });
      }

      return false;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById("loader").style.display = "none";
    },
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: "popup",
  // signInSuccessUrl: "#",
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      customParameters: {
        // Forces account selection even when one account
        // is available.
        prompt: "select_account",
      },
    },
    {
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      scopes: ["public_profile", "email", "user_likes", "user_friends"],
      customParameters: {
        // Forces password re-entry.
        auth_type: "reauthenticate",
      },
    },
    {
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      recaptchaParameters: {
        type: "image", // 'audio'
        size: "normal", // 'invisible' or 'compact'
        badge: "bottomleft", //' bottomright' or 'inline' applies to invisible.
      },
      defaultCountry: "IN",
      defaultNationalNumber: "1234567890",
      loginHint: "+911234567890",
    },
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
    },
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url.
  tosUrl: "<your-tos-url>",
  // Privacy policy url.
  privacyPolicyUrl: "<your-privacy-policy-url>",
};
ui.start("#firebaseui-auth-container", uiConfig);
