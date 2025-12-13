# PayPal Integration Setup

## 1. PayPal Developer Account einrichten

1. Gehe zu https://developer.paypal.com
2. Melde dich an oder erstelle einen Developer Account
3. Gehe zu "Dashboard" → "Apps & Credentials"

## 2. Sandbox App erstellen (für Tests)

1. Wähle "Sandbox" aus
2. Klicke auf "Create App"
3. App Name: "Klausuren Portal Sandbox"
4. Kopiere die **Client ID** und **Secret**
5. Füge sie in `.env.local` ein:
   ```
   PAYPAL_CLIENT_ID=deine-sandbox-client-id
   PAYPAL_CLIENT_SECRET=deine-sandbox-secret
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=deine-sandbox-client-id
   ```

## 3. Sandbox Test Accounts

PayPal erstellt automatisch Test-Accounts:
- **Buyer Account**: Zum Testen von Käufen
- **Seller Account**: Empfängt die Test-Zahlungen

Finde diese unter "Sandbox" → "Accounts"

## 4. Testen

1. Server starten: `npm run dev`
2. Klausur auswählen
3. Auf "Jetzt kaufen" klicken
4. Mit PayPal Sandbox Buyer Account einloggen
5. Zahlung abschließen

## 5. Live-Modus (Produktion)

Wenn alles funktioniert:

1. Wähle "Live" statt "Sandbox"
2. Erstelle eine Live App
3. Kopiere die Live Credentials
4. Füge sie in Vercel Environment Variables ein
5. Stelle sicher dass `NODE_ENV=production` gesetzt ist

## Preise ändern

Standard Preis: 2,99 € pro Klausur

Ändern in:
- `pages/exams/index.tsx` (Zeile mit "2.99")
- `pages/payment/index.tsx` (examPrice default)

## Wichtig

- Sandbox Credentials funktionieren nur im Development
- Live Credentials nur in Production verwenden
- NIEMALS Secrets in Git committen
