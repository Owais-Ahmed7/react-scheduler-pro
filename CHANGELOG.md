# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-03-19

### Added
- **Drag & Drop**: Native drag-and-drop for moving events across time slots, days, and resources
- **Event Resize**: Drag the bottom edge of events to change duration
- **Touch Support**: Full touch support for drag-and-drop and resize on mobile devices
- **Controlled Component API**: Support for controlled `selectedDate` + `onNavigate` and `view` + `onView`
- **Dark Mode**: Built-in dark theme via `[data-theme="dark"]` or `.rsp-dark` class
- **CSS Custom Properties**: Full theming support via `--rsp-*` CSS variables
- **Keyboard Navigation**: Full keyboard accessibility with arrow keys, Enter, Space, Escape
- **Screen Reader Support**: Live regions, ARIA labels, and proper roles for WCAG 2.1 AA
- **Focus Management**: Focus trap in modals/popovers, focus restoration on close
- **Focus Indicators**: Visible focus outlines for all interactive elements
- **ESM Support**: Dual CJS/ESM output for tree-shaking and modern bundlers
- **Type Exports**: All TypeScript types exported from package entry point
- **Test Suite**: Comprehensive unit and integration tests with 70%+ coverage
- **CI Pipeline**: GitHub Actions workflow for lint, test, and build

### Changed
- **TypeScript Overhaul**: Replaced `any` types with proper interfaces and generics throughout
- **Build System**: Migrated from Webpack to tsup for faster builds and proper ESM/CJS output
- **CSS Architecture**: Replaced hardcoded colors with CSS custom properties (`--rsp-*`)
- **Utilities Cleanup**: Removed unused Bootstrap utility classes, reduced CSS by ~10KB
- **Package.json**: Added `peerDependencies` for react/react-dom, proper `exports` field
- **Description**: Updated package description to be more professional and keyword-rich

### Fixed
- **TypeScript**: Fixed `disptach` typo to `dispatch` in types
- **Dependencies**: Removed `typescript` from runtime dependencies (was incorrectly in `dependencies`)
- **Files Field**: Changed from `["*"]` (shipping everything) to `["dist"]` (shipping only build output)
- **Homepage**: Set proper homepage URL
- **SSR Compatibility**: CSS now extracted to separate file instead of injected via JS

### Removed
- Bootstrap dependency for utility classes (replaced with lean, scoped utilities)
- Runtime TypeScript dependency

## [1.3.1] - Previous Release

### Added
- Work week view with configurable days
- Timezone support with date-fns-tz
- Resource-based event grouping
- Custom event templates
- Locale/i18n support via date-fns locales
