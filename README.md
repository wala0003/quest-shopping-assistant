# Quest Shopping Assistant

AI-powered Chrome extension that helps find the best deals and automatically applies coupons while shopping online.

## Features

- 🔐 Secure authentication with Supabase
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 🚀 Built with Plasmo Framework
- 🔄 Automatic coupon application
- 💾 Persistent storage with Chrome Storage API

## Tech Stack

- [Plasmo](https://docs.plasmo.com/) - The Browser Extension Framework
- [React](https://reactjs.org/) - UI Library
- [TypeScript](https://www.typescriptlang.org/) - Language
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Supabase](https://supabase.io/) - Backend & Authentication
- [shadcn/ui](https://ui.shadcn.com/) - UI Components

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Loading the extension

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `build/chrome-mv3-dev` directory

## Project Structure

```
src/
├── popup.tsx           # Main extension popup
├── background/         # Background scripts
├── components/        # React components
├── core/             # Core functionality
└── lib/              # Utility functions
```

## Environment Variables

Create a `.env.development` file with:

```env
PLASMO_PUBLIC_SUPABASE_URL="your-supabase-url"
PLASMO_PUBLIC_SUPABASE_KEY="your-supabase-anon-key"
```

## Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
