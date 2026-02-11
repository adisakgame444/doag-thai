import AboutPageContent from "@/components/abouts/aboutpage";
import ContactFooter from "@/components/layouts/footer/contact-footer";
import Header from "@/components/layouts/header";
import React from "react";

const AboutPage = () => {
  return (
    <div>
      <Header />
      <AboutPageContent />
      <ContactFooter />
    </div>
  );
};

export default AboutPage;

