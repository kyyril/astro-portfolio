# Style Cleanup Documentation

## Perubahan yang Dilakukan

### 1. Konsolidasi CSS ke global.css

Semua style dan warna telah dipindahkan ke `public/global.css` untuk konsistensi:

- **CSS Variables**: Semua warna dan variabel performa terpusat
- **Component Styles**: Terminal, Navigation, Guestbook, Theme Toggle
- **Utility Classes**: Helper classes untuk layout dan responsif
- **Performance Optimizations**: GPU acceleration, containment, transitions

### 2. File yang Dihapus

- `src/assets/guestbook.css` - Style dipindahkan ke global.css

### 3. File yang Dibersihkan

#### Layout.astro

- Hapus duplicate CSS variables dari `<style>` block
- Hapus hardcoded styles
- Semua styling sekarang menggunakan global.css

#### Navigation.astro

- Hapus inline styles dan Tailwind classes dengan hardcoded values
- Ganti dengan semantic class names: `.nav-bar`, `.nav-item`, `.nav-svg`
- Hapus `@apply` directives

#### ThemeToggle.astro

- Hapus hardcoded Tailwind classes
- Ganti dengan semantic class names: `.theme-toggle-btn`, `.theme-dropdown`

#### Terminal.astro

- Hapus hardcoded background colors
- Ganti dengan semantic class names: `.terminal-glass`, `.terminal-default`

#### public/tailwind.css

- Hapus duplicate CSS variables dan styles

### 4. CSS Variables Terpusat

```css
:root {
  /* Colors */
  --color-primary: #89b4fa;
  --color-secondary: #cba6f7;
  --color-accent: #f9e2af;
  --color-background: #1e1e2e;
  --color-surface: #313244;
  --color-text: #cdd6f4;
  --color-border: #45475a;
  --color-surface-rgb: 49, 50, 68;
  --color-muted: #6c7086;
  --color-success: #a6e3a1;
  --color-error: #f38ba8;

  /* Performance */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
  --border-radius: 8px;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);
}
```

### 5. Component Classes

#### Navigation

- `.nav-bar` - Main navigation container
- `.nav-container` - Navigation items wrapper
- `.nav-item` - Individual navigation links
- `.nav-svg` - Navigation icons
- `.nav-spacer` - Bottom spacing

#### Theme Toggle

- `.theme-toggle-wrapper` - Container
- `.theme-toggle-btn` - Toggle button
- `.theme-dropdown` - Dropdown menu
- `.theme-option` - Individual theme options

#### Terminal

- `.terminal-window` - Main container
- `.terminal-glass` - Glass variant
- `.terminal-default` - Default variant
- `.terminal-header` - Header section
- `.terminal-controls` - Window controls

#### Guestbook

- `.guestbook-container` - Main container
- `.message-item` - Individual messages
- `.form-input` - Form inputs
- `.btn`, `.btn-primary` - Buttons

### 6. Performance Optimizations

- **CSS Containment**: `contain: layout style paint`
- **GPU Acceleration**: `transform: translate3d(0, 0, 0)`
- **Efficient Transitions**: Menggunakan CSS variables
- **Reduced Motion Support**: `@media (prefers-reduced-motion: reduce)`
- **Mobile Optimizations**: Responsive breakpoints

### 7. Keuntungan

1. **Konsistensi**: Semua komponen menggunakan sistem warna yang sama
2. **Maintainability**: Perubahan warna hanya perlu dilakukan di satu tempat
3. **Performance**: CSS terpusat, lebih efisien loading
4. **Semantic**: Class names yang meaningful dan mudah dipahami
5. **Responsive**: Mobile-first approach dengan breakpoints yang konsisten
6. **Accessibility**: Support untuk reduced motion dan high contrast

### 8. Cara Menggunakan

Untuk mengubah warna tema, edit CSS variables di `public/global.css`:

```css
:root {
  --color-primary: #your-color;
  --color-secondary: #your-color;
  /* dst... */
}
```

Semua komponen akan otomatis menggunakan warna baru tanpa perlu edit individual files.

## Update Terbaru - Pembersihan Total Hardcoded Colors

### File yang Dibersihkan Lebih Lanjut:

#### src/assets/background.css

- ✅ Ganti semua `rgba(137, 180, 250, ...)` dengan `rgba(var(--color-primary-rgb), ...)`
- ✅ Ganti semua `rgba(203, 166, 247, ...)` dengan `rgba(var(--color-secondary-rgb), ...)`
- ✅ Ganti semua `rgba(249, 226, 175, ...)` dengan `rgba(var(--color-accent-rgb), ...)`
- ✅ Ganti hardcoded background gradients dengan CSS variables

#### tailwind.config.mjs

- ✅ Hapus semua hardcoded color definitions
- ✅ Hanya gunakan CSS variables dari global.css

#### public/global.css

- ✅ Tambah RGB variables: `--color-primary-rgb`, `--color-secondary-rgb`, `--color-accent-rgb`
- ✅ Ganti terminal control colors dengan CSS variables
- ✅ Semua warna sekarang menggunakan CSS variables

#### src/layouts/Layout.astro

- ✅ Hapus hardcoded `theme-color` meta tag
- ✅ Theme color sekarang diatur dinamis oleh ThemeProvider

#### src/components/ThemeProvider.astro

- ✅ Tambah fungsi untuk update theme-color meta tag dinamis
- ✅ Tambah konversi hex ke RGB untuk background animations
- ✅ Update RGB variables saat theme berubah

### Hasil Akhir:

🎯 **100% BEBAS HARDCODED COLORS** - Semua warna sekarang terpusat di global.css dan dapat diubah melalui theme system!
