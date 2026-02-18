

# Full Spanish Language Support via Splash Screen Toggle

## Overview
Add a second "Comenzar" button on the splash screen that, when tapped, switches the entire app to Spanish. This includes all UI text, the onboarding tour, navigation labels, page content, form labels, AI assistant responses, and the chatbot's system prompt.

## How It Works

1. **Splash screen gets two buttons**: The existing red "Get Started" button stays. Below it, a clear/outline-style button reads "Comenzar" (Spanish for "Get Started"). Tapping either sets the language globally.

2. **Language context**: A new `LanguageProvider` wraps the app, storing `'en' | 'es'` in React context and `localStorage` (so it persists). Every component can call `useLanguage()` to get the current language and a translation helper `t(key)`.

3. **Translation dictionary**: A single `src/i18n/translations.ts` file holds all English and Spanish strings keyed by identifier (e.g., `"cart.empty.title"`, `"nav.browse"`, `"onboarding.slide1.title"`). This keeps translations centralized and easy to maintain.

4. **AI chatbot in Spanish**: The language preference is passed to the AI edge function so its system prompt instructs it to respond entirely in Spanish when `lang=es`.

---

## What Changes

### New Files
- **`src/store/languageContext.tsx`** -- React context with `lang`, `setLang`, and `t(key)` helper
- **`src/i18n/translations.ts`** -- All English/Spanish string pairs (~150-200 keys covering every page)

### Modified Files

| File | Change |
|------|--------|
| `src/pages/Splash.tsx` | Add outline "Comenzar" button that sets language to Spanish before navigating |
| `src/App.tsx` | Wrap app in `LanguageProvider` |
| `src/components/BottomNav.tsx` | Replace hardcoded labels with `t('nav.browse')`, `t('nav.askAi')`, etc. |
| `src/components/OnboardingTour.tsx` | Translate all 3 slide titles and descriptions |
| `src/components/PageHeader.tsx` | Translate "BULK" badge and accessibility tooltip |
| `src/components/SmartCartSuggestions.tsx` | Translate "You might also need" heading |
| `src/pages/Login.tsx` | Translate all labels, placeholders, and buttons |
| `src/pages/Signup.tsx` | Translate all labels and buttons |
| `src/pages/Welcome.tsx` | Translate all 4 steps (entry, mode, store, identify) |
| `src/pages/Browse.tsx` | Translate search placeholders, filter labels, empty states |
| `src/pages/Cart.tsx` | Translate smart messages, summary text, buttons |
| `src/pages/Confirmation.tsx` | Translate order confirmation text |
| `src/pages/OrderStatus.tsx` | Translate tracking steps and labels |
| `src/pages/AiAssistant.tsx` | Translate quick prompts, follow-ups, welcome message, and all hardcoded response text |
| `src/components/StoreSwitcher.tsx` | Translate labels |
| `src/components/PickupScheduler.tsx` | Translate scheduling labels |
| `supabase/functions/grocery-ai/index.ts` | Accept `lang` param; switch system prompt to Spanish when `lang=es` |

---

## Technical Details

### Language Context API
```typescript
// Usage in any component:
const { lang, t } = useLanguage();

// Example:
<Button>{t('splash.getStarted')}</Button>
// Returns "Get Started" or "Comenzar" based on lang
```

### Translation file structure
```typescript
export const translations = {
  'splash.getStarted': { en: 'Get Started', es: 'Comenzar' },
  'nav.browse': { en: 'Browse', es: 'Explorar' },
  'nav.askAi': { en: 'Ask AI', es: 'Preguntar IA' },
  'nav.cart': { en: 'Cart', es: 'Carrito' },
  'nav.orders': { en: 'Orders', es: 'Pedidos' },
  'cart.empty.title': { en: 'Your cart is empty', es: 'Tu carrito esta vacio' },
  // ... ~150-200 more keys
};
```

### Splash screen layout
- Red filled button: "Get Started" (sets lang to English)
- Clear outline button below it: "Comenzar" (sets lang to Spanish)
- Both navigate to `/login`

### AI Edge Function
- The `lang` parameter is sent with each request
- When `lang=es`, the system prompt changes to: "Respond entirely in Spanish. You are a bilingual assistant at Amapola Market..."

