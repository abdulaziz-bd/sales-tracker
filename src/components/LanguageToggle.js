import { Button } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "bn" : "en");
  };

  return (
    <Button onClick={toggleLanguage} variant="outlined">
      {i18n.language === "en" ? "বাংলা" : "English"}
    </Button>
  );
}

export default LanguageToggle;
