/**
 * Color palette for AI Travel Planner:
 * Primary: #2D3250 (Deep Navy Blue - Trust & Intelligence)
 * Secondary: #424769 (Muted Blue - Sophistication)
 * Tertiary: #676F9D (Lavender Blue - Innovation)
 * Accent: #7C93C3 (Sky Blue - Travel & Freedom)
 * Background: #F5F7FF (Light Blue-White - Clean & Modern)
 * Success: #4CAF50 (Green - Confirmation)
 * Error: #FF5252 (Red - Alerts)
 * Warning: #FFC107 (Amber - Notifications)
 */

const colors = {
  primary: "#2D3250",
  secondary: "#424769",
  tertiary: "#676F9D",
  accent: "#7C93C3",
  background: "#F5F7FF",
  success: "#4CAF50",
  error: "#FF5252",
  warning: "#FFC107",
};

export const Colors = {
  light: {
    text: "#2D3250", // primary for strong readability
    background: "#F5F7FF", // light background
    tint: "#7C93C3", // accent for interactive elements
    icon: "#676F9D", // tertiary for subtle icons
    tabIconDefault: "#424769", // secondary for inactive tabs
    tabIconSelected: "#7C93C3", // accent for active tabs
    card: "#FFFFFF",
    border: "#E1E5F2", // light border color
    notification: "#FF5252", // error color for notifications
  },
  dark: {
    text: "#F5F7FF", // background color for text
    background: "#2D3250", // primary as background
    tint: "#7C93C3", // accent stays same
    icon: "#676F9D", // tertiary stays same
    tabIconDefault: "#424769", // secondary stays same
    tabIconSelected: "#F5F7FF", // background color for active
    card: "#424769", // secondary for cards
    border: "#676F9D", // tertiary for borders
    notification: "#FF5252", // error stays same
  },
  // Raw colors for direct usage
  raw: {
    ...colors,
    white: "#FFFFFF",
    black: "#000000",
    cardShadow: "rgba(45, 50, 80, 0.1)", // primary with opacity
    overlay: "rgba(45, 50, 80, 0.5)", // primary with opacity
    // Additional utility colors
    inputBackground: "#FFFFFF",
    inputBorder: "#E1E5F2",
    buttonDisabled: "#A0A0A0",
    link: "#7C93C3", // accent
    placeholder: "#9AA0BC",
    // Gradients
    gradientStart: "#2D3250",
    gradientEnd: "#7C93C3",
  },
};
