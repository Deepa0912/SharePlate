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
    
    // Home Page
    hero_title1: "Reduce Food Waste.",
    hero_title2: " Feed More Lives.",
    hero_desc: "SharePlate connects food donors, NGOs, and volunteers to distribute excess food efficiently using modern technology.",
    btn_start: "Start Donating",
    stat_donations: "Food Donations",
    stat_ngos: "NGOs Connected",
    stat_meals: "Meals Saved",
    feat_don_title: "Food Donation",
    feat_don_desc: "Easily donate excess food with image upload and location details.",
    feat_ngo_title: "NGO Support",
    feat_ngo_desc: "NGOs can quickly identify nearby food donations and collect them.",
    feat_vol_title: "Volunteer Network",
    feat_vol_desc: "Volunteers help deliver food to people in need efficiently.",
    footer: "© 2026 SharePlate. All rights reserved.",

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

    // Home Page
    hero_title1: "ಆಹಾರ ಪೋಲಾಗುವುದನ್ನು ತಡೆಯಿರಿ.",
    hero_title2: " ಹೆಚ್ಚು ಜೀವಗಳಿಗೆ ಉಣಿಸಿ.",
    hero_desc: "ಶೇರ್ ಪ್ಲೇಟ್ ಆಧುನಿಕ ತಂತ್ರಜ್ಞಾನ ಬಳಸಿ ಹೆಚ್ಚುವರಿ ಆಹಾರವನ್ನು ದಕ್ಷತೆಯಿಂದ ವಿತರಿಸಲು ಆಹಾರ ದಾನಿಗಳು, ಸ್ವಯಂಸೇವಾ ಸಂಸ್ಥೆಗಳು (NGOs) ಮತ್ತು ಸ್ವಯಂಸೇವಕರನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.",
    btn_start: "ದಾನ ಮಾಡಲು ಪ್ರಾರಂಭಿಸಿ",
    stat_donations: "ಆಹಾರ ದಾನಗಳು",
    stat_ngos: "ಸಂಪರ್ಕಿತ ಸ್ವಯಂಸೇವಾ ಸಂಸ್ಥೆಗಳು",
    stat_meals: "ಉಳಿಸಿದ ಊಟಗಳು",
    feat_don_title: "ಆಹಾರ ದಾನ",
    feat_don_desc: "ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮತ್ತು ಸ್ಥಳ ವಿವರಗಳೊಂದಿಗೆ ಸುಲಭವಾಗಿ ಹೆಚ್ಚುವರಿ ಆಹಾರವನ್ನು ದಾನ ಮಾಡಿ.",
    feat_ngo_title: "ಸ್ವಯಂಸೇವಾ ಸಂಸ್ಥೆಗಳ ಬೆಂಬಲ",
    feat_ngo_desc: "ಸ್ವಯಂಸೇವಾ ಸಂಸ್ಥೆಗಳು ಹತ್ತಿರದ ಆಹಾರ ದಾನಗಳನ್ನು ತ್ವರಿತವಾಗಿ ಗುರುತಿಸಿ ಸಂಗ್ರಹಿಸಬಹುದು.",
    feat_vol_title: "ಸ್ವಯಂಸೇವಕರ ನೆಟ್‌ವರ್ಕ್",
    feat_vol_desc: "ಸ್ವಯಂಸೇವಕರು ಅಗತ್ಯವಿರುವ ಜನರಿಗೆ ಆಹಾರವನ್ನು ದಕ್ಷತೆಯಿಂದ ತಲುಪಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತಾರೆ.",
    footer: "© 2026 ಶೇರ್ ಪ್ಲೇಟ್. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",

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

    // Home Page
    hero_title1: "भोजन की बर्बादी रोकें।",
    hero_title2: " और अधिक जीवन बचाएं।",
    hero_desc: "SharePlate आधुनिक तकनीक का उपयोग करके अतिरिक्त भोजन को कुशलतापूर्वक वितरित करने के लिए खाद्य दाताओं, गैर सरकारी संगठनों (NGO) और स्वयंसेवकों को जोड़ता है.",
    btn_start: "दान करना शुरू करें",
    stat_donations: "खाद्य दान",
    stat_ngos: "जुड़े हुए गैर सरकारी संगठन",
    stat_meals: "बचाया गया भोजन (थाली)",
    feat_don_title: "खाद्य दान",
    feat_don_desc: "तस्वीर अपलोड और स्थान के विवरण के साथ आसानी से अतिरिक्त भोजन दान करें.",
    feat_ngo_title: "NGO सहायता",
    feat_ngo_desc: "गैर सरकारी संगठन (NGO) आसानी से पास के खाद्य दानों की पहचान कर उन्हें एकत्र कर सकते हैं.",
    feat_vol_title: "स्वयंसेवक नेटवर्क",
    feat_vol_desc: "स्वयंसेवक जरूरतमंद लोगों तक कुशलतापूर्वक भोजन पहुँचाने में मदद करते हैं.",
    footer: "© 2026 SharePlate. सभी अधिकार सुरक्षित हैं.",

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

    // Home Page
    hero_title1: "உணவு வீணாவதைத் தவிர்.",
    hero_title2: " பல உயிர்களுக்கு உணவளி.",
    hero_desc: "SharePlate நவீன தொழில்நுட்பத்தைப் பயன்படுத்தி உபரி உணவை திறம்பட விநியோகிக்க உணவு வழங்குநர்கள், அரசு சாரா அமைப்புகள் (NGOs) மற்றும் தன்னார்வலர்களை இணைக்கிறது.",
    btn_start: "தானம் செய்யத் தொடங்கு",
    stat_donations: "உணவு தானங்கள்",
    stat_ngos: "இணைக்கப்பட்ட தன்னார்வ அமைப்புகள்",
    stat_meals: "சேமிக்கப்பட்ட உணவுகள்",
    feat_don_title: "உணவு தானம்",
    feat_don_desc: "உணவுப் படம் மற்றும் இருப்பிட விவரங்களுடன் எளிதாக உணவு தானம் செய்யுங்கள்.",
    feat_ngo_title: "தன்னார்வ அமைப்புகள் ஆதரவு",
    feat_ngo_desc: "தன்னார்வ அமைப்புகள் அருகில் இருக்கும் உணவு தானங்களை எளிதாகக் கண்டறிந்து சேகரிக்க முடியும்.",
    feat_vol_title: "தன்னார்வலர் வலையமைப்பு",
    feat_vol_desc: "தேவைப்படும் மக்களுக்கு உணவை திறமையாக விநியோகிக்க தன்னார்வலர்கள் உதவுகிறார்கள்.",
    footer: "© 2026 SharePlate. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",

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

    // Home Page
    hero_title1: "ఆహార వృథాను అరికట్టండి.",
    hero_title2: " మరిన్ని ప్రాణాలను నిలపండి.",
    hero_desc: "SharePlate ఆధునిక సాంకేతిక పరిజ్ఞానాన్ని ఉపయోగించి అదనపు ఆహారాన్ని సమర్ధవంతంగా పంపిణీ చేయడానికి ఆహార దాతలు, స్వచ్ఛంద సంస్థలు (NGOs) మరియు స్వచ్ఛంద సేవకులను అనుసంధానిస్తుంది.",
    btn_start: "దానం చేయడం ప్రారంభించండి",
    stat_donations: "ఆహార దానాలు",
    stat_ngos: "అనుసంధానించబడిన స్వచ్ఛంద సంస్థలు",
    stat_meals: "ఆదా చేసిన భోజనాలు",
    feat_don_title: "ఆహార దానం",
    feat_don_desc: "ఆహారం చిత్రం మరియు స్థాన వివరాలతో సులభంగా అదనపు ఆహారాన్ని దానం చేయండి.",
    feat_ngo_title: "స్వచ్ఛంద సంస్థల మద్దతు",
    feat_ngo_desc: "స్వచ్ఛంద సంస్థలు సమీపంలోని ఆహార దానాలను త్వరగా గుర్తించి సేకరించవచ్చు.",
    feat_vol_title: "స్వచ్ఛంద సేవకుల నెట్‌వర్క్",
    feat_vol_desc: "స్వచ్ఛంద సేవకులు అవసరమైన ప్రజలకు ఆహారాన్ని సమర్థవంతంగా చేరవేయడానికి సహాయం చేస్తారు.",
    footer: "© 2026 SharePlate. అన్ని హక్కులూ ప్రత్యేకించబడినవి.",

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
