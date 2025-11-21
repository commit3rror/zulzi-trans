# Zulzi Trans - Copilot Instructions

## Project Overview
**Zulzi Trans** is a transportation and logistics platform built with **Laravel** (backend) + **React with Inertia.js** (frontend). It connects customers with drivers and provides fleet management for multiple service types (passenger transport, logistics, etc.).

## Architecture

### Tech Stack
- **Backend**: Laravel 11 (API + Inertia.js server-side rendering)
- **Frontend**: React with Inertia.js (SPA-like experience with server routing)
- **Database**: MySQL (migrations in `database/migrations/`)
- **Styling**: Tailwind CSS v4 + Lucide React icons
- **Build Tools**: Vite, PostCSS

### Key Components Structure

**Models** (`app/Models/`)
- `User` - Customers & Admin (role_pengguna: 'Admin'|'Customer'|'Supir')
- `Armada` - Vehicles fleet
- `Pemesanan` - Orders/bookings
- `Layanan` - Service types/categories
- `Supir` - Drivers
- `Pembayaran` - Payments
- `Ulasan` - Reviews/ratings

**Frontend Pages** (`resources/js/Pages/`)
- Public pages in `public/` subfolder
- LandingPage.jsx - Main landing with services showcase
- AboutPage.jsx - Company info (includes styled components pattern)
- Auth pages use Inertia form submission with Laravel validation

### Data Flow
1. Frontend components call service functions from `resources/js/services/`
2. Services make API calls to Laravel routes
3. Controllers return structured JSON with `.data.data` or `.data` structure
4. Frontend handles empty states and loading states

## Key Patterns & Conventions

### React Component Conventions
- Components in PascalCase (`Navbar`, `Footer`, `AboutPage`)
- Props include `auth` object from Inertia server middleware
- Lucide React icons imported per-component
- Tailwind classes use custom colors: `[#003366]`, `[#00a3e0]`

### Styling Approach
- **Primary colors**: `#003366` (dark blue), `#00a3e0` (cyan)
- **Backgrounds**: `#f0f9ff` (light blue), white with subtle gradients
- **No shadcn/ui** - Use native Tailwind + Lucide icons
- **Animations**: Custom keyframes in `resources/css/app.css` (fadeIn, slideUp, etc.)
- **Responsive**: Mobile-first with `md:` breakpoint focus

### Custom Animations
Add animation delays with `style={{animationDelay: '0.1s'}}`:
```jsx
<h1 className="animate-slide-up" style={{animationDelay: '0.2s'}}>Text</h1>
```
Available: `animate-fade-in`, `animate-fade-in-up`, `animate-slide-up`

### Form Handling
- Use Inertia's `useForm` hook for server-side validation
- Validation errors returned in `errors` object
- File structure: `app/Http/Requests/` for form request classes

### API Response Structure
```javascript
// Expected format from getPublicServices(), getPublicReviews()
{
  data: {
    data: [...] // or direct array if structured differently
  }
}
```
Always handle both `response.data.data` and `response.data` safely.

## Development Workflows

### Running the Application
```bash
# Install dependencies
npm install
composer install

# Development server (Vite + Laravel)
npm run dev
php artisan serve

# Build for production
npm run build
php artisan optimize
```

### Database Management
- Migrations auto-run during setup
- Seeders in `database/seeders/` (AdminSeeder, PenggunaSeeder)
- Run seeders: `php artisan db:seed`

### Frontend Modifications
1. Update `.jsx` files in `resources/js/Pages/`
2. Run `npm run dev` - Vite watches for changes
3. Tailwind classes apply automatically with hot reload
4. No build step needed during development

## Critical Integration Points

### Inertia.js
- All page components receive props from Laravel controller
- Use `Link` component for navigation (not `<a>` tags)
- `useForm` hook for form submission with CSRF protection

### Service Layer
- Location: `resources/js/services/`
- Example: `getPublicServices()` and `getPublicReviews()`
- Wrap API calls in try/catch, handle JSON parse errors

### Authentication
- Check `props.auth` in component (comes from Laravel middleware)
- Verify `auth.user` exists before rendering user-specific UI
- Admin role check: `auth.user?.role_pengguna === 'Admin'`

## Recent Enhancements (Landing Page)
- **Interactive features section** with hover state rotation (auto-cycles every 5s)
- **Animated hero** with gradient backgrounds and floating elements
- **Enhanced service cards** with gradient buttons and better spacing
- **Improved testimonial cards** with larger avatars and hover animations
- **CTA section redesigned** with dual button layout and decorative background
- **Custom animations** added: slideUp, fadeInUp, fadeIn with staggered delays
- **Tailwind config** extended with custom keyframes in `theme.extend.animation`

## Common Tasks

### Add New Service Type
1. Create migration: `php artisan make:migration create_xxxxx_table`
2. Define model relationship in `App/Models/Layanan`
3. Create API endpoint in `routes/api.php`
4. Call from React service layer

### Style New Component
- Use Tailwind only (no CSS modules)
- Reference color palette: `[#003366]`, `[#00a3e0]`
- Add hover states with `group` class for nested interactions
- Mobile: `md:` breakpoint for tablet+, `lg:` for desktop+

### Fix Loading/Empty States
- Wrap content in `{loading ? <spinner /> : <content />}`
- Use custom spinner: `border-[#00a3e0]` colors
- Show fallback message: "Belum ada [item type]."

## Debugging Tips

### API Calls Not Working
- Check service function returns proper response structure
- Log `response.data` to see actual response format
- Ensure CSRF token in Laravel (Inertia handles this automatically)

### Styling Issues
- Clear browser cache or use incognito
- Verify Tailwind classes compile (check `npm run dev` output)
- Check responsive breakpoint (`md:` vs `lg:` vs default)

### State Not Updating
- Verify dependency arrays in `useEffect` are correct
- Check if state setter is being called
- Look for console errors in browser DevTools

## File Reference
- **Landing Page**: `resources/js/Pages/public/LandingPage.jsx`
- **About Page**: `resources/js/Pages/AboutPage.jsx`
- **Styling Config**: `tailwind.config.js`, `resources/css/app.css`
- **Routes**: `routes/web.php` (frontend), `routes/api.php` (backend)
- **Services**: `resources/js/services/serviceService.js`, `reviewService.js`
