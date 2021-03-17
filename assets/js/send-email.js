function sendMail(contactForm) {
    emailjs.send("service_l1aerqr", "resume_site_message", {
        "from_name": contactForm.name.value,
        "from_email": contactForm.emailaddress.value,
        "message": contactForm.contactsummary.value
    })
    .then (
        function(response) {
            console.log("SUCCESS", response);
        },
        function(error) {
            consoile.log("FAIL", error);
        });
        return false;
}