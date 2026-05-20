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
    mission_banner: "Our Goal: Delivering every usable plate to local orphanages and community kitchens.",
    ai_badge: "AI-Powered Impact",
    hero_title1: "Don't Let Food Go to Waste. ",
    hero_title2: "Feed the Future.",
    hero_desc: "SharePlate uses AI to transform your surplus food into someone's next meal. We connect donors directly with orphanages and homes for the poor.",

    impact_orphanage: "Orphanage Support",
    impact_hunger: "Hunger Relief",
    impact_community: "Community Growth",

    who_title: "Who We Help",
    who_desc: "Your donations reach those who need it most through our verified network.",
    who_orphan_title: "Orphanage Homes",
    who_orphan_desc: "Providing nutritious meals to children to ensure they grow up healthy and strong.",
    who_poor_title: "Poor & Hungry",
    who_poor_desc: "Serving daily meals to individuals and families struggling with food insecurity.",
    who_community_title: "Community Centers",
    who_community_desc: "Supporting local kitchens that provide a safe place for people to eat.",

    how_title: "How It Works",
    how_subtitle: "Three simple steps to make a massive difference.",
    how_step1_title: "Snap & List",
    how_step1_desc: "Upload a photo. Our AI identifies the food and lists it instantly.",
    how_step2_title: "AI Matching",
    how_step2_desc: "We analyze urgency and proximity to find the perfect orphanage or NGO.",
    how_step3_title: "Pickup & Smile",
    how_step3_desc: "A volunteer or NGO collects the food and delivers it to those in need.",

    feat_title: "Smart Features",
    feat_subtitle: "Advanced technology for social good.",
    cta_title: "Ready to make an impact?",
    cta_desc: "Every donation counts. Join hundreds of others in the fight against hunger today.",

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

    // Home Page Redesign
    mission_banner: "हमारा लक्ष्य: हर उपयोगी थाली को स्थानीय अनाथालयों और सामुदायिक रसोई तक पहुँचाना।",
    ai_badge: "AI-संचालित प्रभाव",
    hero_title1: "भोजन को बर्बाद न होने दें। ",
    hero_title2: "भविष्य को खिलाएं।",
    hero_desc: "SharePlate आपके अतिरिक्त भोजन को किसी के अगले भोजन में बदलने के लिए AI का उपयोग करता है।",

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
    cta_desc: "हर दान मायने रखता है। आज ही भूख के खिलाफ लड़ाई में शामिल हों।",

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
    mission_banner: "எங்கள் இலக்கு: ஒவ்வொரு பயன்படுத்தக்கூடிய உணவையும் உள்ளூர் அனாதை இல்லங்கள் மற்றும் சமூக சமையலறைகளுக்கு வழங்குவது.",
    ai_badge: "AI-இயங்கும் தாக்கம்",
    hero_title1: "உணவு வீணாவதை அனுமதிக்காதீர்கள். ",
    hero_title2: "நாளைக்கு உணவளிப்போம்.",
    hero_desc: "SharePlate உங்கள் உபரி உணவை மற்றவர்களின் அடுத்த உணவாக மாற்ற AI-ஐப் பயன்படுத்துகிறது.",

    impact_orphanage: "அனாதை இல்ல ஆதரவு",
    impact_hunger: "பசி நிவாரணம்",
    impact_community: "சமூக வளர்ச்சி",

    who_title: "நாங்கள் யாருக்கு உதவுகிறோம்",
    who_desc: "உங்கள் தானங்கள் எங்கள் சரிபார்க்கப்பட்ட நெட்வொர்க் மூலம் தேவைப்படுபவர்களை சென்றடைகின்றன.",
    who_orphan_title: "அனாதை இல்லங்கள்",
    who_orphan_desc: "குழந்தைகள் ஆரோக்கியமாகவும் வலுவாகவும் வளர சத்தான உணவை வழங்குதல்.",
    who_poor_title: "ஏழைகள் மற்றும் பசியால் வாடுபவர்கள்",
    who_poor_desc: "உணவுப் பாதுகாப்பின்மையால் வாடும் தனிநபர்கள் மற்றும் குடும்பங்களுக்கு தினசரி உணவை வழங்குதல்.",
    who_community_title: "சமூக மையங்கள்",
    who_community_desc: "மக்களுக்கு உண்ண பாதுகாப்பான இடத்தை வழங்கும் உள்ளூர் சமையலறைகளை ஆதரித்தல்.",

    how_title: "இது எப்படி வேலை செய்கிறது",
    how_subtitle: "பெரிய மாற்றத்தை ஏற்படுத்த மூன்று எளிய படிகள்.",
    how_step1_title: "புகைப்படம் எடுத்து பட்டியலிடுங்கள்",
    how_step1_desc: "புகைப்படத்தைப் பதிவேற்றவும். எங்கள் AI உணவைக் கண்டறிந்து உடனடியாகப் பட்டியலிடுகிறது.",
    how_step2_title: "AI பொருத்தம்",
    how_step2_desc: "சரியான அனாதை இல்லம் அல்லது NGO-வைக் கண்டறிய அவசரம் மற்றும் அருகாமை ஆகியவற்றை நாங்கள் பகுப்பாய்வு செய்கிறோம்.",
    how_step3_title: "பிக்-அப் மற்றும் புன்னகை",
    how_step3_desc: "ஒரு தன்னார்வலர் அல்லது NGO உணவைச் சேகரித்து தேவைப்படுபவர்களுக்கு வழங்குகிறார்.",

    feat_title: "ஸ்மார்ட் அம்சங்கள்",
    feat_subtitle: "சமூக நன்மைக்கான மேம்பட்ட தொழில்நுட்பம்.",
    cta_title: "தாக்கத்தை ஏற்படுத்தத் தயாரா?",
    cta_desc: "ஒவ்வொரு தானமும் முக்கியமானது. இன்று பசிக்கு எதிரான போராட்டத்தில் நூற்றுக்கணக்கானவர்களுடன் சேருங்கள்.",

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
    mission_banner: "మా లక్ష్యం: ప్రతి ఉపయోగపడే ఆహారాన్ని స్థానిక అనాథాశ్రమాలకు మరియు సామాజిక వంటశాలలకు చేరవేయడం.",
    ai_badge: "AI-ఆధారిత ప్రభావం",
    hero_title1: "ఆహారాన్ని వృథా కానివ్వకండి. ",
    hero_title2: "భవిష్యత్తుకు ఆహారాన్ని అందించండి.",
    hero_desc: "SharePlate మీ అదనపు ఆహారాన్ని మరొకరి తదుపరి భోజనంగా మార్చడానికి AIని ఉపయోగిస్తుంది.",

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
    cta_desc: "ప్రతి దానం ముఖ్యం. ఆకలిపై పోరాటంలో ఈరోజే వందలాది మందితో చేరండి.",

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
