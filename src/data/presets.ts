import { PresetTemplate } from '../types';

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'wifi_guest_keychain',
    title: 'Guest Wi-Fi Keychain',
    description: 'Hang this on your entryway key rack or coffee table for instant guest connection with zero password typing.',
    category: 'wifi',
    mode: 'wifi',
    wifi: {
      ssid: 'Guest_WiFi',
      password: 'WelcomeHome2026',
      encryption: 'WPA'
    },
    recommendedEcl: 'H',
    recommendedDarkColorId: 'perler-black',
    recommendedBeadSize: '5.0mm',
    badge: 'Best for Home & Cafés'
  },
  {
    id: 'social_linktree',
    title: 'Link-in-Bio / Instagram Tag',
    description: 'Compact personal showcase or portfolio link for conventions, artist alleys, and craft fairs.',
    category: 'social',
    mode: 'url',
    urlText: 'https://linktr.ee/artist',
    recommendedEcl: 'H',
    recommendedDarkColorId: 'perler-dark-blue',
    recommendedBeadSize: '2.6mm',
    badge: 'Popular for Artists'
  },
  {
    id: 'music_song_gift',
    title: 'Retro Song Surprise',
    description: 'Encode a favorite Spotify / YouTube song or anniversary playlist into an 8-bit retro pixel pendant.',
    category: 'music',
    mode: 'url',
    urlText: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
    recommendedEcl: 'M',
    recommendedDarkColorId: 'perler-plum',
    recommendedBeadSize: '5.0mm',
    badge: 'Romantic & Meaningful'
  },
  {
    id: 'pet_emergency_tag',
    title: 'Pet ID / ICE Emergency Collar',
    description: 'Direct telephone dialing payload for a pet collar or senior emergency contact pendant.',
    category: 'emergency',
    mode: 'url',
    urlText: 'tel:+15550199248',
    recommendedEcl: 'H',
    recommendedDarkColorId: 'perler-black',
    recommendedBeadSize: '2.6mm',
    badge: 'Lifesaver Utility'
  },
  {
    id: 'coffee_crypto_tip',
    title: 'Tip Jar / Coffee Support',
    description: 'Place on your craft desk, food cart, or live-stream background for tip jar or Ko-fi support.',
    category: 'crypto',
    mode: 'url',
    urlText: 'https://buymeacoffee.com/creator',
    recommendedEcl: 'H',
    recommendedDarkColorId: 'perler-dark-green',
    recommendedBeadSize: '5.0mm',
    badge: 'Creator Essential'
  },
  {
    id: 'secret_love_message',
    title: 'Secret Love Message',
    description: 'Surprise your partner or friend with a hidden text message that reveals itself only when scanned by a phone camera.',
    category: 'secret',
    mode: 'url',
    urlText: 'You are my favorite pixel in the universe! ❤️',
    recommendedEcl: 'H',
    recommendedDarkColorId: 'perler-cranberry',
    recommendedBeadSize: '5.0mm',
    badge: 'Heartfelt Gift'
  }
];
