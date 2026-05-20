import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    brand: "SharePlate",
    home: "Home",
    dashboard: "Dashboard",
    analytics: "Analytics",
    login: "Login",
    signup: "Signup",
    logout: "Logout",

    // Home Page Redesign
    mission_banner: "Our Goal: A Hunger-Free India through AI-powered food recovery from weddings and hotels.",
    ai_badge: "AI-Powered Impact",
    hero_title1: "Don't Let Food Go to Waste. ",
    hero_title2: "Feed the Future of India.",
    hero_desc: "SharePlate transforms surplus food from weddings, hotels, and restaurants into daily nutritious meals for orphanages and communities in need across India.",

    impact_orphanage: "Orphanage Support",
    impact_hunger: "Hunger Relief",
    impact_community: "Community Growth",

    who_title: "How We Make an Impact",
    who_desc: "We bridge the gap between surplus sources and the most vulnerable communities in India.",
    who_orphan_title: "Wedding & Event Surplus",
    who_orphan_desc: "Rescuing high-quality food from celebrations before it goes to waste.",
    who_poor_title: "Hotel & Restaurant Partners",
    who_poor_desc: "Partnering with the food industry to recover unused daily kitchen surplus.",
    who_community_title: "AI Distribution",
    who_community_desc: "Real-time AI matching to ensure fresh food reaches orphanages rapidly.",

    how_title: "How It Works",
    how_subtitle: "Three simple steps to fight hunger in India.",
    how_step1_title: "Snap & List",
    how_step1_desc: "Hotels or hosts upload a photo. AI identifies and lists it instantly.",
    how_step2_title: "AI Route Matching",
    how_step2_desc: "We find the nearest verified orphanage or NGO in need.",
    how_step3_title: "Pickup & Deliver",
    how_step3_desc: "A volunteer collects the surplus and delivers a smile to someone hungry.",

    feat_title: "Smart Features for India",
    feat_subtitle: "Building the technology to end hunger collectively.",
    cta_title: "Ready to join the mission?",
    cta_desc: "Your contribution, whether as a donor or volunteer, helps feed India's future.",
    btn_start: "Get Started",

    // Analytics Center
    analytics_hero_title: "Eradicating Hunger, One Plate at a Time.",
    analytics_hero_subtitle: "Through the generosity of our donors and the speed of our AI, we turn surplus from weddings and hotels into hope for thousands across India.",
    stat_meals: "Meals Provided",
    stat_water: "Liters Saved",
    stat_co2: "CO2 Offset",
    stat_donations: "Donations",

    // Login Page
    login_title: "Login",
    ph_email: "Email",
    ph_password: "Password",

    // Signup Page
    signup_title: "Signup",
    ph_name: "Name",
    ph_role: "Role",
    opt_donor: "donor",
    opt_ngo: "ngo",
    opt_volunteer: "volunteer",

    // Dashboard Page
    dash_title: "SharePlate Dashboard",
    btn_donate: "Donate Food",
    modal_title: "Donate Food",
    lbl_food: "Food Name",
    lbl_quantity: "Quantity (e.g., 5 kg, 20 plates)",
    lbl_expiry: "Expiry Time",
    lbl_location: "Your Location",
    lbl_image: "Food Image",
    btn_submit: "Submit Donation",
    btn_cancel: "Cancel",
    donations_title: "Active Food Donations",
    col_food: "Food",
    col_qty: "Quantity",
    col_expiry: "Expiry",
    col_location: "Location",
    col_status: "Status",
    col_priority: "AI Priority",
    col_ngo: "Recommended NGO",
    col_action: "Action",
    btn_delete: "Delete",
    badge_ai: "AI ASSIGNED",
    tab_all: "All Foods",
    tab_available: "Available",
    tab_my_bookings: "My Bookings",
    tab_my_donations: "My Donations",
    btn_book: "Book Food",
    btn_cancel_booking: "Cancel Booking",
    btn_collect: "Mark as Collected",
    status_available: "Available",
    status_booked: "Booked",
    status_collected: "Collected",

    // Analytics Page
    analytics_title: "SharePlate Analytics Dashboard",
    card_total: "Total Donations",
    card_meals: "Total Meals Saved",
    card_locations: "Active Locations",
    chart_monthly: "Donation Trends (Monthly)",
    chart_top_foods: "Top Food Items Donated",
    chart_top_locations: "Top Busiest Locations",

    // Chatbot
    chat_header: "SharePlate AI",
    chat_welcome: "Hi there! I'm your SharePlate AI assistant. How can I help you today?",
    chat_placeholder: "Type your message..."
  },
  kn: {
    brand: "ಶೇರ್ ಪ್ಲೇಟ್",
    home: "ಮುಖಪುಟ",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    analytics: "ಅನಾಲಿಟಿಕ್ಸ್",
    login: "ಲಾಗಿನ್",
    signup: "ಸೈನ್ ಅಪ್",
    logout: "ಲಾಗ್ ಔಟ್",

    // Home Page Redesign
    mission_banner: "ನಮ್ಮ ಗುರಿ: ಮದುವೆ ಮತ್ತು ಹೋಟೆಲ್‌ಗಳಿಂದ ಆಹಾರ ಸಂಗ್ರಹಿಸುವ ಮೂಲಕ ಹಸಿವು ಮುಕ್ತ ಭಾರತ.",
    ai_badge: "AI ಚಾಲಿತ ಪ್ರಭಾವ",
    hero_title1: "ಆಹಾರ ಪೋಲಾಗಲು ಬಿಡಬೇಡಿ. ",
    hero_title2: "ಭಾರತದ ಭವಿಷ್ಯಕ್ಕೆ ಉಣಿಸಿ.",
    hero_desc: "ಶೇರ್ ಪ್ಲೇಟ್ ಮದುವೆಗಳು, ಹೋಟೆಲ್‌ಗಳು ಮತ್ತು ರೆಸ್ಟೋರೆಂಟ್‌ಗಳಿಂದ ಹೆಚ್ಚುವರಿ ಆಹಾರವನ್ನು ಅನಾಥಾಶ್ರಮಗಳಿಗೆ ತಲುಪಿಸುವ ದೈನಂದಿನ ಪೌಷ್ಟಿಕ ಊಟವನ್ನಾಗಿ ಪರಿವರ್ತಿಸುತ್ತದೆ.",

    impact_orphanage: "ಅನಾಥಾಶ್ರಮ ಬೆಂಬಲ",
    impact_hunger: "ಹಸಿವು ನಿವಾರಣೆ",
    impact_community: "ಸಮುದಾಯದ ಬೆಳವಣಿಗೆ",

    who_title: "ನಾವು ಹೇಗೆ ಪ್ರಭಾವ ಬೀರುತ್ತೇವೆ",
    who_desc: "ನಾವು ಹೆಚ್ಚುವರಿ ಆಹಾರದ ಮೂಲಗಳು ಮತ್ತು ಭಾರತದ ಅತ್ಯಂತ ಅಗತ್ಯದ ಸಮುದಾಯಗಳ ನಡುವೆ ಸೇತುವೆಯಾಗಿದ್ದೇವೆ.",
    who_orphan_title: "ಸಂಭ್ರಮಗಳ ಹೆಚ್ಚುವರಿ ಆಹಾರ",
    who_orphan_desc: "ಮದುವೆಗಳು ಮತ್ತು ಕಾರ್ಯಕ್ರಮಗಳಿಂದ ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಆಹಾರವನ್ನು ಪೋಲಾಗುವ ಮೊದಲು ಉಳಿಸುವುದು.",
    who_poor_title: "ಹೋಟೆಲ್ ಮತ್ತು ರೆಸ್ಟೋರೆಂಟ್ ಪಾಲುದಾರರು",
    who_poor_desc: "ಉಪಯೋಗಿಸದ ದೈನಂದಿನ ಕಿಚನ್ ಹೆಚ್ಚುವರಿ ಆಹಾರವನ್ನು ಸಂಗ್ರಹಿಸಲು ಹೋಟೆಲ್ ಉದ್ಯಮದೊಂದಿಗೆ ಪಾಲುದಾರಿಕೆ.",
    who_community_title: "AI ಲಾಜಿಸ್ಟಿಕ್ಸ್",
    who_community_desc: "ಫ್ರೆಶ್ ಆಹಾರವು ಅನಾಥಾಶ್ರಮಗಳನ್ನು ವೇಗವಾಗಿ ತಲುಪುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ರಿಯಲ್-ಟೈಮ್ AI ಬಳಕೆ.",

    how_title: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
    how_subtitle: "ಭಾರತದಲ್ಲಿ ಹಸಿವಿನ ವಿರುದ್ಧ ಹೋರಾಡಲು ಮೂರು ಸುಲಭ ಹಂತಗಳು.",
    how_step1_title: "Snap & List",
    how_step1_desc: "ಹೋಟೆಲ್‌ಗಳು ಅಥವಾ ಆಯೋಜಕರು ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡುತ್ತಾರೆ. AI ಅದನ್ನು ತಕ್ಷಣ ಗುರುತಿಸುತ್ತದೆ.",
    how_step2_title: "AI ರೂಟ್ ಮ್ಯಾಚಿಂಗ್",
    how_step2_desc: "ನಾವು ಹತ್ತಿರದ ಪರಿಶೀಲಿಸಿದ ಅನಾಥಾಶ್ರಮ ಅಥವಾ NGO ಅನ್ನು ಕಂಡುಹಿಡಿಯುತ್ತೇವೆ.",
    how_step3_title: "ಪಿಕಪ್ ಮತ್ತು ವಿತರಣೆ",
    how_step3_desc: "ಸ್ವಯಂಸೇವಕರು ಹೆಚ್ಚುವರಿ ಆಹಾರವನ್ನು ಸಂಗ್ರಹಿಸಿ ಅಗತ್ಯವಿರುವವರಿಗೆ ತಲುಪಿಸುತ್ತಾರೆ.",

    feat_title: "ಭಾರತಕ್ಕಾಗಿ ಸ್ಮಾರ್ಟ್ ವೈಶಿಷ್ಟ್ಯಗಳು",
    feat_subtitle: "ಹಸಿವನ್ನು ಒಟ್ಟಾಗಿ ಕೊನೆಗಾಣಿಸಲು ತಂತ್ರಜ್ಞಾನವನ್ನು ನಿರ್ಮಿಸುವುದು.",
    cta_title: "ಮಿಷನ್ ಸೇರಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
    cta_desc: "ನಿಮ್ಮ ಕೊಡುಗೆಯು ಭಾರತದ ಭವಿಷ್ಯವನ್ನು ಪೋಷಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
    btn_start: "ಪ್ರಾರಂಭಿಸಿ",

    // Analytics Center
    analytics_hero_title: "ಹಸಿವು ಮುಕ್ತ ಭಾರತ, ಪ್ರತಿ ತಟ್ಟೆಯ ಮೂಲಕ.",
    analytics_hero_subtitle: "ನಮ್ಮ ದಾನಿಗಳ ಔದಾರ್ಯ ಮತ್ತು AI ತಂತ್ರಜ್ಞಾನದ ವೇಗದ ಮೂಲಕ, ನಾವು ಹೋಟೆಲ್‌ಗಳು ಮತ್ತು ಮದುವೆಗಳ ಹೆಚ್ಚುವರಿ ಆಹಾರವನ್ನು ಸಾವಿರಾರು ಜನರಿಗೆ ಹಂಚುತ್ತಿದ್ದೇವೆ.",
    stat_meals: "ಉಣಬಡಿಸಿದ ಊಟ",
    stat_water: "ಉಳಿಸಿದ ನೀರು (ಲೀಟರಲ್ಲಿ)",
    stat_co2: "ಕಡಿಮೆ ಮಾಡಿದ ಇಂಗಾಲ",
    stat_donations: "ಒಟ್ಟು ಕೊಡುಗೆಗಳು",

    // Login Page
    login_title: "ಲಾಗಿನ್",
    ph_email: "ಇಮೇಲ್",
    ph_password: "ಪಾಸ್‌ವರ್ಡ್",

    // Signup Page
    signup_title: "ಸೈನ್ ಅಪ್",
    ph_name: "ಹೆಸರು",
    ph_role: "ಪಾತ್ರ",
    opt_donor: "ದಾನಿ",
    opt_ngo: "ಸ್ವಯಂಸೇವಾ ಸಂಸ್ಥೆ (ngo)",
    opt_volunteer: "ಸ್ವಯಂಸೇವಕ",

    // Dashboard Page
    dash_title: "ಶೇರ್ ಪ್ಲೇಟ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    btn_donate: "ಆಹಾರ ದಾನ ಮಾಡಿ",
    modal_title: "ಆಹಾರ ದಾನ ಮಾಡಿ",
    lbl_food: "ಆಹಾರದ ಹೆಸರು",
    lbl_quantity: "ಪ್ರಮಾಣ (ಉದಾಹರಣೆಗೆ, 5 ಕೆಜಿ, 20 ಪ್ಲೇಟ್‌ಗಳು)",
    lbl_expiry: "ಅವಧಿ ಮುಗಿಯುವ ಸಮಯ",
    lbl_location: "ನಿಮ್ಮ ಸ್ಥಳ",
    lbl_image: "ಆಹಾರದ ಚಿತ್ರ",
    btn_submit: "ದಾನವನ್ನು ಸಲ್ಲಿಸಿ",
    btn_cancel: "ರದ್ದುಮಾಡಿ",
    donations_title: "ಸಕ್ರಿಯ ಆಹಾರ ದಾನಗಳು",
    col_food: "ಆಹಾರ",
    col_qty: "ಪ್ರಮಾಣ",
    col_expiry: "ಅವಧಿ",
    col_location: "ಸ್ಥಳ",
    col_status: "ಸ್ಥಿತಿ",
    col_priority: "AI ಆದ್ಯತೆ",
    col_ngo: "ಶಿಫಾರಸು ಮಾಡಿದ NGO",
    col_action: "ಕ್ರಿಯೆ",
    btn_delete: "ಅಳಿಸಿ",
    badge_ai: "AI ನಿಯೋಜಿಸಲಾಗಿದೆ",
    tab_all: "ಎಲ್ಲಾ ಆಹಾರಗಳು",
    tab_available: "ಲಭ್ಯವಿದೆ",
    tab_my_bookings: "ನನ್ನ ಕಾಯ್ದಿರಿಸುವಿಕೆಗಳು",
    tab_my_donations: "ನನ್ನ ದಾನಗಳು",
    btn_book: "ಆಹಾರ ಕಾಯ್ದಿರಿಸಿ",
    btn_cancel_booking: "ಕಾಯ್ದಿರಿಸುವಿಕೆ ರದ್ದುಮಾಡಿ",
    btn_collect: "ಸಂಗ್ರಹಿಸಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ",
    status_available: "ಲಭ್ಯವಿದೆ",
    status_booked: "ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ",
    status_collected: "ಸಂಗ್ರಹಿಸಲಾಗಿದೆ",

    // Analytics Page
    analytics_title: "ಶೇರ್ ಪ್ಲೇಟ್ ಅನಾಲಿಟಿಕ್ಸ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    card_total: "ಒಟ್ಟು ದಾನಗಳು",
    card_meals: "ಉಳಿಸಿದ ಒಟ್ಟು ಊಟಗಳು",
    card_locations: "ಸಕ್ರಿಯ ಸ್ಥಳಗಳು",
    chart_monthly: "ದಾನದ ಪ್ರವೃತ್ತಿಗಳು (ಮಾಸಿಕ)",
    chart_top_foods: "ದಾನ ಮಾಡಿದ ಪ್ರಮುಖ ಆಹಾರಗಳು",
    chart_top_locations: "ಅತಿ ಹೆಚ್ಚು ದಾನ ನಡೆಯುವ ಸ್ಥಳಗಳು",

    // Chatbot
    chat_header: "ಶೇರ್ ಪ್ಲೇಟ್ AI",
    chat_welcome: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಶೇರ್ ಪ್ಲೇಟ್ AI ಸಹಾಯಕ. ಇವತ್ತು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
    chat_placeholder: "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ..."
  },
  hi: {
    brand: "SharePlate",
    home: "होमपेज",
    dashboard: "डैशबोर्ड",
    analytics: "एनालिटिक्स",
    login: "लॉगिन",
    signup: "साइन अप",
    logout: "लॉग आउट",

    // Home Page Redesign
    mission_banner: "हमारा लक्ष्य: शादियों और होटलों से भोजन बचाकर भूख मुक्त भारत बनाना।",
    ai_badge: "AI-संचालित प्रभाव",
    hero_title1: "भोजन को बर्बाद न होने दें। ",
    hero_title2: "भारत के भविष्य को खिलाएं।",
    hero_desc: "SharePlate शादियों, होटलों और रेस्तरां से बचे भोजन को भारत भर के अनाथालयों और जरूरतमंद समुदायों के लिए पौष्टिक भोजन में बदल देता है।",

    impact_orphanage: "अनाथालय सहायता",
    impact_hunger: "भूख राहत",
    impact_community: "सामुदायिक विकास",

    who_title: "हम किसकी मदद करते हैं",
    who_desc: "आपका दान हमारे सत्यापित नेटवर्क के माध्यम से उन लोगों तक पहुँचता है जिन्हें इसकी सबसे अधिक आवश्यकता है।",
    who_orphan_title: "अनाथालय",
    who_orphan_desc: "बच्चों को स्वस्थ और मजबूत बनाने के लिए पौष्टिक भोजन प्रदान करना।",
    who_poor_title: "गरीब और भूखे",
    who_poor_desc: "खाद्य असुरक्षा से जूझ रहे व्यक्तियों और परिवारों को दैनिक भोजन परोसना।",
    who_community_title: "सामुदायिक केंद्र",
    who_community_desc: "उन स्थानीय रसोई घरों का समर्थन करना जो लोगों को खाने के लिए सुरक्षित स्थान प्रदान करते हैं।",

    how_title: "यह कैसे काम करता है",
    how_subtitle: "बड़ा बदलाव लाने के लिए तीन सरल कदम।",
    how_step1_title: "फोटो खींचें",
    how_step1_desc: "फोटो अपलोड करें। हमारा AI भोजन की पहचान करता है।",
    how_step2_title: "AI मिलान",
    how_step2_desc: "हम सही अनाथालय या NGO खोजने के लिए तात्कालिकता और निकटता का विश्लेषण करते हैं।",
    how_step3_title: "पिकअप और मुस्कान",
    how_step3_desc: "एक स्वयंसेवक भोजन एकत्र करता है और जरूरतमंदों तक पहुँचाता है।",

    feat_title: "स्मार्ट फीचर्स",
    feat_subtitle: "सामाजिक भलाई के लिए उन्नत तकनीक।",
    cta_title: "क्या आप प्रभाव डालने के लिए तैयार हैं?",
    cta_desc: "आपका योगदान भारत के भविष्य को खिलाने में मदद करता है।",
    btn_start: "शुरू करें",

    // Analytics Center
    analytics_hero_title: "भूख मिटाना, एक प्लेट के साथ।",
    analytics_hero_subtitle: "हमारे दाताओं की उदारता और AI की गति के माध्यम से, हम होटलों और शादियों के अतिरिक्त भोजन को हजारों लोगों के लिए आशा में बदल देते हैं।",
    stat_meals: "प्रदान किया गया भोजन",
    stat_water: "बचाया गया पानी (लीटर)",
    stat_co2: "CO2 उत्सर्जन में कमी",
    stat_donations: "कुल दान",

    // Login Page
    login_title: "लॉगिन",
    ph_email: "ईमेल",
    ph_password: "पासवर्ड",

    // Signup Page
    signup_title: "साइन अप",
    ph_name: "नाम",
    ph_role: "भूमिका",
    opt_donor: "दाता",
    opt_ngo: "गैर सरकारी संगठन (ngo)",
    opt_volunteer: "स्वयंसेवक",

    // Dashboard Page
    dash_title: "SharePlate डैशबोर्ड",
    btn_donate: "भोजन दान करें",
    modal_title: "भोजन दान करें",
    lbl_food: "भोजन का नाम",
    lbl_quantity: "मात्रा (जैसे, 5 किलो, 20 थाली)",
    lbl_expiry: "समाप्ति का समय",
    lbl_location: "आपका स्थान",
    lbl_image: "भोजन की छवि (तस्वीर)",
    btn_submit: "दान जमा करें",
    btn_cancel: "रद्द करें",
    donations_title: "सक्रिय खाद्य दान",
    col_food: "भोजन",
    col_qty: "मात्रा",
    col_expiry: "समाप्ति",
    col_location: "स्थान",
    col_status: "स्थिति",
    col_priority: "AI प्राथमिकता",
    col_ngo: "अनुशंसित NGO",
    col_action: "कार्रवाई",
    btn_delete: "हटाएं",
    badge_ai: "AI द्वारा निर्धारित",
    tab_all: "सभी भोजन",
    tab_available: "उपलब्ध",
    tab_my_bookings: "मेरी बुकिंग",
    tab_my_donations: "मेरे दान",
    btn_book: "भोजन बुक करें",
    btn_cancel_booking: "बुकिंग रद्द करें",
    btn_collect: "एकत्रित चिह्नित करें",
    status_available: "उपलब्ध",
    status_booked: "बुक किया गया",
    status_collected: "एकत्रित किया गया",

    // Analytics Page
    analytics_title: "SharePlate एनालिटिक्स डैशबोर्ड",
    card_total: "कुल दान",
    card_meals: "कुल बचाया गया भोजन",
    card_locations: "सक्रिय स्थान",
    chart_monthly: "दान के रुझान (मासिक)",
    chart_top_foods: "सर्वाधिक दान किए गए भोजन",
    chart_top_locations: "शीर्ष व्यस्त स्थान",

    // Chatbot
    chat_header: "SharePlate AI",
    chat_welcome: "नमस्ते! मैं आपका SharePlate AI सहायक हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?",
    chat_placeholder: "अपना संदेश टाइप करें..."
  },
  ta: {
    brand: "SharePlate",
    home: "முகப்பு",
    dashboard: "டாஷ்போர்டு",
    analytics: "பகுப்பாய்வு",
    login: "உள்நுழை",
    signup: "பதிவு செய்",
    logout: "வெளியேறு",

    // Home Page Redesign
    mission_banner: "எங்கள் இலக்கு: திருமணங்கள் மற்றும் ஹோட்டல்களில் இருந்து உணவை மீட்பதன் மூலம் இந்தியாவில் பசி இல்லா நிலை.",
    ai_badge: "AI-இயங்கும் தாக்கம்",
    hero_title1: "உணவு வீணாவதை அனுமதிக்காதீர்கள். ",
    hero_title2: "இந்தியாவின் எதிர்காலத்திற்கு உணவளிப்போம்.",
    hero_desc: "SharePlate திருமணங்கள், ஹோட்டல்கள் மற்றும் உணவகங்களில் இருந்து உபரி உணவை இந்தியா முழுவதும் உள்ள அனாதை இல்லங்களுக்கு சத்தான உணவாக மாற்றுகிறது.",

    impact_orphanage: "அனாதை இல்ல ஆதரவு",
    impact_hunger: "பசி நிவாரணம்",
    impact_community: "சமூக வளர்ச்சி",

    who_title: "நாங்கள் எப்படி தாக்கத்தை ஏற்படுத்துகிறோம்",
    who_desc: "உபரி உணவின் ஆதாரங்களுக்கும் இந்தியாவின் மிகவும் நலிவடைந்த சமூகங்களுக்கும் இடையிலான இடைவெளியை நாங்கள் குறைக்கிறோம்.",
    who_orphan_title: "திருமணம் மற்றும் நிகழ்ச்சி உபரி",
    who_orphan_desc: "கொண்டாட்டங்களில் இருந்து உயர்தர உணவை வீணாவதற்கு முன்பே மீட்பது.",
    who_poor_title: "ஹோட்டல் மற்றும் உணவக பங்காளிகள்",
    who_poor_desc: "உணவுத் துறையுடன் இணைந்து தினசரி பயன்படுத்தப்படாத சமையலறை உபரியை மீட்பது.",
    who_community_title: "AI விநியோகம்",
    who_community_desc: "புதிய உணவு அனாதை இல்லங்களை விரைவாக சென்றடைவதை உறுதி செய்ய எங்களின் AI தொழில்நுட்பம் உதவுகிறது.",

    how_title: "இது எப்படி வேலை செய்கிறது",
    how_subtitle: "இந்தியாவில் பசியை எதிர்த்துப் போராட மூன்று எளிய படிகள்.",
    how_step1_title: "Snap & List",
    how_step1_desc: "ஹோட்டல்கள் அல்லது நடத்துபவர்கள் புகைப்படத்தைப் பதிவேற்றுகிறார்கள். AI அதை உடனடியாக அடையாளம் காண்கிறது.",
    how_step2_title: "AI வழி பொருத்தம்",
    how_step2_desc: "தேவைப்படும் அருகிலுள்ள சரிபார்க்கப்பட்ட அனாதை இல்லம் அல்லது NGO-வை நாங்கள் கண்டறிகிறோம்.",
    how_step3_title: "பிக்-அப் மற்றும் டெலிவரி",
    how_step3_desc: "ஒரு தன்னார்வலர் உபரியைச் சேகரித்து பசியால் வாடுபவர்களுக்கு வழங்குகிறார்.",

    feat_title: "இந்தியாவிற்கான ஸ்மார்ட் அம்சங்கள்",
    feat_subtitle: "பசியை கூட்டாக முடிவுக்குக் கொண்டுவருவதற்கான தொழில்நுட்பத்தை உருவாக்குதல்.",
    cta_title: "மிஷனில் இணையத் தயாரா?",
    cta_desc: "உங்கள் பங்களிப்பு இந்தியாவின் எதிர்காலத்திற்கு உணவளிக்க உதவுகிறது.",
    btn_start: "தொடங்குங்கள்",

    // Analytics Center
    analytics_hero_title: "பசியை ஒழித்தல், ஒரு தட்டு மூலம்.",
    analytics_hero_subtitle: "நமது நன்கொடையாளர்களின் தாராள மனப்பான்மை மற்றும் AI இன் வேகம் மூலம், ஹோட்டல்கள் மற்றும் திருமணங்களில் இருந்து உபரி உணவை ஆயிரக்கணக்கானவர்களுக்கு நம்பிக்கையாக மாற்றுகிறோம்.",
    stat_meals: "வழங்கப்பட்ட உணவுகள்",
    stat_water: "சேமிக்கப்பட்ட நீர் (லிட்டர்)",
    stat_co2: "CO2 குறைப்பு",
    stat_donations: "மொத்த நன்கொடைகள்",

    // Login Page
    login_title: "உள்நுழை",
    ph_email: "மின்னஞ்சல்",
    ph_password: "கடவுச்சொல்",

    // Signup Page
    signup_title: "பதிவு செய்",
    ph_name: "பெயர்",
    ph_role: "பங்கு",
    opt_donor: "கொடையாளர்",
    opt_ngo: "தன்னார்வ அமைப்பு (ngo)",
    opt_volunteer: "தன்னார்வலர்",

    // Dashboard Page
    dash_title: "SharePlate டாஷ்போர்டு",
    btn_donate: "உணவு தானம் செய்",
    modal_title: "உணவு தானம் செய்",
    lbl_food: "உணவின் பெயர்",
    lbl_quantity: "அளவு (எ.கா. 5 கிலோ, 20 தட்டுகள்)",
    lbl_expiry: "காலாவதி நேரம்",
    lbl_location: "உங்கள் இருப்பிடம்",
    lbl_image: "உணவு படம்",
    btn_submit: "தானத்தை சமர்ப்பி",
    btn_cancel: "ரத்து செய்",
    donations_title: "செயலில் உள்ள உணவு தானங்கள்",
    col_food: "உணவு",
    col_qty: "அளவு",
    col_expiry: "காலாவதி",
    col_location: "இருப்பிடம்",
    col_status: "நிலை",
    col_priority: "AI முன்னுரிமை",
    col_ngo: "பரிந்துரைக்கப்பட்ட NGO",
    col_action: "செயல்பாடு",
    btn_delete: "அழி",
    badge_ai: "AI ஒதுக்கப்பட்டது",
    tab_all: "அனைத்து உணவுகள்",
    tab_available: "கிடைக்கக்கூடியவை",
    tab_my_bookings: "எனது முன்பதிவுகள்",
    tab_my_donations: "எனது தானங்கள்",
    btn_book: "உணவை முன்பதிవు செய்",
    btn_cancel_booking: "முன்பதிவை ரத்து செய்",
    btn_collect: "சேகரிக்கப்பட்டது என குறி",
    status_available: "கிடைக்கக்கூடியது",
    status_booked: "முன்பతివు செய்யப்பட்டது",
    status_collected: "சேகரிக்கப்பட்டது",

    // Analytics Page
    analytics_title: "SharePlate பகுப்பாய்வு டாஷ்போர்டு",
    card_total: "மொத்த தானங்கள்",
    card_meals: "சேமிக்கப்பட்ட மொத்த உணவுகள்",
    card_locations: "செயலில் உள்ள இருப்பிடங்கள்",
    chart_monthly: "தானம் போக்குகள் (மாதாந்திர)",
    chart_top_foods: "தானம் செய்யப்பட்ட சிறந்த உணவுகள்",
    chart_top_locations: "அதிக தானம் பெற்ற இருப்பிடங்கள்",

    // Chatbot
    chat_header: "SharePlate AI",
    chat_welcome: "வணக்கம்! நான் உங்கள் SharePlate AI உதவியாளர். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
    chat_placeholder: "உங்கள் செய்தியை உள்ளிடவும்..."
  },
  te: {
    brand: "SharePlate",
    home: "హోమ్ పేజీ",
    dashboard: "డ్యాష్‌బోర్డ్",
    analytics: "అనలిటిక్స్",
    login: "లాగిన్",
    signup: "సైన్ అప్",
    logout: "లాగ్ అవుట్",

    // Home Page Redesign
    mission_banner: "మా లక్ష్యం: పెళ్లిళ్లు మరియు హోటళ్ల నుండి ఆహారాన్ని సేకరించడం ద్వారా ఆకలి రహిత భారతాన్ని నిర్మించడం.",
    ai_badge: "AI-ఆధారిత ప్రభావం",
    hero_title1: "ఆహారాన్ని వృథా కానివ్వకండి. ",
    hero_title2: "భారతదేశ భవిష్యత్తుకు ఆహారాన్ని అందించండి.",
    hero_desc: "SharePlate పెళ్లిళ్లు, హోటళ్లు మరియు రెస్టారెంట్ల నుండి అదనపు ఆహారాన్ని భారతదేశంలోని అనాథాశ్రమాలు మరియు అవసరమైన సంఘాలకు రోజువారీ పోషకమైన భోజనంగా మారుస్తుంది.",

    impact_orphanage: "అనాథాశ్రమ మద్దతు",
    impact_hunger: "ఆకలి నివారణ",
    impact_community: "సామాజిక వృద్ధి",

    who_title: "మేము ఎవరికి సహాయం చేస్తాము",
    who_desc: "మీ దానాలు మా ధృవీకరించబడిన నెట్‌వర్క్ ద్వారా అత్యంత అవసరమైన వారికి చేరుతాయి.",
    who_orphan_title: "అనాథాశ్రమాలు",
    who_orphan_desc: "పిల్లలు ఆరోగ్యంగా మరియు బలంగా పెరగడానికి పోషకమైన ఆహారాన్ని అందించడం.",
    who_poor_title: "పేదలు మరియు ఆకలితో ఉన్నవారు",
    who_poor_desc: "ఆహార భద్రతతో ఇబ్బంది పడుతున్న వ్యక్తులు మరియు కుటుంబాలకు ప్రతిరోజూ భోజనం వడ్డించడం.",
    who_community_title: "సామాజిక కేంద్రాలు",
    who_community_desc: "ప్రజలకు తినడానికి సురక్షితమైన స్థలాన్ని అందించే స్థానిక వంటశాలలకు మద్దతు ఇవ్వడం.",

    how_title: "ఇది ఎలా పనిచేస్తుంది",
    how_subtitle: "పెద్ద మార్పును కలిగించడానికి మూడు సులభమైన దశలు.",
    how_step1_title: "ఫోటో తీసి జాబితా చేయండి",
    how_step1_desc: "ఫోటోను అప్‌లోడ్ చేయండి. మా AI ఆహారాన్ని గుర్తించి వెంటనే జాబితా చేస్తుంది.",
    how_step2_title: "AI మ్యాచింగ్",
    how_step2_desc: "సరైన అనాథాశ్రమం లేదా NGOను కనుగొనడానికి మేము అత్యవసరం మరియు సామీప్యాన్ని విశ్లేషిస్తాము.",
    how_step3_title: "పికప్ మరియు చిరునవ్వు",
    how_step3_desc: "ఒక వాలంటీర్ లేదా NGO ఆహారాన్ని సేకరించి అవసరమైన వారికి చేరవేస్తారు.",

    feat_title: "స్మార్ట్ ఫీచర్లు",
    feat_subtitle: "సామాజిక మేలు కోసం అధునాతన సాంకేతికత.",
    cta_title: "మార్పు తీసుకురావడానికి సిద్ధంగా ఉన్నారా?",
    cta_desc: "మీ సహకారం భారతదేశ భవిష్యత్తుకు ఆహారం అందించడంలో సహాయపడుతుంది.",
    btn_start: "ప్రారంభించండి",

    // Analytics Center
    analytics_hero_title: "ఆకలి నిర్మూలన, ఒక్క ప్లేట్ తో మొదలు.",
    analytics_hero_subtitle: "మా దాతల ఉదారత మరియు AI వేగం ద్వారా, మేము హోటళ్లు మరియు వివాహాల నుండి మిగిలిపోయిన ఆహారాన్ని వేలాది మందికి ఆశగా మారుస్తాము.",
    stat_meals: "అందించిన భోజనం",
    stat_water: "పొదుపు చేసిన నీరు (లీటర్లు)",
    stat_co2: "తగ్గించిన CO2",
    stat_donations: "మొత్తం విరాళాలు",

    // Login Page
    login_title: "లాగిన్",
    ph_email: "ఇమెయిల్",
    ph_password: "పాస్‌వర్డ్",

    // Signup Page
    signup_title: "సైన్ అప్",
    ph_name: "పేరు",
    ph_role: "పాత్ర",
    opt_donor: "దాత",
    opt_ngo: "స్వచ్ఛంద సంస్థ (ngo)",
    opt_volunteer: "స్వచ్ఛంద సేవకుడు",

    // Dashboard Page
    dash_title: "SharePlate డ్యాష్‌బోర్డ్",
    btn_donate: "ఆహారాన్ని దానం చేయండి",
    modal_title: "ఆహారాన్ని దానం చేయండి",
    lbl_food: "ఆహారం పేరు",
    lbl_quantity: "పరిమాణం (ఉదా. 5 కేజీలు, 20 ప్లేట్లు)",
    lbl_expiry: "గడువు ముగిసే సమయం",
    lbl_location: "మీ స్థానం",
    lbl_image: "ఆహార చిత్రం",
    btn_submit: "దానాన్ని సమర్పించండి",
    btn_cancel: "రద్దు చేయి",
    donations_title: "సక్రియ ఆహార దానాలు",
    col_food: "ఆహారం",
    col_qty: "పరిమాణం",
    col_expiry: "గడువు",
    col_location: "స్థానం",
    col_status: "స్థితి",
    col_priority: "AI ప్రాధాన్యత",
    col_ngo: "సిఫార్సు చేయబడిన NGO",
    col_action: "చర్య",
    btn_delete: "తొలగించు",
    badge_ai: "AI కేటాయించింది",
    tab_all: "అన్ని ఆహారాలు",
    tab_available: "అందుబాటులో ఉన్నవి",
    tab_my_bookings: "నా బుకింగ్‌లు",
    tab_my_donations: "నా దానాలు",
    btn_book: "ఆహారం బుక్ చేయి",
    btn_cancel_booking: "బుకింగ్ రద్దు చేయి",
    btn_collect: "సేకరించినట్లు గుర్తించు",
    status_available: "అందుబాటులో ఉంది",
    status_booked: "బుక్ చేయబడింది",
    status_collected: "సేకరించబడింది",

    // Analytics Page
    analytics_title: "SharePlate అనలిటిక్స్ డ్యాష్‌బోర్డ్",
    card_total: "మొత్తం దానాలు",
    card_meals: "ఆదా చేసిన మొత్తం భోజనాలు",
    card_locations: "సక్రియ స్థానాలు",
    chart_monthly: "దానాల ధోరణి (నెలవారీ)",
    chart_top_foods: "ఎక్కువగా దానం చేసిన ఆహారాలు",
    chart_top_locations: "అత్యంత రద్దీగా ఉండే స్థానాలు",

    // Chatbot
    chat_header: "SharePlate AI",
    chat_welcome: "నమస్కారం! నేను మీ SharePlate AI సహాయకుడిని. ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?",
    chat_placeholder: "మీ సందేశాన్ని నమోదు చేయండి..."
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("shareplate_lang") || "en";
  });

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      localStorage.setItem("shareplate_lang", newLang);
    }
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
